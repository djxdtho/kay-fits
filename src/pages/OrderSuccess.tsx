import { useLocation, Link } from 'react-router-dom'
import { CheckCircle, ShoppingBag, ArrowRight } from 'lucide-react'

export default function OrderSuccess() {
  const location = useLocation()
  const orderId = location.state?.orderId

  return (
    <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
      <div className="max-w-lg mx-auto px-4 text-center py-16">
        <div className="w-20 h-20 mx-auto mb-6 bg-green-100 rounded-full flex items-center justify-center">
          <CheckCircle className="w-10 h-10 text-green-600" />
        </div>
        
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-4">
          Order Placed!
        </h1>
        
        <p className="text-gray-500 mb-2">
          Thank you for your order
        </p>
        
        {orderId && (
          <p className="text-sm text-gray-500 mb-8">
            Order ID: #{orderId}
          </p>
        )}
        
        <div className="bg-gray-50 rounded-lg p-6 mb-8 text-left">
          <h2 className="font-medium mb-3">What's next?</h2>
          <ul className="space-y-3 text-sm text-gray-600">
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">1</span>
              <span>We'll send you a confirmation via WhatsApp and email</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">2</span>
              <span>Your order will be processed within 24 hours</span>
            </li>
            <li className="flex items-start gap-2">
              <span className="w-5 h-5 bg-black text-white rounded-full flex items-center justify-center text-xs flex-shrink-0 mt-0.5">3</span>
              <span>You'll receive updates on WhatsApp as your order progresses</span>
            </li>
          </ul>
        </div>
        
        <div className="flex flex-col gap-3">
          <Link 
            to="/profile"
            className="flex items-center justify-center gap-2 bg-black text-white px-8 py-4 rounded-full font-medium"
          >
            <ShoppingBag className="w-5 h-5" />
            View Order History
            <ArrowRight className="w-5 h-5" />
          </Link>
          
          <Link 
            to="/shop"
            className="text-gray-500 hover:text-gray-700"
          >
            Continue Shopping
          </Link>
        </div>
      </div>
    </div>
  )
}