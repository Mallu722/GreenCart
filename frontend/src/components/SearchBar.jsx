import React, { useState, useEffect, useRef } from 'react'
import { useNavigate } from 'react-router-dom'
import { productAPI } from '../utils/api'

const SearchBar = () => {
  const navigate = useNavigate()
  const [searchQuery, setSearchQuery] = useState('')
  const [suggestions, setSuggestions] = useState([])
  const [showSuggestions, setShowSuggestions] = useState(false)
  const [loading, setLoading] = useState(false)
  const searchRef = useRef(null)

  // Fetch search suggestions
  useEffect(() => {
    if (searchQuery.length >= 2) {
      setLoading(true)
      const timer = setTimeout(async () => {
        try {
          const response = await productAPI.getSearchSuggestions(searchQuery)
          setSuggestions(response.data.data || [])
          setShowSuggestions(true)
        } catch (error) {
          console.error('Error fetching suggestions:', error)
          setSuggestions([])
        } finally {
          setLoading(false)
        }
      }, 300) // Debounce search

      return () => clearTimeout(timer)
    } else {
      setSuggestions([])
      setShowSuggestions(false)
    }
  }, [searchQuery])

  // Close suggestions when clicking outside
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (searchRef.current && !searchRef.current.contains(e.target)) {
        setShowSuggestions(false)
      }
    }

    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  const handleSearch = (e) => {
    e.preventDefault()
    if (searchQuery.trim()) {
      navigate(`/?search=${encodeURIComponent(searchQuery)}`)
      setSearchQuery('')
      setShowSuggestions(false)
    }
  }

  const handleSuggestionClick = (product) => {
    if (product.category === 'plants') {
      navigate(`/category/plants?sub=${product.subCategory}&search=${product.name}`)
    } else {
      navigate(`/category/seeds?sub=${product.subCategory}&search=${product.name}`)
    }
    setSearchQuery('')
    setShowSuggestions(false)
  }

  return (
    <div className="relative w-full" ref={searchRef}>
      <form onSubmit={handleSearch} className="relative">
        <div className="relative">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search plants, seeds..."
            className="w-full px-4 py-2 pr-10 border border-gray-300 rounded-lg focus:outline-none focus:border-green-500 focus:ring-1 focus:ring-green-500"
          />
          <button
            type="submit"
            className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600"
          >
            🔍
          </button>
        </div>
      </form>

      {/* Suggestions Dropdown */}
      {showSuggestions && (
        <div className="absolute top-full left-0 right-0 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 z-50 max-h-96 overflow-y-auto">
          {loading ? (
            <div className="p-4 text-center text-gray-500">
              <div className="inline-block animate-spin">⏳</div> Searching...
            </div>
          ) : suggestions.length > 0 ? (
            <div>
              <div className="px-4 py-2 text-xs text-gray-600 bg-gray-50 font-semibold">
                Suggestions
              </div>
              {suggestions.map((product) => (
                <button
                  key={product._id}
                  onClick={() => handleSuggestionClick(product)}
                  className="w-full flex items-center gap-3 px-4 py-3 hover:bg-green-50 transition text-left border-b border-gray-100 last:border-0"
                >
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-12 h-12 rounded object-cover"
                  />
                  <div className="flex-grow">
                    <p className="text-sm font-semibold text-gray-900">
                      {product.name}
                    </p>
                    <p className="text-xs text-gray-600 capitalize">
                      {product.category} • {product.subCategory}
                    </p>
                  </div>
                </button>
              ))}
            </div>
          ) : searchQuery.length >= 2 ? (
            <div className="p-4 text-center text-gray-500">
              No products found for "{searchQuery}"
            </div>
          ) : null}
        </div>
      )}
    </div>
  )
}

export default SearchBar
