import React, { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'react-router-dom'
import ProductCard from '../components/ProductCard'

const Category = () => {
  const { category } = useParams()
  const [searchParams] = useSearchParams()
  const subCategory = searchParams.get('sub')
  const [products, setProducts] = useState([])
  const [filteredProducts, setFilteredProducts] = useState([])
  const [sortBy, setSortBy] = useState('popular')
  const [priceRange, setPriceRange] = useState([0, 5000])
  const [loading, setLoading] = useState(true)

  // Mock products
  const mockProducts = [
    {
      _id: '1',
      name: 'Money Plant',
      category: 'plants',
      subCategory: 'indoor',
      price: 149,
      discountPrice: 99,
      stock: 50,
      image: 'https://images.unsplash.com/photo-1509909756405-dfc993d674d4?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 245,
      deliveryTime: '45'
    },
    {
      _id: '2',
      name: 'Snake Plant',
      category: 'plants',
      subCategory: 'indoor',
      price: 199,
      discountPrice: 149,
      stock: 35,
      image: 'https://images.unsplash.com/photo-1614730321146-b6fa6a46bcb4?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 189,
      deliveryTime: '45'
    },
    {
      _id: '3',
      name: 'Tomato Seeds',
      category: 'seeds',
      subCategory: 'vegetable',
      price: 49,
      discountPrice: 39,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1585551666519-0055eca6402d?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 89,
      deliveryTime: '30'
    },
    {
      _id: '4',
      name: 'Basil Seeds',
      category: 'seeds',
      subCategory: 'vegetable',
      price: 39,
      discountPrice: 29,
      stock: 120,
      image: 'https://images.unsplash.com/photo-1518917183309-9d19ee268e0d?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 102,
      deliveryTime: '30'
    }
  ]

  useEffect(() => {
    // Filter products by category
    let filtered = mockProducts.filter(p => p.category === category)
    if (subCategory) {
      filtered = filtered.filter(p => p.subCategory === subCategory)
    }
    setProducts(filtered)
  }, [category, subCategory])

  useEffect(() => {
    // Apply sorting and price filter
    let result = [...products]

    // Price filter
    result = result.filter(p => {
      const price = p.discountPrice || p.price
      return price >= priceRange[0] && price <= priceRange[1]
    })

    // Sort
    switch (sortBy) {
      case 'popular':
        result.sort((a, b) => b.reviews - a.reviews)
        break
      case 'rating':
        result.sort((a, b) => b.rating - a.rating)
        break
      case 'priceLow':
        result.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
        break
      case 'priceHigh':
        result.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
        break
      default:
        break
    }

    setFilteredProducts(result)
    setLoading(false)
  }, [products, sortBy, priceRange])

  const subCategories = ['indoor', 'vegetable', 'fruit', 'decor', 'flower']

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <h1 className="text-3xl font-bold text-gray-900 mb-2 capitalize">
          {category}
        </h1>
        <p className="text-gray-600 mb-6">
          Showing {filteredProducts.length} products
        </p>

        <div className="flex gap-8">
          {/* Sidebar */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg p-6 sticky top-24">
              {/* Subcategory filter */}
              <div className="mb-6">
                <h3 className="font-bold text-gray-900 mb-3">Type</h3>
                <div className="space-y-2">
                  {subCategories.map(sub => (
                    <label key={sub} className="flex items-center">
                      <input type="radio" name="subcat" value={sub} 
                        onChange={() => setPriceRange([0, 5000])}
                        className="mr-2"
                      />
                      <span className="text-sm text-gray-700 capitalize">{sub}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Price filter */}
              <div className="mb-6 border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Price Range</h3>
                <div className="flex gap-2 mb-3">
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={priceRange[0]}
                    onChange={(e) => setPriceRange([parseInt(e.target.value), priceRange[1]])}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Min"
                  />
                  <input
                    type="number"
                    min="0"
                    max="5000"
                    value={priceRange[1]}
                    onChange={(e) => setPriceRange([priceRange[0], parseInt(e.target.value)])}
                    className="w-20 px-2 py-1 border border-gray-300 rounded text-sm"
                    placeholder="Max"
                  />
                </div>
                <p className="text-xs text-gray-600">₹{priceRange[0]} - ₹{priceRange[1]}</p>
              </div>

              {/* Rating filter */}
              <div className="border-t pt-6">
                <h3 className="font-bold text-gray-900 mb-3">Rating</h3>
                <div className="space-y-2">
                  {[4, 3, 2].map(stars => (
                    <label key={stars} className="flex items-center">
                      <input type="checkbox" className="mr-2" />
                      <span className="text-sm text-gray-700">⭐ {stars}+ stars</span>
                    </label>
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
                  className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                >
                  <option value="popular">Most Popular</option>
                  <option value="rating">Highest Rated</option>
                  <option value="priceLow">Price: Low to High</option>
                  <option value="priceHigh">Price: High to Low</option>
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
            ) : filteredProducts.length > 0 ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredProducts.map(product => (
                  <ProductCard key={product._id} product={product} />
                ))}
              </div>
            ) : (
              <div className="text-center py-12">
                <p className="text-gray-600 text-lg">No products found</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Category
