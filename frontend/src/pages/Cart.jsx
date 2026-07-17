import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { formatPrice, calculateDeliveryFee } from '../utils/formatters'

const Cart = () => {
  const navigate = useNavigate()
  const { cartItems, removeFromCart, updateQuantity, getTotalPrice } = useCart()
  const [selectedSlot, setSelectedSlot] = useState('express')
  const [couponCode, setCouponCode] = useState('')
  const [appliedCoupon, setAppliedCoupon] = useState(null)

  const subtotal = getTotalPrice()
  const deliveryFee = calculateDeliveryFee(subtotal)
  const handlingCharge = Math.ceil(subtotal * 0.02) // 2% handling charge
  const discount = appliedCoupon ? Math.round(subtotal * 0.1) : 0 // 10% for demo coupon
  const total = subtotal + deliveryFee + handlingCharge - discount

  const deliverySlots = [
    { id: 'express', name: 'Express', time: '45 mins', fee: 0 },
    { id: 'standard', name: 'Standard', time: '2 hours', fee: 20 }
  ]

  const handleCoupon = () => {
    if (couponCode.toUpperCase() === 'WELCOME50') {
      setAppliedCoupon('WELCOME50')
    } else {
      alert('Invalid coupon code')
    }
  }

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-7xl mx-auto px-4 py-12">
          <div className="text-center">
            <div className="text-6xl mb-4">🛒</div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Your Cart is Empty</h1>
            <p className="text-gray-600 mb-6">Add some plants or seeds to your cart!</p>
            <Link
              to="/"
              className="inline-block bg-green-600 text-white px-6 py-3 rounded-lg font-semibold hover:bg-green-700 transition"
            >
              Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Shopping Cart</h1>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cartItems.map(item => (
              <div key={item._id} className="bg-white rounded-lg p-4 flex gap-4 shadow-sm">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-24 h-24 object-cover rounded-lg"
                />

                <div className="flex-grow">
                  <h3 className="font-semibold text-gray-900">{item.name}</h3>
                  <p className="text-sm text-gray-600 mb-2">₹{item.price}</p>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center border border-gray-300 rounded">
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity - 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        −
                      </button>
                      <span className="px-3 py-1">{item.quantity}</span>
                      <button
                        onClick={() => updateQuantity(item._id, item.quantity + 1)}
                        className="px-3 py-1 text-gray-600 hover:bg-gray-100"
                      >
                        +
                      </button>
                    </div>

                    <div className="text-right">
                      <p className="font-semibold text-gray-900">
                        {formatPrice((item.discountPrice || item.price) * item.quantity)}
                      </p>
                      <button
                        onClick={() => removeFromCart(item._id)}
                        className="text-red-600 text-sm hover:text-red-700"
                      >
                        Remove
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="bg-white rounded-lg p-6 h-fit sticky top-24">
            <h2 className="text-xl font-bold text-gray-900 mb-6">Order Summary</h2>

            {/* Delivery Slot */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">Delivery Slot</h3>
              <div className="space-y-2">
                {deliverySlots.map(slot => (
                  <label key={slot.id} className="flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
                    <input
                      type="radio"
                      name="delivery"
                      value={slot.id}
                      checked={selectedSlot === slot.id}
                      onChange={(e) => setSelectedSlot(e.target.value)}
                      className="mr-3"
                    />
                    <div className="flex-grow">
                      <p className="font-semibold text-gray-900">{slot.name}</p>
                      <p className="text-xs text-gray-600">{slot.time}</p>
                    </div>
                    <p className="text-sm text-gray-600">+{formatPrice(slot.fee)}</p>
                  </label>
                ))}
              </div>
            </div>

            {/* Coupon */}
            <div className="mb-6 pb-6 border-b">
              <h3 className="font-semibold text-gray-900 mb-3">Apply Coupon</h3>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={couponCode}
                  onChange={(e) => setCouponCode(e.target.value.toUpperCase())}
                  placeholder="Enter code"
                  className="flex-grow px-3 py-2 border border-gray-300 rounded text-sm"
                />
                <button
                  onClick={handleCoupon}
                  className="px-4 py-2 bg-green-600 text-white rounded font-semibold hover:bg-green-700 text-sm transition"
                >
                  Apply
                </button>
              </div>
              {appliedCoupon && (
                <p className="text-xs text-green-600 mt-2">✓ Code {appliedCoupon} applied!</p>
              )}
            </div>

            {/* Price Breakdown */}
            <div className="space-y-2 mb-6 pb-6 border-b">
              <div className="flex justify-between text-sm text-gray-700">
                <span>Subtotal</span>
                <span>{formatPrice(subtotal)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Delivery Fee</span>
                <span>{deliveryFee === 0 ? 'FREE' : formatPrice(deliveryFee)}</span>
              </div>
              <div className="flex justify-between text-sm text-gray-700">
                <span>Handling Charge</span>
                <span>{formatPrice(handlingCharge)}</span>
              </div>
              {discount > 0 && (
                <div className="flex justify-between text-sm text-green-600">
                  <span>Discount</span>
                  <span>-{formatPrice(discount)}</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-center mb-6 pb-6 border-b">
              <span className="font-bold text-gray-900">Total</span>
              <span className="text-2xl font-bold text-green-600">{formatPrice(total)}</span>
            </div>

            {/* CTA */}
            <button
              onClick={() => navigate('/checkout')}
              className="w-full bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition mb-2"
            >
              Proceed to Checkout
            </button>

            <Link
              to="/"
              className="block text-center py-3 border-2 border-green-600 text-green-600 rounded-lg font-semibold hover:bg-green-50 transition"
            >
              Continue Shopping
            </Link>

            {/* Benefits */}
            <div className="mt-6 space-y-2 text-xs text-gray-600">
              <p>✓ Free delivery on orders above ₹499</p>
              <p>✓ 7-day return policy</p>
              <p>✓ 24/7 customer support</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Cart
