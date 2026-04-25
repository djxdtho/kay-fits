import { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { Minus, Plus, Heart, ShoppingBag, Star, Truck, RotateCcw } from 'lucide-react'
import { supabase } from '../lib/supabase'
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
    } else {
      navigate('/shop')
    }
    setLoading(false)
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