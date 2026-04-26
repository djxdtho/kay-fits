import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Heart, ShoppingBag, Star, Truck, RotateCcw } from 'lucide-react'
import { supabaseAdmin } from '../lib/supabase'
import { Product, useCartStore } from '../store/cart'
import { toast } from 'sonner'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const sampleProductsMap: Record<number, Product> = {
  1: { id: 1, name: 'Classic Black Hoodie', description: 'Premium cotton hoodie', price: 15000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_01.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
  2: { id: 2, name: 'Urban Track Suit', description: 'Comfortable track wear', price: 12000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_02.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
  3: { id: 3, name: 'Classic Polo Shirt', description: 'Cotton polo', price: 8000, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_03.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY'], in_stock: true },
  4: { id: 4, name: 'Cargo Pants', description: 'Multi-pocket cargo', price: 10000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_04.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
  5: { id: 5, name: 'Sports Jersey', description: 'Breathable jersey', price: 6000, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_05.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK'], in_stock: true },
  6: { id: 6, name: 'Oversized Hoodie', description: 'Oversized fit', price: 18000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_06.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY'], in_stock: true },
  7: { id: 7, name: 'Track Pants', description: 'Slim fit track', price: 9000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_07.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK'], in_stock: true },
  8: { id: 8, name: 'Denim Cargo', description: 'Denim cargo pants', price: 14000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_08.jpg', sizes: ['S','M','L','XL'], colors: ['BLUE','BLACK'], in_stock: true },
  9: { id: 9, name: 'Premium Polo', description: 'Premium cotton polo', price: 9500, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_09.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY','RED'], in_stock: true },
  10: { id: 10, name: 'Tech Cargo', description: 'Tech cargo pants', price: 11000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_10.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI','GREEN'], in_stock: true },
  11: { id: 11, name: 'Retro Jersey', description: 'Retro style jersey', price: 7500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_11.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED'], in_stock: true },
  12: { id: 12, name: 'Full Track Suit', description: 'Full track wear set', price: 18000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_12.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
  13: { id: 13, name: 'Zipper Hoodie', description: 'Zip-up hoodie', price: 16500, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_13.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY','NAVY'], in_stock: true },
  14: { id: 14, name: 'Jogger Cargo', description: 'Jogger style cargo', price: 10500, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_14.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
  15: { id: 15, name: 'Slim Fit Polo', description: 'Slim fit cotton polo', price: 7000, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_15.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','NAVY'], in_stock: true },
  16: { id: 16, name: 'Training Jersey', description: 'Training jersey', price: 5500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_16.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED','GREEN'], in_stock: true },
  17: { id: 17, name: 'Wool Blend Hoodie', description: 'Wool blend hoodie', price: 20000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_17.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','CREAM'], in_stock: true },
  18: { id: 18, name: 'Sweat Track Pants', description: 'Heavyweight track', price: 12000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_18.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY'], in_stock: true },
  19: { id: 19, name: 'Utility Cargo', description: 'Utility cargo pants', price: 13000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_19.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI','GREEN'], in_stock: true },
  20: { id: 20, name: 'Vintage Polo', description: 'Vintage style polo', price: 8500, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_20.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY','RED'], in_stock: true },
  21: { id: 21, name: 'Dry Fit Jersey', description: 'Dry fit sports jersey', price: 6500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_21.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','BLUE'], in_stock: true },
  22: { id: 22, name: 'Fleece Hoodie', description: 'Heavyweight fleece', price: 17500, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_22.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY','GREY'], in_stock: true },
  23: { id: 23, name: 'Cargo Shorts', description: 'Summer cargo shorts', price: 7500, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_23.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
  24: { id: 24, name: 'Performance Jersey', description: 'Performance jersey', price: 8000, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_24.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED','GREEN'], in_stock: true },
}

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
  const [reviews, setReviews] = useState<any[]>([])
  const [canReview, setCanReview] = useState(false)
  const [newReview, setNewReview] = useState('')
  const [reviewRating, setReviewRating] = useState(5)
  const [submittingReview, setSubmittingReview] = useState(false)
  
  const { addItem, wishlist, toggleWishlist, user } = useCartStore()

  useEffect(() => {
    fetchProduct()
  }, [id])

  const fetchProduct = async () => {
    const productId = Number(id)
    const found = sampleProductsMap[productId]
    if (found) {
      setProduct(found)
      setSelectedSize(found.sizes?.[0] || 'M')
      setSelectedColor(found.colors?.[0] || 'BLACK')
      fetchReviews(productId)
      if (user) checkCanReview(productId)
    }
    setLoading(false)
  }

  const fetchReviews = async (productId: number) => {
    try {
      const { data } = await supabaseAdmin
        .from('reviews')
        .select('*, profiles(*)')
        .eq('product_id', productId)
        .order('created_at', { ascending: false })
      setReviews(data || [])
    } catch (err) {
      console.error('Error fetching reviews:', err)
    }
  }

  const checkCanReview = async (productId: number) => {
    if (!user) {
      setCanReview(false)
      return
    }
    try {
      const { data: orders } = await supabaseAdmin
        .from('orders')
        .select('*')
        .eq('user_id', user.id)
        .eq('payment_status', 'confirmed')
      
      let hasOrdered = false
      for (const order of (orders || [])) {
        const { data: items } = await supabaseAdmin
          .from('order_items')
          .select('product_id')
          .eq('order_id', order.id)
        
        if (items?.some((item: any) => item.product_id === productId)) {
          hasOrdered = true
          break
        }
      }
      
      setCanReview(hasOrdered)
    } catch (err) {
      setCanReview(false)
    }
  }

  const submitReview = async () => {
    if (!user) {
      toast.error('Please login to review')
      return
    }
    if (!newReview.trim()) {
      toast.error('Please write a review')
      return
    }

    setSubmittingReview(true)
    try {
      await supabaseAdmin.from('reviews').insert({
        user_id: user.id,
        product_id: Number(id),
        rating: reviewRating,
        comment: newReview,
      })
      toast.success('Review submitted!')
      setNewReview('')
      setReviewRating(5)
      fetchReviews(Number(id))
    } catch (err) {
      toast.error('Failed to submit review')
    } finally {
      setSubmittingReview(false)
    }
  }

  useGSAP(() => {
    if (product) {
      gsap.from('.product-detail', {
        opacity: 0,
        y: 20,
        duration: 0.5,
        ease: 'power2.out'
      })
    }
  }, [product])

  const handleAddToBag = () => {
    if (!product) return
    
    if (!selectedSize) {
      setShowSizeError(true)
      return
    }
    if (!user) {
      toast.error('Please login to add items to bag')
      navigate('/login')
      return
    }
    addItem(product, selectedSize, selectedColor, quantity)
    toast.success('Added to bag!')
  }

  const averageRating = reviews.length > 0
    ? (reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)
    : 0

  if (loading) {
    return (
      <div className="pt-24 lg:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="animate-pulse">
            <div className="h-[500px] bg-gray-200 rounded-lg" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) {
    return (
      <div className="pt-24 lg:pt-28 pb-16">
        <div className="max-w-7xl mx-auto px-4 text-center py-16">
          <h1 className="font-display text-2xl font-bold mb-4">Product not found</h1>
          <Link to="/shop" className="text-black underline">Back to Shop</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-28 pb-16 product-detail">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Images */}
          <div className="space-y-4">
            <div className="aspect-[3/4] rounded-lg overflow-hidden bg-gray-100">
              <img
                src={product.image_url}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            </div>
          </div>

          {/* Details */}
          <div className="space-y-6">
            <div>
              <p className="text-gray-500 text-sm uppercase tracking-wide mb-2">
                {product.category}
              </p>
              <h1 className="font-display text-3xl lg:text-4xl font-bold">
                {product.name}
              </h1>
              <p className="text-2xl font-semibold mt-2">₦{product.price.toLocaleString()}</p>
            </div>

            <p className="text-gray-600">{product.description}</p>

            {/* Size */}
            <div>
              <p className="font-medium mb-2">Size</p>
              <div className="flex flex-wrap gap-2">
                {product.sizes?.map((size) => (
                  <button
                    key={size}
                    onClick={() => {
                      setSelectedSize(size)
                      setShowSizeError(false)
                    }}
                    className={`w-12 h-12 rounded-lg border-2 font-medium ${
                      selectedSize === size
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
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
            <div>
              <p className="font-medium mb-2">Color</p>
              <div className="flex flex-wrap gap-2">
                {product.colors?.map((color) => (
                  <button
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    className={`px-4 py-2 rounded-lg border-2 font-medium ${
                      selectedColor === color
                        ? 'border-black bg-black text-white'
                        : 'border-gray-200 hover:border-black'
                    }`}
                  >
                    {color}
                  </button>
                ))}
              </div>
            </div>

            {/* Quantity */}
            <div>
              <p className="font-medium mb-2">Quantity</p>
              <div className="flex items-center gap-4">
                <div className="flex items-center border rounded-lg">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="p-3 hover:bg-gray-50"
                  >
                    <Minus className="w-4 h-4" />
                  </button>
                  <span className="w-12 text-center font-medium">{quantity}</span>
                  <button
                    onClick={() => setQuantity(quantity + 1)}
                    className="p-3 hover:bg-gray-50"
                  >
                    <Plus className="w-4 h-4" />
                  </button>
                </div>
              </div>
            </div>

            {/* Add to Bag */}
            <div className="flex gap-4">
              <button
                onClick={handleAddToBag}
                className="flex-1 bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 flex items-center justify-center gap-2"
              >
                <ShoppingBag className="w-5 h-5" />
                Add to Bag
              </button>
              <button
                onClick={() => {
                  if (!user) {
                    toast.error('Please login')
                    return
                  }
                  toggleWishlist(product.id)
                  toast.success(wishlist.includes(product.id) ? 'Removed from wishlist' : 'Added to wishlist')
                }}
                className={`p-4 rounded-full border-2 ${
                  wishlist.includes(product.id)
                    ? 'border-red-500 bg-red-50 text-red-500'
                    : 'border-gray-200 hover:border-black'
                }`}
              >
                <Heart className={`w-5 h-5 ${wishlist.includes(product.id) ? 'fill-current' : ''}`} />
              </button>
            </div>

            {/* Reviews Section */}
            <div className="border-t pt-8 mt-8">
              <div className="flex items-center gap-4 mb-6">
                <h2 className="font-display text-2xl font-bold">Reviews</h2>
                <div className="flex items-center gap-1">
                  <Star className="w-5 h-5 fill-yellow-400 text-yellow-400" />
                  <span className="font-medium">{averageRating}</span>
                  <span className="text-gray-500">({reviews.length} reviews)</span>
                </div>
              </div>

              {canReview && (
                <div className="bg-gray-50 rounded-lg p-4 mb-6">
                  <p className="font-medium mb-2">Write a Review</p>
                  <div className="flex gap-1 mb-3">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button key={star} onClick={() => setReviewRating(star)}>
                        <Star className={`w-6 h-6 ${star <= reviewRating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                      </button>
                    ))}
                  </div>
                  <textarea
                    value={newReview}
                    onChange={(e) => setNewReview(e.target.value)}
                    placeholder="Write your review..."
                    className="w-full px-4 py-2 border rounded-lg mb-3"
                    rows={3}
                  />
                  <button
                    onClick={submitReview}
                    disabled={submittingReview}
                    className="bg-black text-white px-6 py-2 rounded-lg font-medium disabled:opacity-50"
                  >
                    {submittingReview ? 'Submitting...' : 'Submit Review'}
                  </button>
                </div>
              )}

              {!canReview && user && (
                <p className="text-gray-500 text-sm mb-4">Order this product to write a review</p>
              )}

              {!user && (
                <p className="text-gray-500 text-sm mb-4">Login to write a review</p>
              )}

              <div className="space-y-4">
                {reviews.map((review) => (
                  <div key={review.id} className="border-b pb-4">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="flex">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star key={star} className={`w-4 h-4 ${star <= review.rating ? 'fill-yellow-400 text-yellow-400' : 'text-gray-300'}`} />
                        ))}
                      </div>
                      <span className="text-sm text-gray-500">
                        {review.profiles?.full_name || 'Anonymous'}
                      </span>
                    </div>
                    <p className="text-gray-600">{review.comment}</p>
                  </div>
                ))}
                {reviews.length === 0 && (
                  <p className="text-gray-500">No reviews yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}