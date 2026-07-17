import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import { productAPI } from '../utils/api'
import ProductCard from '../components/ProductCard'

const Category = () => {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const subCategory = searchParams.get('sub')
  const searchQuery = searchParams.get('search')
  
  const [products, setProducts] = useState([])
  const [subcategories, setSubcategories] = useState([])
  const [selectedSubcategory, setSelectedSubcategory] = useState(subCategory || 'all')
  const [sortBy, setSortBy] = useState('createdAt')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [minRating, setMinRating] = useState(0)
  const [loading, setLoading] = useState(true)

  // Fetch products and subcategories
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        
        const filters = {
          category,
          subCategory: selectedSubcategory !== 'all' ? selectedSubcategory : null,
          search: searchQuery,
          sort: sortBy,
          minPrice: priceRange[0],
          maxPrice: priceRange[1],
          minRating: minRating || null
        }

        const response = await productAPI.getAllProducts(filters)
        setProducts(response.data.data || [])

        // Fetch subcategories only once per category
        if (subcategories.length === 0) {
          const catResponse = await productAPI.getProductsByCategory(category)
          setSubcategories(catResponse.data.subcategories || [])
        }
      } catch (error) {
        console.error('Error fetching products:', error)
        setProducts([])
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [category, selectedSubcategory, sortBy, priceRange, minRating, searchQuery])

  const handleSubcategoryChange = (sub) => {
    setSelectedSubcategory(sub)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
          {category} {searchQuery && `- Results for "${searchQuery}"`}
        </h1>
        <p className="text-gray-600 mb-6">
          Showing {products.length} product{products.length !== 1 ? 's' : ''}
        </p>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24 space-y-6">
              {/* Subcategory filter */}
              <div>
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Type</h3>
                <div className="space-y-2">
                  <button
                    onClick={() => handleSubcategoryChange('all')}
                    className={`w-full text-left px-3 py-2 rounded-lg transition ${
                      selectedSubcategory === 'all'
                        ? 'bg-green-600 text-white'
                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                    }`}
                  >
                    All Types
                  </button>
                  {subcategories.map(sub => (
                    <button
                      key={sub}
                      onClick={() => handleSubcategoryChange(sub)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition capitalize ${
                        selectedSubcategory === sub
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {sub}
                    </button>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Price Range</h3>
                <div className="space-y-3">
                  <div className="flex gap-2">
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={priceRange[0]}
                      onChange={(e) => setPriceRange([parseInt(e.target.value) || 0, priceRange[1]])}
                      className="w-24 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                      placeholder="Min"
                    />
                    <input
                      type="number"
                      min="0"
                      max="5000"
                      value={priceRange[1]}
                      onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value) || 5000])}
                      className="w-24 px-2 py-2 border border-gray-300 rounded text-sm focus:outline-none focus:border-green-500"
                      placeholder="Max"
                    />
                  </div>
                  <p className="text-xs text-gray-600">
                    ₹{priceRange[0]} - ₹{priceRange[1]}
                  </p>
                </div>
              </div>

              {/* Rating filter */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-3 text-lg">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2].map(stars => (
                    <button
                      key={stars}
                      onClick={() => setMinRating(minRating === stars ? 0 : stars)}
                      className={`w-full text-left px-3 py-2 rounded-lg transition ${
                        minRating === stars
                          ? 'bg-green-600 text-white'
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      ⭐ {stars}+ stars
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Products */}
          <div className="flex-grow">
            {/* Sort */}
            <div className="mb-6 flex justify-between items-center">
              <div>
                <label className="text-sm text-gray-700 mr-3">Sort by:</label>
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="px-4 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                >
                  <option value="createdAt">Newest</option>
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="price">Price: Low to High</option>
                </select>
              </div>
            </div>

            {/* Product Grid */}
            {loading ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {[1, 2, 3, 4, 5, 6].map(i => (
                  <div key={i} className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
                ))}
              </div>
            ) : products.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {products.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg mb-4">No products found</p>
                <p className="text-gray-500">Try adjusting your filters or search terms</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category
