import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'sonner'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import CartDrawer from './components/CartDrawer'
import { useCartStore } from './store/cart'
import { useEffect } from 'react'
import { supabase } from './lib/supabase'

// Pages
import Home from './pages/Home'
import Shop from './pages/Shop'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Checkout from './pages/Checkout'
import OrderSuccess from './pages/OrderSuccess'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Profile from './pages/Profile'
import Wishlist from './pages/Wishlist'
import Admin from './pages/Admin'

function App() {
  const { initCart } = useCartStore()
  
  useEffect(() => {
    initCart()
    
    // Check auth on load
    supabase.auth.getSession().then(({ data: { session } }) => {
      if (session) {
        useCartStore.getState().setUser(session.user)
      }
    })
    
    const { data: { subscription } } = supabase.auth.onAuthStateChange((_event, session) => {
      if (session) {
        useCartStore.getState().setUser(session.user)
      } else {
        useCartStore.getState().setUser(null)
      }
    })
    
    return () => subscription.unsubscribe()
  }, [initCart])

  return (
    <BrowserRouter>
      <div className="min-h-screen flex flex-col">
        <Navbar />
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/shop" element={<Shop />} />
            <Route path="/shop/:category" element={<Shop />} />
            <Route path="/product/:id" element={<ProductDetail />} />
            <Route path="/cart" element={<Cart />} />
            <Route path="/checkout" element={<Checkout />} />
            <Route path="/order-success" element={<OrderSuccess />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/profile" element={<Profile />} />
            <Route path="/wishlist" element={<Wishlist />} />
            <Route path="/admin" element={<Admin />} />
          </Routes>
        </main>
        <Footer />
        <CartDrawer />
        <Toaster position="bottom-right" />
      </div>
    </BrowserRouter>
  )
}

export default App