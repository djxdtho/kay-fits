import { X, Minus, Plus, ShoppingBag, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cart'

export default function CartDrawer() {
  const { cart, isCartOpen, closeCart, updateQuantity, removeItem, getTotal, getItemCount } = useCartStore()

  if (!isCartOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/50 z-50 transition-opacity"
        onClick={closeCart}
      />
      
      {/* Drawer */}
      <div className="fixed right-0 top-0 h-full w-full max-w-md bg-white z-50 shadow-xl animate-slide-in-right">
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className="flex items-center justify-between p-4 border-b">
            <h2 className="font-display text-xl font-semibold flex items-center gap-2">
              <ShoppingBag className="w-5 h-5" />
              Your Bag ({getItemCount()})
            </h2>
            <button onClick={closeCart} className="p-2 hover:bg-gray-100 rounded-full">
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Items */}
          <div className="flex-1 overflow-y-auto p-4">
            {cart.length === 0 ? (
              <div className="text-center py-12">
                <ShoppingBag className="w-16 h-16 mx-auto text-gray-300 mb-4" />
                <p className="text-gray-500 mb-4">Your bag is empty</p>
                <button 
                  onClick={closeCart}
                  className="btn-hover bg-black text-white px-6 py-3 rounded-full"
                >
                  Continue Shopping
                </button>
              </div>
            ) : (
              <div className="space-y-4">
                {cart.map((item, index) => (
                  <div 
                    key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                    className="flex gap-4 p-3 bg-gray-50 rounded-lg animate-fade-in"
                    style={{ animationDelay: `${index * 50}ms` }}
                  >
                    <img 
                      src={item.product.image_url} 
                      alt={item.product.name}
                      className="w-20 h-24 object-cover rounded-md"
                    />
                    <div className="flex-1">
                      <h3 className="font-medium text-sm line-clamp-1">{item.product.name}</h3>
                      <p className="text-xs text-gray-500 mt-1">
                        Size: {item.size} • Color: {item.color}
                      </p>
                      <p className="font-semibold mt-2">₦{item.product.price.toLocaleString()}</p>
                      
                      <div className="flex items-center justify-between mt-2">
                        <div className="flex items-center gap-2">
                          <button 
                            onClick={() => updateQuantity(
                              item.product.id, 
                              item.size, 
                              item.color, 
                              item.quantity - 1
                            )}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="text-sm w-8 text-center">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(
                              item.product.id, 
                              item.size, 
                              item.color, 
                              item.quantity + 1
                            )}
                            className="p-1 hover:bg-gray-200 rounded"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(
                            item.product.id, 
                            item.size, 
                            item.color
                          )}
                          className="p-1 text-gray-400 hover:text-red-500"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Footer */}
          {cart.length > 0 && (
            <div className="border-t p-4 space-y-4">
              <div className="flex justify-between text-lg font-semibold">
                <span>Total</span>
                <span>₦{getTotal().toLocaleString()}</span>
              </div>
              <Link 
                to="/checkout"
                onClick={closeCart}
                className="block w-full bg-black text-white text-center py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Checkout
              </Link>
              <button 
                onClick={closeCart}
                className="block w-full text-center text-gray-500 hover:text-gray-700"
              >
                Continue Shopping
              </button>
            </div>
          )}
        </div>
      </div>
    </>
  )
}