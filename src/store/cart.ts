import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import { supabase } from '../lib/supabase'

export interface Product {
  id: number
  name: string
  description: string
  price: number
  category: string
  image_url: string
  images?: string[]
  sizes?: string[]
  colors?: string[]
  in_stock: boolean
  created_at?: string
}

export interface CartItem {
  product: Product
  quantity: number
  size: string
  color: string
}

export interface Order {
  id: number
  user_id: string
  items: CartItem[]
  total: number
  status: 'pending' | 'confirmed' | 'on_the_way' | 'delivered' | 'cancelled' | 'failed'
  payment_method: 'bank_transfer' | 'pay_on_delivery'
  shipping_address: string
  created_at: string
}

interface CartState {
  cart: CartItem[]
  user: any
  wishlist: number[]
  isCartOpen: boolean
  addItem: (product: Product, size: string, color: string, quantity?: number) => void
  removeItem: (productId: number, size: string, color: string) => void
  updateQuantity: (productId: number, size: string, color: string, quantity: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
  setUser: (user: any) => void
  setWishlist: (ids: number[]) => void
  toggleWishlist: (productId: number) => void
  initCart: () => void
  getTotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      cart: [],
      user: null,
      wishlist: [],
      isCartOpen: false,

      addItem: (product, size, color, quantity = 1) => {
        const { cart } = get()
        const existingIndex = cart.findIndex(
          item => 
            item.product.id === product.id && 
            item.size === size && 
            item.color === color
        )
        
        if (existingIndex > -1) {
          const newCart = [...cart]
          newCart[existingIndex].quantity += quantity
          set({ cart: newCart })
        } else {
          set({ cart: [...cart, { product, size, color, quantity }] })
        }
      },

      removeItem: (productId, size, color) => {
        const { cart } = get()
        set({ 
          cart: cart.filter(
            item => !(item.product.id === productId && item.size === size && item.color === color)
          ) 
        })
      },

      updateQuantity: (productId, size, color, quantity) => {
        const { cart } = get()
        if (quantity <= 0) {
          set({ 
            cart: cart.filter(
              item => !(item.product.id === productId && item.size === size && item.color === color)
            ) 
          })
        } else {
          const newCart = cart.map(item => 
            item.product.id === productId && item.size === size && item.color === color
              ? { ...item, quantity }
              : item
          )
          set({ cart: newCart })
        }
      },

      clearCart: () => set({ cart: [] }),
      
      openCart: () => set({ isCartOpen: true }),
      closeCart: () => set({ isCartOpen: false }),
      toggleCart: () => set(state => ({ isCartOpen: !state.isCartOpen })),
      
      setUser: (user) => set({ user }),
      setWishlist: (ids) => set({ wishlist: ids }),
      
      toggleWishlist: async (productId) => {
        const { user, wishlist } = get()
        if (!user) return
        
        const newWishlist = wishlist.includes(productId)
          ? wishlist.filter(id => id !== productId)
          : [...wishlist, productId]
        
        set({ wishlist: newWishlist })
        
        // Sync with Supabase
        await supabase
          .from('wishlist')
          .upsert({ user_id: user.id, product_id: productId })
      },

      initCart: async () => {
        const { data: { session } } = await supabase.auth.getSession()
        if (session?.user) {
          const { data: wishlistData } = await supabase
            .from('wishlist')
            .select('product_id')
            .eq('user_id', session.user.id)
          
          if (wishlistData) {
            set({ wishlist: wishlistData.map(w => w.product_id) })
          }
        }
      },

      getTotal: () => {
        const { cart } = get()
        return cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
      },

      getItemCount: () => {
        const { cart } = get()
        return cart.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'kay-fits-cart',
    }
  )
)