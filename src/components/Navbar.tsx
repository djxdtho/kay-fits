import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { ShoppingBag, Menu, X, Heart, User, LogOut, Package } from 'lucide-react'
import { useCartStore } from '../store/cart'
import { supabase } from '../lib/supabase'

export default function Navbar() {
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const navigate = useNavigate()
  const { user, toggleCart, getItemCount, cart } = useCartStore()

  const handleLogout = async () => {
    await supabase.auth.signOut()
    navigate('/')
  }

  // Scroll effect
  useState(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50)
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  })

  return (
    <nav className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
      isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link to="/" className="flex items-center gap-2">
            <span className="font-display text-2xl lg:text-3xl font-bold tracking-tight">
              KAY<span className="text-gray-600">-FITS</span>
            </span>
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-8">
            <Link to="/" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">
              Home
            </Link>
            <Link to="/shop" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">
              Shop
            </Link>
            <Link to="/shop/track" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">
              Track Wear
            </Link>
            <Link to="/shop/hoodie" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">
              Hoodies
            </Link>
            <Link to="/shop/polo" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">
              Polo
            </Link>
            <Link to="/shop/cargo" className="nav-link text-gray-600 hover:text-gray-900 transition-colors">
              Cargo
            </Link>
          </div>

          {/* Icons */}
          <div className="flex items-center gap-4">
            <Link to="/wishlist" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
              <Heart className="w-5 h-5" />
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <Link to="/profile" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <User className="w-5 h-5" />
                </Link>
                {user.email === 'admin@kayfits.com' || user.id === 'admin' ? (
                  <Link to="/admin" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                    <Package className="w-5 h-5" />
                  </Link>
                ) : null}
                <button onClick={handleLogout} className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                  <LogOut className="w-5 h-5" />
                </button>
              </div>
            ) : (
              <Link to="/login" className="p-2 text-gray-600 hover:text-gray-900 transition-colors">
                <User className="w-5 h-5" />
              </Link>
            )}

            <button 
              onClick={toggleCart}
              className="relative p-2 text-gray-600 hover:text-gray-900 transition-colors"
            >
              <ShoppingBag className="w-5 h-5" />
              {getItemCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-black text-white text-xs w-5 h-5 rounded-full flex items-center justify-center cart-badge">
                  {getItemCount()}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="md:hidden p-2 text-gray-600"
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="md:hidden bg-white border-t">
          <div className="px-4 py-4 space-y-3">
            <Link to="/" className="block py-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>
              Home
            </Link>
            <Link to="/shop" className="block py-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>
              Shop All
            </Link>
            <Link to="/shop/track" className="block py-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>
              Track Wear
            </Link>
            <Link to="/shop/hoodie" className="block py-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>
              Hoodies
            </Link>
            <Link to="/shop/polo" className="block py-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>
              Polo
            </Link>
            <Link to="/shop/cargo" className="block py-2 text-gray-600" onClick={() => setIsMenuOpen(false)}>
              Cargo
            </Link>
          </div>
        </div>
      )}
    </nav>
  )
}