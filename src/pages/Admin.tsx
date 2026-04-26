import { useState } from 'react'
import { Package, Users, Lock, Search, ChevronDown, ChevronUp, EyeOff } from 'lucide-react'
import { supabaseAdmin } from '../lib/supabase'
import { Link } from 'react-router-dom'

const ADMIN_PASSWORD = 'kayfits2024'

const paymentStatuses = ['pending', 'confirmed', 'cancelled']
const deliveryStatuses = ['pending', 'on_the_way', 'delivered']

export default function Admin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders')
  const [searchTerm, setSearchTerm] = useState('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [deliveryFilter, setDeliveryFilter] = useState('')
  const [expandedOrder, setExpandedOrder] = useState<number | null>(null)
  const [error, setError] = useState('')

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password === ADMIN_PASSWORD) {
      setAuthenticated(true)
      setLoading(true)
      fetchOrders()
      fetchUsers()
    } else {
      setError('Invalid password')
    }
  }

  const fetchOrders = async () => {
    try {
      const { data: ordersData, error } = await supabaseAdmin
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, 99)

      if (error) throw error
      setOrders(ordersData || [])
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabaseAdmin
        .from('profiles')
        .select('*')
        .range(0, 99)

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const updatePaymentStatus = async (orderId: number, status: string) => {
    try {
      await supabaseAdmin
        .from('orders')
        .update({ payment_status: status })
        .eq('id', orderId)
      fetchOrders()
    } catch (err) {
      console.error('Error updating payment:', err)
    }
  }

  const updateDeliveryStatus = async (orderId: number, status: string) => {
    try {
      await supabaseAdmin
        .from('orders')
        .update({ delivery_status: status })
        .eq('id', orderId)
      fetchOrders()
    } catch (err) {
      console.error('Error updating delivery:', err)
    }
  }

  if (!authenticated) {
    return (
      <div className="pt-24 lg:pt-28 min-h-screen flex items-center justify-center bg-gray-50">
        <div className="bg-white p-8 rounded-lg shadow-lg max-w-md w-full mx-4">
          <div className="text-center mb-6">
            <Lock className="w-12 h-12 mx-auto mb-4 text-gray-400" />
            <h1 className="font-display text-2xl font-bold">Admin Login</h1>
            <p className="text-gray-500 mt-2">Enter password to access admin panel</p>
          </div>
          <form onSubmit={handleLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium mb-2">Password</label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full px-4 py-3 border rounded-lg pr-12"
                  placeholder="Enter admin password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2"
                >
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Search className="w-5 h-5 text-gray-400" />}
                </button>
              </div>
              {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
            </div>
            <button
              type="submit"
              className="w-full bg-black text-white py-3 rounded-lg font-medium hover:bg-gray-800"
            >
              Login
            </button>
          </form>
          <Link to="/" className="block text-center mt-4 text-gray-500 hover:text-black">
            Back to Home
          </Link>
        </div>
      </div>
    )
  }

  const filteredOrders = orders.filter(order => {
    const matchesSearch = !searchTerm || 
      order.id.toString().includes(searchTerm) ||
      order.customer_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesPayment = !paymentFilter || order.payment_status === paymentFilter
    const matchesDelivery = !deliveryFilter || order.delivery_status === deliveryFilter
    return matchesSearch && matchesPayment && matchesDelivery
  })

  return (
    <div className="pt-24 lg:pt-28 min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex items-center justify-between mb-8">
          <h1 className="font-display text-3xl font-bold">Admin Panel</h1>
          <button
            onClick={() => setAuthenticated(false)}
            className="text-gray-500 hover:text-black"
          >
            Logout
          </button>
        </div>

        <div className="bg-white rounded-lg shadow mb-6">
          <div className="flex border-b">
            <button
              onClick={() => setActiveTab('orders')}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'orders' ? 'border-b-2 border-black' : 'text-gray-500'
              }`}
            >
              <Package className="w-5 h-5 inline-block mr-2" />
              Orders ({orders.length})
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`flex-1 py-4 text-center font-medium ${
                activeTab === 'users' ? 'border-b-2 border-black' : 'text-gray-500'
              }`}
            >
              <Users className="w-5 h-5 inline-block mr-2" />
              Users ({users.length})
            </button>
          </div>
        </div>

        {activeTab === 'orders' && (
          <>
            <div className="flex gap-4 mb-6 flex-wrap">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 min-w-[200px] px-4 py-2 border rounded-lg"
              />
              <select
                value={paymentFilter}
                onChange={(e) => setPaymentFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Payments</option>
                {paymentStatuses.map(s => (
                  <option key={s} value={s}>{s === 'on_the_way' ? 'On The Way' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
              <select
                value={deliveryFilter}
                onChange={(e) => setDeliveryFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Deliveries</option>
                {deliveryStatuses.map(s => (
                  <option key={s} value={s}>{s === 'on_the_way' ? 'On The Way' : s.charAt(0).toUpperCase() + s.slice(1)}</option>
                ))}
              </select>
            </div>

            {loading ? (
              <div className="text-center py-12">Loading...</div>
            ) : filteredOrders.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No orders found</div>
            ) : (
              <div className="space-y-4">
                {filteredOrders.map(order => (
                  <div key={order.id} className="bg-white rounded-lg shadow overflow-hidden">
                    <div 
                      className="p-4 cursor-pointer hover:bg-gray-50"
                      onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <span className="font-medium">Order #{(order as any).order_number || order.id}</span>
                          <span className="text-gray-500 ml-4">{order.customer_name}</span>
                          <span className="text-gray-400 ml-2 text-sm">{order.customer_email}</span>
                          <span className="text-gray-400 ml-2 text-sm">{new Date(order.created_at).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-3">
                          <span className="font-medium">₦{Number(order.total).toLocaleString()}</span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.payment_status === 'confirmed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                          }`}>
                            {order.payment_status || 'pending'}
                          </span>
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.delivery_status === 'delivered' ? 'bg-green-100 text-green-800' :
                            order.delivery_status === 'on_the_way' ? 'bg-purple-100 text-purple-800' :
                            'bg-gray-100 text-gray-800'
                          }`}>
                            {order.delivery_status || 'pending'}
                          </span>
                          <span className="font-medium">₦{Number(order.total).toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <div className="border-t p-4">
                        <div className="mb-4">
                          <p><strong>Phone:</strong> {order.customer_phone}</p>
                          <p><strong>Address:</strong> {order.shipping_address}, {order.shipping_city}, {order.shipping_state}</p>
                          <p><strong>Payment:</strong> {order.payment_method}</p>
                        </div>
                        
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <p className="font-medium mb-2">Payment Confirmation:</p>
                            <div className="flex gap-2">
                              {paymentStatuses.map(status => (
                                <button
                                  key={status}
                                  onClick={() => updatePaymentStatus(order.id, status)}
                                  className={`px-4 py-2 rounded ${
                                    (order.payment_status || 'pending') === status ? 'bg-black text-white' : 'bg-gray-100'
                                  }`}
                                >
                                  {status}
                                </button>
                              ))}
                            </div>
                          </div>
                          <div>
                            <p className="font-medium mb-2">Delivery Progress:</p>
                            <div className="flex gap-2 flex-wrap">
                              {deliveryStatuses.map(status => (
                                <button
                                  key={status}
                                  onClick={() => updateDeliveryStatus(order.id, status)}
                                  className={`px-4 py-2 rounded ${
                                    (order.delivery_status || 'pending') === status ? 'bg-black text-white' : 'bg-gray-100'
                                  }`}
                                >
                                  {status === 'on_the_way' ? 'On The Way' : status}
                                </button>
                              ))}
                            </div>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {activeTab === 'users' && (
          <div className="bg-white rounded-lg shadow overflow-hidden">
            {users.length === 0 ? (
              <div className="text-center py-12 text-gray-500">No users found</div>
            ) : (
              <table className="w-full">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-4 py-3 text-left">Email</th>
                    <th className="px-4 py-3 text-left">Name</th>
                    <th className="px-4 py-3 text-left">Phone</th>
                    <th className="px-4 py-3 text-left">Joined</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user.id} className="border-t">
                      <td className="px-4 py-3">{user.email}</td>
                      <td className="px-4 py-3">{user.full_name || '-'}</td>
                      <td className="px-4 py-3">{user.phone || '-'}</td>
                      <td className="px-4 py-3">{new Date(user.created_at).toLocaleDateString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>
    </div>
  )
}