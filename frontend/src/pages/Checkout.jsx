import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, generateOrderId } from '../utils/formatters'
import { showToast } from '../utils/toast'

const Checkout = () => {
  const navigate = useNavigate()
  const { cartItems, getTotalPrice, clearCart } = useCart()
  const [step, setStep] = useState(1) // 1: Address, 2: Payment
  const [formData, setFormData] = useState(() => {
    const savedAddress = localStorage.getItem('deliveryAddressFull') || ''
    const savedCity = localStorage.getItem('selectedLocation') || ''
    return {
      firstName: '',
      lastName: '',
      phone: '',
      pincode: '',
      address: savedAddress,
      landmark: '',
      city: savedCity === 'Select Location' ? '' : savedCity,
      state: ''
    }
  })
  const [paymentMethod, setPaymentMethod] = useState('cod')

  const subtotal = getTotalPrice()
  const deliveryFee = subtotal >= 499 ? 0 : 40
  const handlingCharge = Math.ceil(subtotal * 0.02)
  const total = subtotal + deliveryFee + handlingCharge

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const validateAddress = () => {
    if (!formData.firstName || !formData.phone || !formData.pincode || !formData.address) {
      showToast('Please fill all required fields', 'error')
      return false
    }
    if (formData.phone.length !== 10) {
      showToast('Phone number must be 10 digits', 'error')
      return false
    }
    return true
  }

  const handlePlaceOrder = async () => {
    if (paymentMethod === 'upi') {
      // Mock UPI payment
      setTimeout(() => {
        const orderId = generateOrderId()
        clearCart()
        navigate(`/order-confirmation/${orderId}`)
      }, 1000)
    } else if (paymentMethod === 'card') {
      // Mock card payment
      setTimeout(() => {
        const orderId = generateOrderId()
        clearCart()
        navigate(`/order-confirmation/${orderId}`)
      }, 1000)
    } else {
      // COD - No payment required
      const orderId = generateOrderId()
      clearCart()
      navigate(`/order-confirmation/${orderId}`)
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Your cart is empty</p>
          <button
            onClick={() => navigate('/cart')}
            className="bg-green-600 text-white px-6 py-2 rounded-lg"
          >
            Go to Cart
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Checkout</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2">
            {/* Steps */}
            <div className="flex gap-4 mb-8">
              <div className={`flex-1 p-4 rounded-lg font-semibold text-center transition ${
                step >= 1 ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
                1. Address
              </div>
              <div className={`flex-1 p-4 rounded-lg font-semibold text-center transition ${
                step >= 2 ? 'bg-green-600 text-white' : 'bg-white text-gray-600 border border-gray-300'
              }`}>
                2. Payment
              </div>
            </div>

            {/* Address Form */}
            {step === 1 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Delivery Address</h2>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      First Name *
                    </label>
                    <input
                      type="text"
                      name="firstName"
                      value={formData.firstName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      Last Name
                    </label>
                    <input
                      type="text"
                      name="lastName"
                      value={formData.lastName}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Phone Number *
                  </label>
                  <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    placeholder="10-digit mobile number"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Pincode *
                  </label>
                  <input
                    type="text"
                    name="pincode"
                    value={formData.pincode}
                    onChange={handleInputChange}
                    placeholder="e.g., 400001"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      City
                    </label>
                    <input
                      type="text"
                      name="city"
                      value={formData.city}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold text-gray-700 mb-2">
                      State
                    </label>
                    <input
                      type="text"
                      name="state"
                      value={formData.state}
                      onChange={handleInputChange}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                    />
                  </div>
                </div>

                <div className="mb-4">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Address *
                  </label>
                  <textarea
                    name="address"
                    value={formData.address}
                    onChange={handleInputChange}
                    placeholder="House no., building name, street"
                    rows="3"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  ></textarea>
                </div>

                <div className="mb-6">
                  <label className="block text-sm font-semibold text-gray-700 mb-2">
                    Landmark (Optional)
                  </label>
                  <input
                    type="text"
                    name="landmark"
                    value={formData.landmark}
                    onChange={handleInputChange}
                    placeholder="e.g., Near market"
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500"
                  />
                </div>

                <button
                  onClick={() => {
                    if (validateAddress()) {
                      setStep(2)
                    }
                  }}
                  className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                >
                  Continue to Payment
                </button>
              </div>
            )}

            {/* Payment Method */}
            {step === 2 && (
              <div className="bg-white rounded-lg p-6">
                <h2 className="text-xl font-bold text-gray-900 mb-6">Select Payment Method</h2>

                <div className="space-y-4 mb-6">
                  {[
                    { id: 'cod', name: 'Cash on Delivery', icon: '💵', desc: 'Pay when you receive' },
                    { id: 'upi', name: 'UPI', icon: '📱', desc: 'Google Pay, PhonePe, BHIM' },
                    { id: 'card', name: 'Debit/Credit Card', icon: '💳', desc: 'Visa, Mastercard, Amex' }
                  ].map(method => (
                    <label
                      key={method.id}
                      className={`p-4 border-2 rounded-lg cursor-pointer transition ${
                        paymentMethod === method.id
                          ? 'border-green-600 bg-green-50'
                          : 'border-gray-300 hover:border-gray-400'
                      }`}
                    >
                      <div className="flex items-center">
                        <input
                          type="radio"
                          name="payment"
                          value={method.id}
                          checked={paymentMethod === method.id}
                          onChange={(e) => setPaymentMethod(e.target.value)}
                          className="mr-4"
                        />
                        <div className="flex-grow">
                          <p className="font-semibold text-gray-900">{method.icon} {method.name}</p>
                          <p className="text-xs text-gray-600">{method.desc}</p>
                        </div>
                      </div>
                    </label>
                  ))}
                </div>

                <div className="flex gap-4">
                  <button
                    onClick={() => setStep(1)}
                    className="flex-1 border-2 border-gray-300 text-gray-700 py-3 rounded-lg font-semibold hover:bg-gray-50 transition"
                  >
                    Back
                  </button>
                  <button
                    onClick={handlePlaceOrder}
                    className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition"
                  >
                    Place Order
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* Order Summary Sidebar */}
          <div className="bg-white rounded-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            {/* Items */}
            <div className="mb-6 pb-6 border-b max-h-96 overflow-y-auto">
              {cartItems.map(item => (
                <div key={item._id} className="flex justify-between mb-3 text-sm">
                  <span className="text-gray-600">
                    {item.name} x {item.quantity}
                  </span>
                  <span className="font-semibold text-gray-900">
                    {formatPrice((item.discountPrice || item.price) * item.quantity)}
                  </span>
                </div>
              ))}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-6 pb-6 border-b text-sm">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Delivery</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Handling</span>
                <span>{formatPrice(handlingCharge)}</span>
              </div>
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">{formatPrice(total)}</span>
            </div>

            {/* Info */}
            <div className="space-y-2 text-xs text-gray-600">
              <p>✓ Express delivery: 45 mins</p>
              <p>✓ 7-day returns</p>
              <p>✓ Safe & secure</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Checkout
