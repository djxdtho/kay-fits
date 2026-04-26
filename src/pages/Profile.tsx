import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { User, Package, Heart, ShoppingBag, LogOut } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { supabase, supabaseAdmin } from '../lib/supabase'
import { useCartStore, Order, Product } from '../store/cart'
import { toast } from 'sonner'

interface OrderWithItems extends Order {
  items: { product: Product; quantity: number; size: string; color: string; price: number; product_id?: number }[]
  payment_status?: string
  delivery_status?: string
}

export default function Profile() {
  const navigate = useNavigate()
  const { user, setUser } = useCartStore()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'wishlist'>('orders')

  useEffect(() => {
    if (user) {
      fetchOrders()
    }
  }, [user])

const fetchOrders = async () => {
    try {
      const { data: ordersData, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: false })

      if (error) throw error

      // Fetch order items for each order
      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabaseAdmin
            .from('order_items')
            .select('*')
            .eq('order_id', order.id)

          // Get product details for each item
          const itemsWithProducts = await Promise.all(
            (items || []).map(async (item) => {
              const { data: product } = await supabaseAdmin
                .from('products')
                .select('*')
                .eq('id', item.product_id)
                .single()
              
              return {
                ...item,
                product: product
              }
            })
          )

          return {
            ...order,
            items: itemsWithProducts
          }
        })
      )

      setOrders(ordersWithItems)
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    setUser(null)
    navigate('/')
    toast.success('Logged out')
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800'
      case 'confirmed':
        return 'bg-blue-100 text-blue-800'
      case 'on_the_way':
        return 'bg-purple-100 text-purple-800'
      case 'delivered':
        return 'bg-green-100 text-green-800'
      case 'cancelled':
      case 'failed':
        return 'bg-red-100 text-red-800'
      default:
        return 'bg-gray-100 text-gray-800'
    }
  }

  if (!user) {
    return (
      <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center py-16">
          <User className="w-16 h-16 mx-auto text-gray-300 mb-6" />
          <h1 className="font-display text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-500 mb-8">Please login to view your profile.</p>
          <Link to="/login" className="bg-black text-white px-8 py-3 rounded-full font-medium">
            Login
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-8">My Profile</h1>

        {/* Tabs */}
        <div className="flex gap-4 border-b mb-8">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-medium ${
              activeTab === 'orders'
                ? 'border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            <Package className="w-5 h-5 inline mr-2" />
            Orders
          </button>
          <button
            onClick={() => setActiveTab('wishlist')}
            className={`pb-4 px-4 font-medium ${
              activeTab === 'wishlist'
                ? 'border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            <Heart className="w-5 h-5 inline mr-2" />
            Wishlist
          </button>
        </div>

        {activeTab === 'orders' && (
          <>
            {loading ? (
              <div className="space-y-4">
                {[...Array(3)].map((_, i) => (
                  <div key={i} className="animate-pulse">
                    <div className="h-32 bg-gray-100 rounded-lg" />
                  </div>
                ))}
              </div>
            ) : orders.length === 0 ? (
              <div className="text-center py-16">
                <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">No orders yet</p>
                <Link to="/shop" className="text-black underline">
                  Start Shopping
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {orders.map((order) => (
                  <div key={order.id} className="border rounded-lg p-6">
                    <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
                      <div>
                        <p className="font-medium">Order #{(order as any).order_number || order.id}</p>
                        <p className="text-sm text-gray-500">
                          {new Date(order.created_at).toLocaleDateString()}
                        </p>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.payment_status === 'confirmed' ? 'bg-green-100 text-green-800' : 
                          order.payment_status === 'cancelled' ? 'bg-red-100 text-red-800' : 'bg-yellow-100 text-yellow-800'
                        }`}>
                          {order.payment_status}
                        </span>
                        <span className={`px-3 py-1 rounded-full text-sm ${
                          order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                          order.delivery_status === 'on_the_way' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {order.delivery_status === 'on_the_way' ? 'On The Way' : order.delivery_status}
                        </span>
                        <span className="font-medium">₦{Number(order.total).toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-2">
                      {order.items?.map((item, i) => (
                        <div key={i} className="flex items-center gap-4 text-sm">
                          <img
                            src={item.product?.image_url}
                            alt={item.product?.name}
                            className="w-12 h-16 object-cover rounded"
                          />
                          <div className="flex-1">
                            <p>{item.product?.name}</p>
                            <p className="text-gray-500">
                              {item.quantity}x • {item.size} • {item.color}
                            </p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'wishlist' && (
          <WishlistTab />
        )}

        {/* Logout */}
        <button
          onClick={handleLogout}
          className="mt-12 flex items-center gap-2 text-gray-500 hover:text-red-500"
        >
          <LogOut className="w-5 h-5" />
          Logout
        </button>
      </div>
    </div>
  )
}

function WishlistTab() {
  const { wishlist, user } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchWishlistProducts()
    } else {
      setLoading(false)
    }
  }, [wishlist])

  const fetchWishlistProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', wishlist)

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error fetching wishlist:', err)
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="text-center py-16">
        <p className="text-gray-500">Please login to view wishlist</p>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
        {[...Array(4)].map((_, i) => (
          <div key={i} className="animate-pulse">
            <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3" />
            <div className="h-4 bg-gray-200 rounded w-3/4" />
          </div>
        ))}
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="text-center py-16">
        <Heart className="w-16 h-16 mx-auto text-gray-300 mb-4" />
        <p className="text-gray-500 mb-4">Your wishlist is empty</p>
        <Link to="/shop" className="text-black underline">
          Add items
        </Link>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
      {products.map((product) => (
        <Link
          key={product.id}
          to={`/product/${product.id}`}
          className="group block"
        >
          <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-gray-100">
            <img
              src={product.image_url}
              alt={product.name}
              className="w-full h-full object-cover"
            />
          </div>
          <h3 className="font-medium text-sm">{product.name}</h3>
          <p className="text-gray-600 mt-1">₦{product.price.toLocaleString()}</p>
        </Link>
      ))}
    </div>
  )
}