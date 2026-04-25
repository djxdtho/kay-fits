import { useState } from 'react'
import { Package, Users, Lock, Eye, EyeOff } from 'lucide-react'
import { supabase } from '../lib/supabase'
import { Order } from '../store/cart'
import { Link } from 'react-router-dom'

const ADMIN_PASSWORD = 'kayfits2024'

export default function Admin() {
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [authenticated, setAuthenticated] = useState(false)
  const [orders, setOrders] = useState<any[]>([])
  const [users, setUsers] = useState<any[]>([])
  const [loading, setLoading] = useState(false)
  const [activeTab, setActiveTab] = useState<'orders' | 'users'>('orders')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('')
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
      const { data: ordersData, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false })
        .range(0, 99)

      if (error) throw error

      const ordersWithItems = await Promise.all(
        (ordersData || []).map(async (order) => {
          const { data: items } = await supabase
            .from('order_items')
            .select('*, products(*)')
            .eq('order_id', order.id)

          const { data: userData } = await supabase
            .from('users')
            .select('email')
            .eq('id', order.user_id)
            .single()

          return {
            ...order,
            items: items || [],
            user_email: userData?.email
          }
        })
      )

      setOrders(ordersWithItems)
    } catch (err) {
      console.error('Error fetching orders:', err)
    } finally {
      setLoading(false)
    }
  }

  const fetchUsers = async () => {
    try {
      const { data, error } = await supabase
        .from('users')
        .select('*')
        .range(0, 99)

      if (error) throw error
      setUsers(data || [])
    } catch (err) {
      console.error('Error fetching users:', err)
    }
  }

  const updateOrderStatus = async (orderId: number, status: string) => {
    try {
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId)

      if (error) throw error
      fetchOrders()
    } catch (err) {
      console.error('Error updating order:', err)
    }
  }

  const statusFlow = ['pending', 'confirmed', 'on_the_way', 'delivered']

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
                  {showPassword ? <EyeOff className="w-5 h-5 text-gray-400" /> : <Eye className="w-5 h-5 text-gray-400" />}
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
      order.user_email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.tracking_number?.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = !statusFilter || order.status === statusFilter
    return matchesSearch && matchesStatus
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
            <div className="flex gap-4 mb-6">
              <input
                type="text"
                placeholder="Search orders..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="flex-1 px-4 py-2 border rounded-lg"
              />
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-4 py-2 border rounded-lg"
              >
                <option value="">All Status</option>
                <option value="pending">Pending</option>
                <option value="confirmed">Confirmed</option>
                <option value="on_the_way">On The Way</option>
                <option value="delivered">Delivered</option>
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
                          <span className="font-medium">Order #{order.id}</span>
                          <span className="text-gray-500 ml-4">{order.user_email}</span>
                        </div>
                        <div className="flex items-center gap-4">
                          <span className={`px-3 py-1 rounded-full text-sm ${
                            order.status === 'pending' ? 'bg-yellow-100 text-yellow-800' :
                            order.status === 'confirmed' ? 'bg-blue-100 text-blue-800' :
                            order.status === 'on_the_way' ? 'bg-purple-100 text-purple-800' :
                            'bg-green-100 text-green-800'
                          }`}>
                            {order.status}
                          </span>
                          <span className="font-medium">₦{order.total.toLocaleString()}</span>
                        </div>
                      </div>
                    </div>
                    
                    {expandedOrder === order.id && (
                      <div className="border-t p-4">
                        <div className="mb-4">
                          <h4 className="font-medium mb-2">Items:</h4>
                          {order.items.map((item: any, i: any) => (
                            <div key={i} className="flex justify-between py-2 border-b">
                              <div>
                                <p>{item.product?.name || item.products?.name}</p>
                                <p className="text-sm text-gray-500">{item.size} / {item.color} x {item.quantity}</p>
                              </div>
                              <p>₦{item.price.toLocaleString()}</p>
                            </div>
                          ))}
                        </div>
                        
                        <div className="mb-4">
                          <p><strong>Phone:</strong> {order.shipping_phone}</p>
                          <p><strong>Address:</strong> {order.shipping_address}</p>
                          <p><strong>Payment:</strong> {order.payment_method}</p>
                          {order.tracking_number && <p><strong>Tracking:</strong> {order.tracking_number}</p>}
                        </div>
                        
                        <div className="flex gap-2">
                          {statusFlow.map(status => (
                            <button
                              key={status}
                              onClick={() => updateOrderStatus(order.id, status)}
                              className={`px-4 py-2 rounded ${
                                order.status === status ? 'bg-black text-white' : 'bg-gray-100'
                              }`}
                            >
                              {status}
                            </button>
                          ))}
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
          </div>
        )}
      </div>
    </div>
  )
}