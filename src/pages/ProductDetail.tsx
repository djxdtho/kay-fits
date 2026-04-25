import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Heart, ShoppingBag, Star, Truck, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product, useCartStore } from '../store/cart'
import { toast } from 'sonner'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

export default function ProductDetail() {
  const { id } = useParams()
  const navigate = useNavigate()
  const [product, setProduct] = useState<Product | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedImage, setSelectedImage] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState('')
  const [selectedColor, setSelectedColor] = useState('')
  const [showSizeError, setShowSizeError] = useState(false)
  
  const { addItem, wishlist, toggleWishlist, user } = useCartStore()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('id', id)
        .single()
      
      if (error) throw error
      setProduct(data)
      setSelectedSize(data.sizes?.[0] || 'M')
      setSelectedColor(data.colors?.[0] || 'BLACK')
    } catch (err) {
      console.error('Error fetching product:', err)
      navigate('/shop')
    } finally {
      setLoading(false)
    }
  }

  useGSAP(() => {
    if (product) {
      gsap.from('.product-detail', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        stagger: 0.1
      })
    }
  }, [product])

  const handleAddToBag = () => {
    if (!user) {
      toast.error('Please login to add items to bag')
      navigate('/login')
      return
    }
    if (!selectedSize) {
      setShowSizeError(true)
      toast.error('Please select a size')
      return
    }
    addItem(product!, selectedSize, selectedColor, quantity)
    toast.success('Added to bag!')
  }

  const handleBuyNow = () => {
    if (!user) {
      toast.error('Please login to purchase')
      navigate('/login')
      return
    }
    if (!selectedSize) {
      setShowSizeError(true)
      toast.error('Please select a size')
      return
    }
    addItem(product!, selectedSize, selectedColor, quantity)
    navigate('/checkout')
  }

  const handleWishlist = () => {
    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }
    toggleWishlist(product!.id)
    toast.success(wishlist.includes(product!.id) ? 'Removed from wishlist' : 'Added to wishlist')
  }

  if (loading) {
    return (
      <div className="pt-24 lg:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
            <div className="animate-pulse">
              <div className="aspect-[3/4] bg-gray-200 rounded-lg" />
            </div>
            <div className="space-y-4">
              <div className="h-8 bg-gray-200 rounded w-3/4" />
              <div className="h-6 bg-gray-200 rounded w-1/4" />
              <div className="h-20 bg-gray-200 rounded" />
            </div>
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null

  const images = product.images || [product.image_url]

  return (
    <div className="pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="product-detail">
            <div className="aspect-[3/4] overflow-hidden rounded-lg bg-gray-100 mb-4">
              <img 
                src={images[selectedImage]} 
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
            {images.length > 1 && (
              <div className="flex gap-2 overflow-x-auto">
                {images.map((img, i) => (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`w-20 h-24 flex-shrink-0 rounded-md overflow-hidden ${
                      selectedImage === i ? 'ring-2 ring-black' : ''
                    }`}
                  >
                    <img src={img} alt="" className="w-full h-full object-cover" />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Info */}
          <div className="product-detail lg:py-4">
            <div className="mb-6">
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold">
                ₦{product.price.toLocaleString()}
              </p>
            </div>

            <p className="text-gray-600 mb-6">
              {product.description}
            </p>

            {/* Size */}
            <div className="mb-6">
              <div className="flex items-center justify-between mb-2">
                <span className="font-medium">Size</span>
                <button className="text-sm text-gray-500 underline">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size)
                      setShowSizeError(false)
                    }}
                    className={`w-12 h-12 rounded-full border-2 transition-colors ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
              {showSizeError && (
                <p className="text-red-500 text-sm mt-1">Please select a size</p>
              )}
            </div>

            {/* Color */}
            <div className="mb-6">
              <span className="font-medium block mb-2">Color: {selectedColor}</span>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-full border-2 transition-colors ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div className="mb-6">
              <span className="font-medium block mb-2">Quantity</span>
              <div className="flex items-center gap-3">
                <button 
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center"
                >
                  <Minus className="w-4 h-4" />
                </button>
                <span className="w-8 text-center font-medium">{quantity}</span>
                <button 
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 rounded-full border border-gray-200 flex items-center justify-center"
                >
                  <Plus className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Actions */}
            <div className="flex gap-3 mb-8">
              <button 
                onClick={handleBuyNow}
                className="flex-1 bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Buy Now
              </button>
              <button 
                onClick={handleAddToBag}
                className="flex-1 border-2 border-black py-4 rounded-full font-medium hover:bg-gray-50 transition-colors flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </button>
              <button 
                onClick={handleWishlist}
                className="w-14 h-14 rounded-full border-2 border-gray-200 flex items-center justify-center hover:border-gray-300"
              >
                <Heart 
                  className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
                />
              </button>
            </div>

            {/* Shipping Info */}
            <div className="space-y-3 pt-6 border-t">
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <Truck className="w-5 h-5" />
                <span>Free shipping on orders over ₦50,000</span>
              </div>
              <div className="flex items-center gap-3 text-sm text-gray-600">
                <RotateCcw className="w-5 h-5" />
                <span>Easy returns within 7 days</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}