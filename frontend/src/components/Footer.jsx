import React from 'react'
import { Link } from 'react-router-dom'

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      <div className="max-w-7xl mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* About */}
          <div>
            <h3 className="text-white font-bold mb-4 flex items-center gap-2">
              <span className="text-2xl">🌿</span> GreenCart
            </h3>
            <p className="text-sm">
              Fresh plants and seeds delivered to your doorstep in 45 minutes. Perfect for your home and garden.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-white font-bold mb-4">Quick Links</h4>
            <ul className="space-y-2 text-sm">
              <li><Link to="/" className="hover:text-green-400 transition">Home</Link></li>
              <li><Link to="/category/plants" className="hover:text-green-400 transition">Plants</Link></li>
              <li><Link to="/category/seeds" className="hover:text-green-400 transition">Seeds</Link></li>
              <li><Link to="/profile" className="hover:text-green-400 transition">My Orders</Link></li>
            </ul>
          </div>

          {/* Customer Service */}
          <div>
            <h4 className="text-white font-bold mb-4">Customer Service</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="mailto:support@greencart.com" className="hover:text-green-400 transition">Contact Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition">FAQ</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Shipping Info</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Returns</a></li>
            </ul>
          </div>

          {/* Info */}
          <div>
            <h4 className="text-white font-bold mb-4">Information</h4>
            <ul className="space-y-2 text-sm">
              <li><a href="#" className="hover:text-green-400 transition">About Us</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Terms & Conditions</a></li>
              <li><a href="#" className="hover:text-green-400 transition">Careers</a></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm">
          <p>&copy; 2024 GreenCart. All rights reserved. | Delivering freshness since 2024</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
