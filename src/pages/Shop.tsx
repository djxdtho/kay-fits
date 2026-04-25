import { useState, useEffect } from 'react'
import { useParams, Link } from 'react-router-dom'
import { Filter, Grid, List, Star, Heart, ShoppingBag, Minus, Plus } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product, useCartStore } from '../store/cart'
import { toast } from 'sonner'

const sampleProducts: Product[] = [
  { id: 1, name: 'Classic Black Hoodie', description: 'Premium cotton hoodie', price: 15000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_01.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
  { id: 2, name: 'Urban Track Suit', description: 'Comfortable track wear', price: 12000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_02.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
  { id: 3, name: 'Classic Polo Shirt', description: 'Cotton polo', price: 8000, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_03.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY'], in_stock: true },
  { id: 4, name: 'Cargo Pants', description: 'Multi-pocket cargo', price: 10000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_04.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
  { id: 5, name: 'Sports Jersey', description: 'Breathable jersey', price: 6000, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_05.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK'], in_stock: true },
  { id: 6, name: 'Oversized Hoodie', description: 'Oversized fit', price: 18000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_06.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY'], in_stock: true },
  { id: 7, name: 'Track Pants', description: 'Slim fit track', price: 9000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_07.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK'], in_stock: true },
  { id: 8, name: 'Denim Cargo', description: 'Denim cargo pants', price: 14000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_08.jpg', sizes: ['S','M','L','XL'], colors: ['BLUE','BLACK'], in_stock: true },
]

const categories = [
  { name: 'All', slug: '' },
  { name: 'Track Wear', slug: 'track' },
  { name: 'Hoodies', slug: 'hoodie' },
  { name: 'Polo', slug: 'polo' },
  { name: 'Cargo', slug: 'cargo' },
  { name: 'Jersey', slug: 'jersey' },
]

export default function Shop() {
  const { category } = useParams()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedCategory, setSelectedCategory] = useState(category || '')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')

  useEffect(() => {
    setSelectedCategory(category || '')
    fetchProducts(category || '')
  }, [category])

  const fetchProducts = async (cat: string) => {
    setLoading(true)
    try {
      let query = supabase.from('products').select('*').eq('in_stock', true)
      
      if (cat) {
        query = query.eq('category', cat)
      }
      
      const { data, error } = await query.range(0, 23)
      
      if (error) throw error
      setProducts(data?.length ? data : sampleProducts)
    } catch (err) {
      console.error('Using sample products:', err)
      const filtered = cat ? sampleProducts.filter(p => p.category === cat) : sampleProducts
      setProducts(filtered)
    } finally {
      setLoading(false)
    }
  }

  const categoryName = categories.find(c => c.slug === selectedCategory)?.name || 'All Products'

  return (
    <div className="pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="py-8">
          <h1 className="font-display text-3xl lg:text-4xl font-bold mb-2">
            {categoryName}
          </h1>
          <p className="text-gray-500">
            {products.length} products
          </p>
        </div>

        {/* Filters */}
        <div className="flex items-center justify-between pb-6 border-b">
          <div className="flex items-center gap-2 overflow-x-auto">
            {categories.map((cat) => (
              <button
                key={cat.slug}
                onClick={() => {
                  setSelectedCategory(cat.slug)
                  fetchProducts(cat.slug)
                }}
                className={`px-4 py-2 rounded-full text-sm whitespace-nowrap transition-colors ${
                  selectedCategory === cat.slug
                    ? 'bg-black text-white'
                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                }`}
              >
                {cat.name}
              </button>
            ))}
          </div>
          
          <div className="hidden md:flex items-center gap-2">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-2 rounded ${viewMode === 'grid' ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              <Grid className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded ${viewMode === 'list' ? 'bg-black text-white' : 'bg-gray-100'}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Products Grid */}
        {loading ? (
          <div className={`grid gap-6 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {[...Array(8)].map((_, i) => (
              <div key={i} className="animate-pulse">
                <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3" />
                <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                <div className="h-4 bg-gray-200 rounded w-1/4" />
              </div>
            ))}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-16">
            <p className="text-gray-500 mb-4">No products found in this category</p>
            <Link to="/shop" className="text-black underline">
              View all products
            </Link>
          </div>
        ) : (
          <div className={`grid gap-6 py-8 ${
            viewMode === 'grid' 
              ? 'grid-cols-2 lg:grid-cols-4' 
              : 'grid-cols-1'
          }`}>
            {products.map((product, i) => (
              viewMode === 'grid' ? (
                <ProductCard key={product.id} product={product} index={i} />
              ) : (
                <ProductListItem key={product.id} product={product} />
              )
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  const { addItem, wishlist, toggleWishlist, user } = useCartStore()
  const [selectedSize, setSelectedSize] = useState(product.sizes?.[0] || 'M')
  const [selectedColor, setSelectedColor] = useState(product.colors?.[0] || 'BLACK')
  const [showQuickAdd, setShowQuickAdd] = useState(false)

  const handleAddToBag = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to add items to bag')
      return
    }
    addItem(product, selectedSize, selectedColor)
    toast.success('Added to bag!')
  }

  const handleWishlist = (e: React.MouseEvent) => {
    e.preventDefault()
    if (!user) {
      toast.error('Please login to add to wishlist')
      return
    }
    toggleWishlist(product.id)
    toast.success(wishlist.includes(product.id) ? 'Removed from wishlist' : 'Added to wishlist')
  }

  return (
    <Link 
      to={`/product/${product.id}`}
      className="product-card group block animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div 
        className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-gray-100"
        onMouseEnter={() => setShowQuickAdd(true)}
        onMouseLeave={() => setShowQuickAdd(false)}
      >
        <img 
          src={product.image_url} 
          alt={product.name}
          className="product-image w-full h-full object-cover"
        />
        <button
          onClick={handleWishlist}
          className="absolute top-3 right-3 p-2 bg-white/80 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
        >
          <Heart 
            className={`w-4 h-4 ${wishlist.includes(product.id) ? 'fill-red-500 text-red-500' : ''}`} 
          />
        </button>
        <div className={`absolute inset-x-0 bottom-0 p-4 bg-white/90 backdrop-blur-sm translate-y-full group-hover:translate-y-0 transition-transform duration-300`}>
          <button 
            onClick={handleAddToBag}
            className="w-full bg-black text-white py-3 rounded-full font-medium text-sm hover:bg-gray-800"
          >
            Quick Add
          </button>
        </div>
      </div>
      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
      <p className="text-gray-600 mt-1">₦{product.price.toLocaleString()}</p>
    </Link>
  )
}

function ProductListItem({ product }: { product: Product }) {
  const { addItem, user } = useCartStore()
  const [quantity, setQuantity] = useState(1)

  const handleAddToBag = () => {
    if (!user) {
      toast.error('Please login to add items to bag')
      return
    }
    addItem(product, product.sizes?.[0] || 'M', product.colors?.[0] || 'BLACK', quantity)
    toast.success('Added to bag!')
  }

  return (
    <Link 
      to={`/product/${product.id}`}
      className="flex gap-6 p-4 bg-gray-50 rounded-lg animate-fade-in"
    >
      <div className="w-32 h-40 flex-shrink-0">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="w-full h-full object-cover rounded"
        />
      </div>
      <div className="flex-1">
        <h3 className="font-medium">{product.name}</h3>
        <p className="text-gray-500 text-sm mt-1 line-clamp-2">{product.description}</p>
        <p className="font-semibold mt-2">₦{product.price.toLocaleString()}</p>
        <button 
          onClick={handleAddToBag}
          className="mt-3 flex items-center gap-2 bg-black text-white px-4 py-2 rounded-full text-sm"
        >
          <ShoppingBag className="w-4 h-4" />
          Add to Bag
        </button>
      </div>
    </Link>
  )
}