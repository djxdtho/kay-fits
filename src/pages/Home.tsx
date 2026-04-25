import { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { ArrowRight, Star } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Product } from '../store/cart'
import { useGSAP } from '@gsap/react'
import gsap from 'gsap'

const sampleProducts: Product[] = [
  { id: 1, name: 'Classic Black Hoodie', description: 'Premium cotton hoodie', price: 15000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_01.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
  { id: 2, name: 'Urban Track Suit', description: 'Comfortable track wear', price: 12000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_02.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
  { id: 3, name: 'Classic Polo Shirt', description: 'Cotton polo', price: 8000, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_03.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY'], in_stock: true },
  { id: 4, name: 'Cargo Pants', description: 'Multi-pocket cargo', price: 10000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_04.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
  { id: 5, name: 'Sports Jersey', description: 'Breathable jersey', price: 6000, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_05.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK'], in_stock: true },
  { id: 6, name: 'Oversized Hoodie', description: 'Oversized fit', price: 18000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_06.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY'], in_stock: true },
  { id: 7, name: 'Track Pants', description: 'Slim fit track', price: 9000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_07.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK'], in_stock: true },
  { id: 8, name: 'Denim Cargo', description: 'Denim cargo pants', price: 14000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_08.jpg', sizes: ['S','M','L','XL'], colors: ['BLUE','BLACK'], in_stock: true },
  { id: 9, name: 'Premium Polo', description: 'Premium cotton polo', price: 9500, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_09.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY','RED'], in_stock: true },
  { id: 10, name: 'Tech Cargo', description: 'Tech cargo pants', price: 11000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_10.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI','GREEN'], in_stock: true },
  { id: 11, name: 'Retro Jersey', description: 'Retro style jersey', price: 7500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_11.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED'], in_stock: true },
  { id: 12, name: 'Full Track Suit', description: 'Full track wear set', price: 18000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_12.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY'], in_stock: true },
  { id: 13, name: 'Zipper Hoodie', description: 'Zip-up hoodie', price: 16500, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_13.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY','NAVY'], in_stock: true },
  { id: 14, name: 'Jogger Cargo', description: 'Jogger style cargo', price: 10500, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_14.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
  { id: 15, name: 'Slim Fit Polo', description: 'Slim fit cotton polo', price: 7000, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_15.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','NAVY'], in_stock: true },
  { id: 16, name: 'Training Jersey', description: 'Training jersey', price: 5500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_16.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED','GREEN'], in_stock: true },
  { id: 17, name: 'Wool Blend Hoodie', description: 'Wool blend hoodie', price: 20000, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_17.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','CREAM'], in_stock: true },
  { id: 18, name: 'Sweat Track Pants', description: 'Heavyweight track', price: 12000, category: 'track', image_url: 'https://djxdtho.github.io/kay-fits/images/product_18.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','GREY'], in_stock: true },
  { id: 19, name: 'Utility Cargo', description: 'Utility cargo pants', price: 13000, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_19.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI','GREEN'], in_stock: true },
  { id: 20, name: 'Vintage Polo', description: 'Vintage style polo', price: 8500, category: 'polo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_20.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','NAVY','RED'], in_stock: true },
  { id: 21, name: 'Dry Fit Jersey', description: 'Dry fit sports jersey', price: 6500, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_21.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','BLUE'], in_stock: true },
  { id: 22, name: 'Fleece Hoodie', description: 'Heavyweight fleece', price: 17500, category: 'hoodie', image_url: 'https://djxdtho.github.io/kay-fits/images/product_22.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','NAVY','GREY'], in_stock: true },
  { id: 23, name: 'Cargo Shorts', description: 'Summer cargo shorts', price: 7500, category: 'cargo', image_url: 'https://djxdtho.github.io/kay-fits/images/product_23.jpg', sizes: ['S','M','L','XL'], colors: ['BLACK','KHAKI'], in_stock: true },
  { id: 24, name: 'Performance Jersey', description: 'Performance jersey', price: 8000, category: 'jersey', image_url: 'https://djxdtho.github.io/kay-fits/images/product_24.jpg', sizes: ['S','M','L','XL'], colors: ['WHITE','BLACK','RED','GREEN'], in_stock: true },
]

const categories = [
  { name: 'Track Wear', slug: 'track', image: '/images/category_track.jpg' },
  { name: 'Hoodies', slug: 'hoodie', image: '/images/category_hoodie.jpg' },
  { name: 'Polo', slug: 'polo', image: '/images/category_polo.jpg' },
  { name: 'Cargo', slug: 'cargo', image: '/images/category_cargo.jpg' },
  { name: 'Jersey', slug: 'jersey', image: '/images/category_jersey.jpg' },
]

export default function Home() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchProducts()
  }, [])

  const fetchProducts = async () => {
    try {
      const { data, error } = await supabase
        .from('products')
        .select('*')
        .eq('in_stock', true)
        .range(0, 7)
      
      if (error) throw error
      if (data && data.length > 0) {
        setProducts(data)
      } else {
        setProducts(sampleProducts)
      }
    } catch (err) {
      console.error('Using sample products:', err)
      setProducts(sampleProducts)
    } finally {
      setLoading(false)
    }
  }

  useGSAP(() => {
    gsap.from('.hero-text', {
      y: 50,
      opacity: 0,
      duration: 0.8,
      stagger: 0.2,
      ease: 'power3.out'
    })
  })

  return (
    <div className="pt-16 lg:pt-20">
      {/* Hero Section */}
      <section className="relative h-[90vh] min-h-[600px] bg-gray-100 overflow-hidden">
        <div className="absolute inset-0">
          <img 
            src="/images/hero_model_1.jpg" 
            alt="Hero"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-black/30 to-transparent" />
        </div>
        
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-full flex items-center">
          <div className="max-w-xl">
            <p className="hero-text text-white/80 text-sm tracking-widest uppercase mb-4">
              New Collection 2026
            </p>
            <h1 className="hero-text font-display text-5xl lg:text-7xl font-bold text-white mb-6">
              STREETWEAR<br />
              <span className="italic font-light">ESSENTIALS</span>
            </h1>
            <p className="hero-text text-white/90 text-lg mb-8 max-w-md">
              Elevate your style with premium streetwear designed for the modern individual.
            </p>
            <Link 
              to="/shop"
              className="hero-text inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors btn-hover"
            >
              Shop Now
              <ArrowRight className="w-5 h-5" />
            </Link>
          </div>
        </div>
      </section>

      {/* Categories */}
      <section className="py-16 lg:py-24 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="font-display text-3xl lg:text-4xl font-bold text-center mb-12">
            Shop by Category
          </h2>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4 lg:gap-6">
            {categories.map((cat, i) => (
              <Link 
                key={cat.slug}
                to={`/shop/${cat.slug}`}
                className="group relative aspect-[3/4] overflow-hidden rounded-lg animate-fade-in"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                <img 
                  src={cat.image} 
                  alt={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-black/30 group-hover:bg-black/40 transition-colors" />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-white font-medium text-lg tracking-wide">
                    {cat.name}
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-16 lg:py-24 bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between mb-12">
            <h2 className="font-display text-3xl lg:text-4xl font-bold">
              Featured
            </h2>
            <Link 
              to="/shop"
              className="hidden md:flex items-center gap-2 text-gray-600 hover:text-black transition-colors"
            >
              View All
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
          
          {loading ? (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="aspect-[3/4] bg-gray-200 rounded-lg mb-3" />
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2" />
                  <div className="h-4 bg-gray-200 rounded w-1/4" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
              {products.map((product, i) => (
                <ProductCard key={product.id} product={product} index={i} />
              ))}
            </div>
          )}
          
          <div className="mt-8 text-center md:hidden">
            <Link 
              to="/shop"
              className="inline-flex items-center gap-2 border border-black px-6 py-3 rounded-full"
            >
              View All Products
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* CTA Banner */}
      <section className="py-16 lg:py-24 bg-black text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="font-display text-3xl lg:text-5xl font-bold mb-6">
            Ready to Elevate Your Style?
          </h2>
          <p className="text-gray-400 text-lg mb-8 max-w-xl mx-auto">
            Join thousands of satisfied customers who trust KAY-FITS for quality streetwear.
          </p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 bg-white text-black px-8 py-4 rounded-full font-medium hover:bg-gray-100 transition-colors"
          >
            Shop Now
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </section>
    </div>
  )
}

function ProductCard({ product, index }: { product: Product; index: number }) {
  return (
    <Link 
      to={`/product/${product.id}`}
      className="product-card group block animate-fade-in"
      style={{ animationDelay: `${index * 50}ms` }}
    >
      <div className="relative aspect-[3/4] overflow-hidden rounded-lg mb-3 bg-gray-100">
        <img 
          src={product.image_url} 
          alt={product.name}
          className="product-image w-full h-full object-cover"
        />
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors" />
        <div className="absolute inset-x-0 bottom-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
          <button className="w-full bg-white text-black py-3 rounded-full font-medium hover:bg-gray-100">
            Quick Add
          </button>
        </div>
      </div>
      <h3 className="font-medium text-sm line-clamp-1">{product.name}</h3>
      <p className="text-gray-600 mt-1">₦{product.price.toLocaleString()}</p>
    </Link>
  )
}