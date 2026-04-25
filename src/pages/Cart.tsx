import { Link } from 'react-router-dom'
import { Trash2, Minus, Plus, ShoppingBag, ArrowRight } from 'lucide-react'
import { useCartStore } from '../store/cart'

export default function Cart() {
  const { cart, updateQuantity, removeItem, getTotal, getItemCount } = useCartStore()

  if (cart.length === 0) {
    return (
      <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center py-16">
          <ShoppingBag className="w-24 h-24 mx-auto text-gray-300 mb-6" />
          <h1 className="font-display text-3xl font-bold mb-4">Your bag is empty</h1>
          <p className="text-gray-500 mb-8">Looks like you haven't added anything yet.</p>
          <Link 
            to="/shop"
            className="inline-flex items-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium"
          >
            Continue Shopping
            <ArrowRight className="w-5 h-5" />
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-8">Your Bag</h1>
        
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item, index) => (
              <div 
                key={`${item.product.id}-${item.size}-${item.color}-${index}`}
                className="flex gap-4 p-4 bg-gray-50 rounded-lg animate-fade-in"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                <Link to={`/product/${item.product.id}`}>
                  <img 
                    src={item.product.image_url} 
                    alt={item.product.name}
                    className="w-24 h-32 object-cover rounded-md"
                  />
                </Link>
                <div className="flex-1">
                  <Link to={`/product/${item.product.id}`}>
                    <h3 className="font-medium hover:text-gray-600">{item.product.name}</h3>
                  </Link>
                  <p className="text-sm text-gray-500 mt-1">
                    Size: {item.size} • Color: {item.color}
                  </p>
                  
                  <div className="flex items-center justify-between mt-4">
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
                    <p className="font-semibold">
                      ₦{(item.product.price * item.quantity).toLocaleString()}
                    </p>
                  </div>
                  
                  <button 
                    onClick={() => removeItem(item.product.id, item.size, item.color)}
                    className="mt-3 text-sm text-gray-500 hover:text-red-500 flex items-center gap-1"
                  >
                    <Trash2 className="w-4 h-4" />
                    Remove
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              
              <div className="space-y-3 mb-4">
                <div className="flex justify-between">
                  <span className="text-gray-600">Subtotal</span>
                  <span>₦{getTotal().toLocaleString()}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-600">Tax</span>
                  <span>Calculated at checkout</span>
                </div>
              </div>
              
              <div className="border-t pt-4 mb-6">
                <div className="flex justify-between text-lg font-semibold">
                  <span>Total</span>
                  <span>₦{getTotal().toLocaleString()}</span>
                </div>
              </div>
              
              <Link 
                to="/checkout"
                className="block w-full bg-black text-white text-center py-4 rounded-full font-medium hover:bg-gray-800 transition-colors"
              >
                Proceed to Checkout
              </Link>
              
              <Link 
                to="/shop"
                className="block w-full text-center mt-4 text-gray-500 hover:text-gray-700"
              >
                Continue Shopping
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}