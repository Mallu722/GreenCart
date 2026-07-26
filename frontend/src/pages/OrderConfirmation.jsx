import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { formatDate } from '../utils/formatters'
import AiGrowthGuideCard from '../components/AiGrowthGuideCard'

const OrderConfirmation = () => {
  const { orderId } = useParams()
  const deliveryDate = new Date(Date.now() + 45 * 60000)

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Success Message */}
        <div className="bg-white rounded-lg p-8 text-center mb-6">
          <div className="text-6xl mb-4">✅</div>
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Order Confirmed!</h1>
          <p className="text-gray-600">Thank you for your order. Your plants will reach soon.</p>
        </div>

        {/* Order Details */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <div className="grid grid-cols-2 gap-6 mb-6">
            <div>
              <p className="text-sm text-gray-600 mb-1">Order ID</p>
              <p className="text-lg font-bold text-gray-900">{orderId}</p>
            </div>
            <div>
              <p className="text-sm text-gray-600 mb-1">Estimated Delivery</p>
              <p className="text-lg font-bold text-green-600">
                {formatDate(deliveryDate)} • 45 mins
              </p>
            </div>
          </div>

          {/* Status */}
          <div className="bg-green-50 rounded-lg p-4 mb-6">
            <div className="flex items-center gap-3 mb-3">
              <span className="text-2xl">🚚</span>
              <div>
                <p className="font-semibold text-gray-900">Out for Delivery</p>
                <p className="text-sm text-gray-600">Your order is being prepared</p>
              </div>
            </div>
          </div>

          {/* Timeline */}
          <div className="space-y-4">
            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">✓</div>
                <div className="w-1 h-8 bg-green-600"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Order Placed</p>
                <p className="text-sm text-gray-600">Just now</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-green-600 text-white flex items-center justify-center">📦</div>
                <div className="w-1 h-8 bg-gray-300"></div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Packing</p>
                <p className="text-sm text-gray-600">In progress</p>
              </div>
            </div>

            <div className="flex items-start gap-4">
              <div className="flex flex-col items-center">
                <div className="w-8 h-8 rounded-full bg-gray-300 flex items-center justify-center">🚚</div>
              </div>
              <div>
                <p className="font-semibold text-gray-900">Out for Delivery</p>
                <p className="text-sm text-gray-600">Arriving soon</p>
              </div>
            </div>
          </div>
        </div>

        {/* What's Next */}
        <div className="bg-white rounded-lg p-6 mb-6">
          <h2 className="text-lg font-bold text-gray-900 mb-4">What's Next?</h2>
          <ul className="space-y-3 text-sm text-gray-700">
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>You'll receive an SMS with live tracking link</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Keep cash or UPI ready for delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>Inspect products before accepting delivery</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-green-600 mt-1">✓</span>
              <span>7-day return policy if you're not satisfied</span>
            </li>
          </ul>
        </div>

        {/* AI Growing Instructions for Ordered Plant */}
        <div className="mb-6">
          <h2 className="text-xl font-bold text-gray-900 mb-2 flex items-center gap-2">
            <span>✨</span> Gemini AI Growth & Care Guide
          </h2>
          <p className="text-sm text-gray-600 mb-4">Here are customized growing instructions, temperature recommendations, and soil tips for your ordered items:</p>
          <AiGrowthGuideCard productName="Money Plant" category="plants" subCategory="indoor" />
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Link
            to="/profile"
            className="flex-1 bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition text-center"
          >
            Track Order
          </Link>
          <Link
            to="/"
            className="flex-1 border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition text-center"
          >
            Continue Shopping
          </Link>
        </div>

        {/* Contact */}
        <div className="mt-8 text-center text-sm text-gray-600">
          <p>Need help? <a href="mailto:support@greencart.com" className="text-green-600 hover:underline">Contact support</a></p>
        </div>
      </div>
    </div>
  )
}

export default OrderConfirmation
