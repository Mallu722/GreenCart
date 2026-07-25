import React, { useState, useEffect } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import SearchBar from './SearchBar'
import LocationModal from './LocationModal'

const Header = () => {
  const navigate = useNavigate()
  const location = useLocation()
  const { getTotalItems } = useCart()
  const [location_, setLocation_] = useState('Select Location')
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false)
  const totalItems = getTotalItems()
  const isAuthenticated = localStorage.getItem('token')

  // Load saved location on mount
  useEffect(() => {
    const savedLocation = localStorage.getItem('selectedLocation')
    if (savedLocation) {
      setLocation_(savedLocation)
    }
  }, [])

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-gray-200 shadow-sm">
      {/* Top bar with location and account */}
      <div className="bg-green-50 px-4 py-2 text-sm text-gray-700">
        <div className="max-w-7xl mx-auto flex justify-between items-center">
          <div className="flex items-center gap-4">
            <button 
              className="text-green-600 font-semibold hover:text-green-700 flex items-center gap-1"
              onClick={() => setIsLocationModalOpen(true)}
            >
              <span>📍</span> {location_}
            </button>
          </div>
          <div className="flex items-center gap-6">
            {isAuthenticated ? (
              <>
                <Link to="/profile" className="hover:text-green-600">My Account</Link>
                <button 
                  onClick={() => {
                    localStorage.removeItem('token')
                    navigate('/')
                  }}
                  className="text-red-600 hover:text-red-700"
                >
                  Logout
                </button>
              </>
            ) : (
              <>
                <Link to="/login" className="hover:text-green-600">Login</Link>
                <Link to="/signup" className="hover:text-green-600">Sign Up</Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Main header */}
      <div className="px-4 py-4 max-w-7xl mx-auto">
        <div className="flex items-center gap-4">
          {/* Logo */}
          <Link to="/" className="flex-shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-green-600">🌿</span>
              <span className="text-xl font-bold text-gray-900">GreenCart</span>
            </div>
          </Link>

          {/* Search bar */}
          <div className="flex-grow mx-4">
            <SearchBar />
          </div>

          {/* Cart icon */}
          <Link to="/cart" className="relative flex-shrink-0">
            <div className="text-2xl hover:text-green-600 transition">🛒</div>
            {totalItems > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {totalItems}
              </span>
            )}
          </Link>

          {/* Admin link (for testing) */}
          <Link to="/admin" className="text-gray-600 hover:text-green-600 text-sm">
            Admin
          </Link>
        </div>
      </div>

      {/* Category tabs */}
      <div className="bg-white border-t border-gray-100 px-4 py-2">
        <div className="max-w-7xl mx-auto flex gap-8 text-sm">
          <Link 
            to="/category/plants" 
            className={`py-2 font-medium transition ${
              location.pathname.includes('plants') 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Plants
          </Link>
          <Link 
            to="/category/seeds" 
            className={`py-2 font-medium transition ${
              location.pathname.includes('seeds') 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Seeds
          </Link>
          <Link 
            to="/category/soil" 
            className={`py-2 font-medium transition ${
              location.pathname.includes('soil') 
                ? 'text-green-600 border-b-2 border-green-600' 
                : 'text-gray-600 hover:text-green-600'
            }`}
          >
            Soil
          </Link>
        </div>
      </div>

      {/* Toast container */}
      <div id="toast-container" className="fixed bottom-4 right-4 z-50"></div>

      {/* Location Selector Modal */}
      <LocationModal
        isOpen={isLocationModalOpen}
        onClose={() => setIsLocationModalOpen(false)}
        onConfirm={(loc) => {
          setLocation_(loc.shortName)
          localStorage.setItem('selectedLocation', loc.shortName)
          localStorage.setItem('deliveryAddressFull', loc.fullName)
        }}
      />
    </header>
  )
}

export default Header
