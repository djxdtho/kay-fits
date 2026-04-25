import { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CreditCard, Truck, Lock, Check, AlertCircle } from 'lucide-react'
import { supabase, whatsappNumber, emailConfig } from '../lib/supabase'
import { useCartStore } from '../store/cart'
import { toast } from 'sonner'
import emailjs from '@emailjs/browser'

const checkoutSchema = z.object({
  fullName: z.string().min(2, 'Full name is required'),
  email: z.string().email('Valid email is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  address: z.string().min(5, 'Delivery address is required'),
  city: z.string().min(2, 'City is required'),
  state: z.string().min(2, 'State is required'),
  paymentMethod: z.enum(['bank_transfer', 'pay_on_delivery']),
})

type CheckoutForm = z.infer<typeof checkoutSchema>

const bankDetails = {
  bank: 'First Bank of Nigeria',
  account: '1234567890',
  accountName: 'KAY-FITS STORE',
}

export default function Checkout() {
  const navigate = useNavigate()
  const { cart, getTotal, clearCart, user } = useCartStore()
  const [loading, setLoading] = useState(false)
  const [showBankDetails, setShowBankDetails] = useState(false)

  const { register, handleSubmit, watch, formState: { errors } } = useForm<CheckoutForm>({
    resolver: zodResolver(checkoutSchema),
    defaultValues: {
      paymentMethod: 'pay_on_delivery',
    },
  })

  const paymentMethod = watch('paymentMethod')

  const onSubmit = async (data: CheckoutForm) => {
    if (!user) {
      toast.error('Please login to checkout')
      navigate('/login')
      return
    }

    if (cart.length === 0) {
      toast.error('Your bag is empty')
      return
    }

    setLoading(true)

    try {
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          user_id: user.id,
          total: getTotal(),
          status: 'pending',
          payment_method: data.paymentMethod,
          shipping_address: `${data.fullName}, ${data.address}, ${data.city}, ${data.state}`,
          shipping_phone: data.phone,
        })
        .select()
        .single()

      if (orderError) {
        console.error('Order error:', orderError)
        throw new Error(orderError.message)
      }

      const orderItems = cart.map(item => ({
        order_id: order.id,
        product_id: item.product.id,
        quantity: item.quantity,
        size: item.size,
        color: item.color,
        price: item.product.price,
      }))

      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(orderItems)

      if (itemsError) {
        console.error('Items error:', itemsError)
      }

      // Send WhatsApp notification
      const orderDetails = cart.map(item => 
        `${item.quantity}x ${item.product.name} (${item.size}/${item.color})`
      ).join('\n')

      const message = `*NEW ORDER #${order.id}*%0A%0A*Customer:* ${data.fullName}%0A*Phone:* ${data.phone}%0A*Email:* ${data.email}%0A%0A*Items:*%0A${orderDetails}%0A%0A*Total:* ₦${getTotal().toLocaleString()}%0A*Payment:* ${data.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Pay on Delivery'}%0A%0A*Address:* ${data.address}, ${data.city}, ${data.state}`

      await fetch(`https://api.whatsapp.com/send?phone=${whatsappNumber}&text=${message}`)

      // Send Email notification
      if (emailConfig.serviceId && emailConfig.templateId) {
        try {
          await emailjs.send(
            emailConfig.serviceId,
            emailConfig.templateId,
            {
              order_id: order.id,
              customer_name: data.fullName,
              customer_phone: data.phone,
              customer_email: data.email,
              items: orderDetails,
              total: getTotal(),
              payment_method: data.paymentMethod === 'bank_transfer' ? 'Bank Transfer' : 'Pay on Delivery',
              address: `${data.address}, ${data.city}, ${data.state}`,
            },
            emailConfig.publicKey
          )
        } catch (err) {
          console.error('Email error:', err)
        }
      }

      clearCart()
      navigate('/order-success', { state: { orderId: order.id } })
      toast.success('Order placed successfully!')
    } catch (err) {
      console.error('Checkout error:', err)
      toast.error('Failed to place order. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!user) {
    return (
      <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center py-16">
          <AlertCircle className="w-16 h-16 mx-auto text-gray-300 mb-6" />
          <h1 className="font-display text-2xl font-bold mb-4">Login Required</h1>
          <p className="text-gray-500 mb-8">Please login to checkout.</p>
          <Link to="/login" className="bg-black text-white px-8 py-3 rounded-full font-medium">
            Login
          </Link>
        </div>
      </div>
    )
  }

  if (cart.length === 0) {
    return (
      <div className="pt-24 lg:pt-28 pb-16 min-h-screen">
        <div className="max-w-lg mx-auto px-4 text-center py-16">
          <h1 className="font-display text-2xl font-bold mb-4">Your bag is empty</h1>
          <Link to="/shop" className="text-black underline">Continue Shopping</Link>
        </div>
      </div>
    )
  }

  return (
    <div className="pt-24 lg:pt-28 pb-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <h1 className="font-display text-3xl lg:text-4xl font-bold mb-8">Checkout</h1>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Form */}
          <div className="lg:col-span-2 space-y-8">
            {/* Contact Info */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4">Contact Information</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Full Name</label>
                  <input
                    {...register('fullName')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="John Doe"
                  />
                  {errors.fullName && <p className="text-red-500 text-sm mt-1">{errors.fullName.message}</p>}
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">Email</label>
                  <input
                    {...register('email')}
                    type="email"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="john@example.com"
                  />
                  {errors.email && <p className="text-red-500 text-sm mt-1">{errors.email.message}</p>}
                </div>
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium mb-1">Phone Number</label>
                  <input
                    {...register('phone')}
                    type="tel"
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="+2348012345678"
                  />
                  {errors.phone && <p className="text-red-500 text-sm mt-1">{errors.phone.message}</p>}
                </div>
              </div>
            </div>

            {/* Shipping */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <Truck className="w-5 h-5" />
                Shipping Address
              </h2>
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">Delivery Address</label>
                  <input
                    {...register('address')}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                    placeholder="123 Street Name"
                  />
                  {errors.address && <p className="text-red-500 text-sm mt-1">{errors.address.message}</p>}
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium mb-1">City</label>
                    <input
                      {...register('city')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                      placeholder="Lagos"
                    />
                    {errors.city && <p className="text-red-500 text-sm mt-1">{errors.city.message}</p>}
                  </div>
                  <div>
                    <label className="block text-sm font-medium mb-1">State</label>
                    <input
                      {...register('state')}
                      className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:border-black focus:outline-none"
                      placeholder="Lagos"
                    />
                    {errors.state && <p className="text-red-500 text-sm mt-1">{errors.state.message}</p>}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment */}
            <div className="bg-gray-50 rounded-lg p-6">
              <h2 className="font-semibold text-lg mb-4 flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Method
              </h2>
              <div className="space-y-3">
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-black transition-colors">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="pay_on_delivery"
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Pay on Delivery</p>
                    <p className="text-sm text-gray-500">Pay when you receive your order</p>
                  </div>
                </label>
                <label className="flex items-center gap-3 p-4 border rounded-lg cursor-pointer hover:border-black transition-colors">
                  <input
                    {...register('paymentMethod')}
                    type="radio"
                    value="bank_transfer"
                    className="w-4 h-4"
                  />
                  <div className="flex-1">
                    <p className="font-medium">Bank Transfer</p>
                    <p className="text-sm text-gray-500">Transfer to our bank account</p>
                  </div>
                </label>
              </div>

              {paymentMethod === 'bank_transfer' && (
                <div className="mt-4 p-4 bg-white border rounded-lg">
                  <p className="font-medium mb-2">Bank Details:</p>
                  <p className="text-sm">Bank: {bankDetails.bank}</p>
                  <p className="text-sm">Account Number: {bankDetails.account}</p>
                  <p className="text-sm">Account Name: {bankDetails.accountName}</p>
                  <p className="text-sm text-gray-500 mt-2">
                    Please transfer ₦{getTotal().toLocaleString()} and upload your receipt.
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Summary */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-lg p-6 sticky top-24">
              <h2 className="font-semibold text-lg mb-4">Order Summary</h2>
              <div className="space-y-3 mb-4">
                {cart.map((item, i) => (
                  <div key={i} className="flex justify-between text-sm">
                    <span className="text-gray-600">
                      {item.quantity}x {item.product.name}
                    </span>
                    <span>₦{(item.product.price * item.quantity).toLocaleString()}</span>
                  </div>
                ))}
              </div>
              <div className="border-t pt-3 mt-3">
                <div className="flex justify-between font-semibold">
                  <span>Total</span>
                  <span>₦{getTotal().toLocaleString()}</span>
                </div>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-black text-white py-4 rounded-full font-medium hover:bg-gray-800 transition-colors mt-6 flex items-center justify-center gap-2 disabled:opacity-50"
              >
                {loading ? 'Processing...' : (
                  <>
                    <Lock className="w-4 h-4" />
                    Place Order
                  </>
                )}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}