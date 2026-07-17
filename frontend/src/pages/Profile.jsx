import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { formatPrice, formatDate } from '../utils/formatters'

const Profile = () => {
  const navigate = useNavigate()
  const [tab, setTab] = useState('orders')
  const isAuthenticated = localStorage.getItem('token')

  // Mock user data
  const user = JSON.parse(localStorage.getItem('user') || '{"name": "User", "email": "user@example.com"}')

  // Mock orders
  const orders = [
    {
      _id: 'GC1234567890',
      date: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000),
      total: 299,
      status: 'delivered',
      items: [
        { name: 'Money Plant', qty: 1, price: 99 },
        { name: 'Snake Plant', qty: 1, price: 149 }
      ]
    },
    {
      _id: 'GC0987654321',
      date: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000),
      total: 449,
      status: 'processing',
      items: [
        { name: 'Pothos Plant', qty: 2, price: 79 }
      ]
    }
  ]

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Please login to view your profile</p>
          <button
            onClick={() => navigate('/login')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Login
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">My Account</h1>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-green-600 rounded-full mx-auto mb-4 flex items-center justify-center text-2xl">
                  👤
                </div>
                <h2 className="text-lg font-bold text-gray-900">{user.name}</h2>
                <p className="text-sm text-gray-600">{user.email}</p>
              </div>

              <nav className="space-y-2">
                <button
                  onClick={() => setTab('orders')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition ${
                    tab === 'orders'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📦 My Orders
                </button>
                <button
                  onClick={() => setTab('profile')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition ${
                    tab === 'profile'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  👤 Profile
                </button>
                <button
                  onClick={() => setTab('addresses')}
                  className={`w-full text-left px-4 py-2 rounded-lg font-semibold transition ${
                    tab === 'addresses'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-700 hover:bg-gray-100'
                  }`}
                >
                  📍 Addresses
                </button>
                <button
                  onClick={() => {
                    localStorage.removeItem('token')
                    localStorage.removeItem('user')
                    navigate('/')
                  }}
                  className="w-full text-left px-4 py-2 rounded-lg font-semibold text-red-600 hover:bg-red-50 transition"
                >
                  🚪 Logout
                </button>
              </nav>
            </div>
          </div>

          {/* Content */}
          <div className="lg:col-span-3">
            {/* Orders Tab */}
            {tab === 'orders' && (
              <div className="space-y-4">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Order History</h2>
                {orders.length > 0 ? (
                  orders.map(order => (
                    <div key={order._id} className="bg-white rounded-lg p-6">
                      <div className="flex justify-between items-start mb-4">
                        <div>
                          <p className="text-sm text-gray-600">Order ID: {order._id}</p>
                          <p className="text-sm text-gray-600">Date: {formatDate(order.date)}</p>
                        </div>
                        <span className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          order.status === 'delivered'
                            ? 'bg-green-100 text-green-800'
                            : 'bg-blue-100 text-blue-800'
                        }`}>
                          {order.status === 'delivered' ? '✓ Delivered' : '⏳ Processing'}
                        </span>
                      </div>

                      <div className="mb-4">
                        {order.items.map((item, idx) => (
                          <p key={idx} className="text-gray-600 text-sm">
                            {item.name} x {item.qty} — {formatPrice(item.price * item.qty)}
                          </p>
                        ))}
                      </div>

                      <div className="flex justify-between items-center pt-4 border-t">
                        <span className="font-semibold text-gray-900">Total: {formatPrice(order.total)}</span>
                        <button className="text-green-600 font-semibold hover:text-green-700">
                          View Details →
                        </button>
                      </div>
                    </div>
                  ))
                ) : (
                  <p className="text-gray-600">No orders yet</p>
                )}
              </div>
            )}

            {/* Profile Tab */}
            {tab === 'profile' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Personal Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Name</label>
                    <input
                      type="text"
                      defaultValue={user.name}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Email</label>
                    <input
                      type="email"
                      defaultValue={user.email}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">Phone</label>
                    <input
                      type="tel"
                      placeholder="9876543210"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">City</label>
                    <input
                      type="text"
                      placeholder="Mumbai"
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>
                <button className="mt-6 bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition">
                  Save Changes
                </button>
              </div>
            )}

            {/* Addresses Tab */}
            {tab === 'addresses' && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Saved Addresses</h2>
                <div className="space-y-4 mb-6">
                  <div className="border border-green-600 rounded-lg p-4">
                    <div className="flex justify-between items-start mb-2">
                      <p className="font-semibold text-gray-900">📍 Home (Default)</p>
                      <button className="text-blue-600 text-sm hover:underline">Edit</button>
                    </div>
                    <p className="text-gray-600 text-sm">123 Green Street, Mumbai 400001</p>
                    <p className="text-gray-600 text-sm">Near Market</p>
                  </div>
                </div>
                <button className="w-full border-2 border-green-600 text-green-600 px-4 py-2 rounded-lg font-semibold hover:bg-green-50 transition">
                  + Add New Address
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile
