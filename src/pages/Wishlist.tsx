import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Heart, Trash2, ShoppingBag } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { useCartStore, Product } from '../store/cart'
import { toast } from 'sonner'

export default function Wishlist() {
  const { wishlist, user, toggleWishlist } = useCartStore()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (wishlist.length > 0) {
      fetchProducts()
    } else {
      setLoading(false)
    }
  }, [wishlist])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .in('id', wishlist)
        .eq('in_stock', true)

      if (error) throw error
      setProducts(data || [])
    } catch (err) {
      console.error('Error:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleAddToBag = (product: Product) => {
    if (!user) {
      toast.error('Please login to add items to bag')
      return
    }
    useCartStore.getState().addItem(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'BLACK')
    toast.success('Added to bag!')
  }

  if (!user) {
    return (
      <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <Heart className="w-16 h-16 mx-auto text-gray-300 mb-6" />
          <h1 className="font-display text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-500 mb-8">Please login to view your wishlist.</p>
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
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-8">My Wishlist</h1>

        {loading ? (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <Heart className="w-16 h-16 mx-auto text-gray-300 mb-6" />
            <p className="text-gray-500 mb-4">Your wishlist is empty</p>
            <Link to="/shop" className="bg-black text-white px-8 py-3 rounded-full font-medium">
              Shop Now
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
            {products.map((product, i) => (
              <div 
                key={product.id} 
                className="group relative animate-fade-in"
                style={{ animationDelay: `${i * 50}ms` }}
              >
                <Link to={`/product/${product.id}`}>
                  <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-gray-100">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
                  <p className="text-gray-600 mt-1">₦{product.price.toLocaleString()}</p>
                </Link>
                
                <div className="flex gap-2 mt-3">
                  <button
                    onClick={() => handleAddToBag(product)}
                    className="flex-1 bg-black text-white py-2 rounded-full text-sm flex items-center justify-center gap-1 hover:bg-gray-800"
                  >
                    <ShoppingBag className="w-4 h-4" />
                    Add to Bag
                  </button>
                  <button
                    onClick={() => toggleWishlist(product.id)}
                    className="p-2 border rounded-full hover:bg-gray-50"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}