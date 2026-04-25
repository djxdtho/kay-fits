import { useState, useEffect } from 'react'
import { Package, Users, Search, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCartStore, Order, Product } from '../store/cart'
import { toast } from 'sonner'

interface OrderWithItems extends Order {
  items: { product: Product; quantity: number; size: string; color: string; price: number }[]
  user_email?: string
}

const statusFlow = ['pending', 'confirmed', 'on_the_way', 'delivered']

export default function Admin() {
  const { user } = useCartStore()
  const [orders, setOrders] = useState<OrderWithItems[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)

  const isAdmin = user?.email?.includes('admin') || user?.id === 'admin'

  useEffect(() => {
    if (isAdmin) {
      fetchOrders()
      fetchUsers()
    }
  }, [isAdmin])

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, 99)

      if (error) throw error

      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*, products(*)')
            .eq('order_id', order.id)

          const { data: userData } = await supabase
            .from('users')
            .select('email')
            .eq('id', order.user_id)
            .single()

          return {
            ...order,
            items: items?.map(item => ({
              product: item.products,
              quantity: item.quantity,
              size: item.size,
              color: item.color,
              price: item.price,
            })) || [],
            user_email: userData?.email,
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

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, 99)

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const updateOrderStatus = async (orderId: number, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status: newStatus })
        .eq('id', orderId)

      if (error) throw error

      setOrders(orders.map(o => 
        o.id === orderId ? { ...o, status: newStatus as any } : o
      ))
      toast.success(`Order #${orderId} marked as ${newStatus}`)
    } catch (err) {
      console.error('Error updating order:', err)
      toast.error('Failed to update order')
    }
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id.toString().includes(searchTerm) ||
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.shipping_address?.toLowerCase().includes(searchTerm.toLowerCase())
    
    const matchesStatus = !statusFilter || order.status === statusFilter
    
    return matchesSearch && matchesStatus
  })

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-yellow-100 text-yellow-800'
      case 'confirmed': return 'bg-blue-100 text-blue-800'
      case 'on_the_way': return 'bg-purple-100 text-purple-800'
      case 'delivered': return 'bg-green-100 text-green-800'
      case 'cancelled': return 'bg-red-100 text-red-800'
      case 'failed': return 'bg-red-100 text-red-800'
      default: return 'bg-gray-100 text-gray-800'
    }
  }

  if (!isAdmin) {
    return (
      <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center py-16">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-6" />
          <h1 className="font-display text-2xl font-bold mb-4">Access Denied</h1>
          <p className="text-gray-500">You don't have admin access.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-8">Admin Panel</h1>

        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
          <div className="bg-gray-50 rounded-lg p-4">
            <p className="text-2xl font-bold">{orders.length}</p>
            <p className="text-sm text-gray-500">Total Orders</p>
          </div>
          <div className="bg-yellow-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-yellow-600">
              {orders.filter(o => o.status === 'pending').length}
            </p>
            <p className="text-sm text-gray-500">Pending</p>
          </div>
          <div className="bg-blue-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-blue-600">
              {orders.filter(o => o.status === 'confirmed').length}
            </p>
            <p className="text-sm text-gray-500">Confirmed</p>
          </div>
          <div className="bg-green-50 rounded-lg p-4">
            <p className="text-2xl font-bold text-green-600">
              {orders.filter(o => o.status === 'delivered').length}
            </p>
            <p className="text-sm text-gray-500">Delivered</p>
          </div>
        </div>

        <div className="flex gap-4 border-b mb-6">
          <button
            onClick={() => setActiveTab('orders')}
            className={`pb-4 px-4 font-medium flex items-center gap-2 ${
              activeTab === 'orders'
                ? 'border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            <Package className="w-5 h-5" />
            Orders ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('users')}
            className={`pb-4 px-4 font-medium flex items-center gap-2 ${
              activeTab === 'users'
                ? 'border-b-2 border-black'
                : 'text-gray-500'
            }`}
          >
            <Users className="w-5 h-5" />
            Users ({users.length})
          </button>
        </div>

        {activeTab === 'orders' && (
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
            >
              <option value="">All Status</option>
              <option value="pending">Pending</option>
              <option value="confirmed">Confirmed</option>
              <option value="on_the_way">On the Way</option>
              <option value="delivered">Delivered</option>
              <option value="cancelled">Cancelled</option>
              <option value="failed">Failed</option>
            </select>
          </div>
        )}

        {activeTab === 'orders' && (
          loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-20 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : filteredOrders.length === 0 ? (
            <div className="text-center py-16">
              <Package className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No orders found</p>
            </div>
          ) : (
            <div className="space-y-4">
              {filteredOrders.map((order) => (
                <div key={order.id} className="border rounded-lg overflow-hidden">
                  <div 
                    className="p-4 flex flex-wrap items-center justify-between gap-4 cursor-pointer hover:bg-gray-50"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      {expandedOrder === order.id ? (
                        <ChevronUp className="w-5 h-5" />
                      ) : (
                        <ChevronDown className="w-5 h-5" />
                      )}
                      <div>
                        <p className="font-medium">Order #{order.id}</p>
                        <p className="text-sm text-gray-500">{order.user_email}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <span className={`px-3 py-1 rounded-full text-sm ${getStatusColor(order.status)}`}>
                        {order.status.replace('_', ' ').toUpperCase()}
                      </span>
                      <span className="font-medium">₦{order.total.toLocaleString()}</span>
                    </div>
                  </div>

                  {expandedOrder === order.id && (
                    <div className="border-t p-4 bg-gray-50">
                      <div className="grid md:grid-cols-2 gap-6">
                        <div>
                          <h4 className="font-medium mb-2">Customer Details</h4>
                          <p className="text-sm text-gray-600">{order.shipping_address}</p>
                          <p className="text-sm mt-2">Payment: {order.payment_method === 'bank_transfer' ? 'Bank Transfer' : 'Pay on Delivery'}</p>
                        </div>
                        <div>
                          <h4 className="font-medium mb-2">Items</h4>
                          {order.items?.map((item, i) => (
                            <p key={i} className="text-sm text-gray-600">
                              {item.quantity}x {item.product?.name} ({item.size}/{item.color})
                            </p>
                          ))}
                        </div>
                      </div>

                      <div className="mt-4 pt-4 border-t flex flex-wrap gap-2">
                        <p className="text-sm text-gray-500 mr-4">Update Status:</p>
                        {statusFlow.map((status) => (
                          <button
                            key={status}
                            onClick={() => updateOrderStatus(order.id, status)}
                            disabled={order.status === status}
                            className={`px-3 py-1 rounded text-sm disabled:opacity-50 ${
                              status === 'pending' ? 'bg-yellow-100 hover:bg-yellow-200' :
                              status === 'confirmed' ? 'bg-blue-100 hover:bg-blue-200' :
                              status === 'on_the_way' ? 'bg-purple-100 hover:bg-purple-200' :
                              'bg-green-100 hover:bg-green-200'
                            }`}
                          >
                            {status === 'on_the_way' ? 'On The Way' : status.charAt(0).toUpperCase() + status.slice(1)}
                          </button>
                        ))}
                        <button
                          onClick={() => updateOrderStatus(order.id, 'cancelled')}
                          className="px-3 py-1 rounded text-sm bg-red-100 hover:bg-red-200 text-red-800"
                        >
                          Cancel
                        </button>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          )
        )}

        {activeTab === 'users' && (
          loading ? (
            <div className="space-y-4">
              {[...Array(5)].map((_, i) => (
                <div key={i} className="animate-pulse h-16 bg-gray-100 rounded-lg" />
              ))}
            </div>
          ) : users.length === 0 ? (
            <div className="text-center py-16">
              <Users className="w-16 h-16 mx-auto text-gray-300 mb-4" />
              <p className="text-gray-500">No users registered</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b">
                    <th className="text-left py-3 px-4">Name</th>
                    <th className="text-left py-3 px-4">Email</th>
                    <th className="text-left py-3 px-4">Phone</th>
                    <th className="text-left py-3 px-4">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((u) => (
                    <tr key={u.id} className="border-b hover:bg-gray-50">
                      <td className="py-3 px-4">{u.full_name}</td>
                      <td className="py-3 px-4">{u.email}</td>
                      <td className="py-3 px-4">{u.phone}</td>
                      <td className="py-3 px-4">
                        {u.created_at ? new Date(u.created_at).toLocaleDateString() : 'N/A'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )
        )}
      </div>
    </div>
  )
}