import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { productAPI } from '../utils/api'
import ProductCard from '../components/ProductCard'
import { formatPrice } from '../utils/formatters'

const Home = () => {
  const [bannerIndex, setBannerIndex] = useState(0)
  const [bestSellers, setBestSellers] = useState([])
  const [newArrivals, setNewArrivals] = useState([])
  const [loading, setLoading] = useState(true)

  // Mock data for banners
  const banners = [
    {
      id: 1,
      title: 'Fresh Plants Delivered',
      subtitle: 'Get plants in 45 minutes',
      image: 'https://images.unsplash.com/photo-1518895949257-7621c3c786d7?w=1200&h=400&fit=crop',
      cta: 'Shop Now'
    },
    {
      id: 2,
      title: 'Start Your Garden',
      subtitle: 'Premium seeds collection',
      image: 'https://images.unsplash.com/photo-1466692476868-aef1dfb1e735?w=1200&h=400&fit=crop',
      cta: 'Explore'
    },
    {
      id: 3,
      title: 'Indoor Plant Care',
      subtitle: 'Best for home decoration',
      image: 'https://images.unsplash.com/photo-1502082553048-f007c77b6dba?w=1200&h=400&fit=crop',
      cta: 'Discover'
    }
  ]

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const [bestsellersRes, newArrivalsRes] = await Promise.all([
          productAPI.getBestsellers(),
          productAPI.getAllProducts({ sort: 'createdAt', limit: 8 })
        ])
        
        setBestSellers(bestsellersRes.data.data || [])
        setNewArrivals(newArrivalsRes.data.data || [])
      } catch (error) {
        console.error('Error fetching products:', error)
      } finally {
        setLoading(false)
      }
    }

    fetchData()
  }, [])

  useEffect(() => {
    const timer = setInterval(() => {
      setBannerIndex((prev) => (prev + 1) % banners.length)
    }, 5000)
    return () => clearInterval(timer)
  }, [])

  return (
    <div className="min-h-screen">
      {/* Carousel Banner */}
      <div className="relative h-80 bg-gray-800 overflow-hidden">
        {banners.map((banner, index) => (
          <div
            key={banner.id}
            className={`absolute inset-0 transition-opacity duration-1000 ${
              index === bannerIndex ? 'opacity-100' : 'opacity-0'
            }`}
          >
            <img
              src={banner.image}
              alt={banner.title}
              className="w-full h-full object-cover"
            />
            <div className="absolute inset-0 bg-black bg-opacity-40"></div>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-white">
              <h1 className="text-4xl md:text-5xl font-bold mb-2">{banner.title}</h1>
              <p className="text-lg md:text-xl mb-6">{banner.subtitle}</p>
              <button className="bg-green-600 hover:bg-green-700 text-white px-8 py-3 rounded-lg font-semibold transition">
                {banner.cta}
              </button>
            </div>
          </div>
        ))}

        {/* Carousel indicators */}
        <div className="absolute bottom-4 left-1/2 transform -translate-x-1/2 flex gap-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => setBannerIndex(index)}
              className={`w-2 h-2 rounded-full transition ${
                index === bannerIndex ? 'bg-white' : 'bg-gray-500'
              }`}
            ></button>
          ))}
        </div>
      </div>

      {/* Category Quick Access */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">Shop by Category</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'Indoor Plants', emoji: '🪴', link: '/category/plants?sub=indoor' },
            { name: 'Vegetable Plants', emoji: '🥬', link: '/category/plants?sub=vegetable' },
            { name: 'Fruit Plants', emoji: '🍓', link: '/category/plants?sub=fruit' },
            { name: 'Vegetable Seeds', emoji: '🌱', link: '/category/seeds?sub=vegetable' },
            { name: 'Fruit Seeds', emoji: '🍒', link: '/category/seeds?sub=fruit' },
            { name: 'Flower Seeds', emoji: '🌻', link: '/category/seeds?sub=flower' },
            { name: 'Decor Plants', emoji: '🌿', link: '/category/plants?sub=decor' },
            { name: 'All Plants', emoji: '🌾', link: '/category/plants' }
          ].map((cat, idx) => (
            <Link key={idx} to={cat.link}>
              <div className="bg-white rounded-lg p-6 text-center hover:shadow-lg transition cursor-pointer">
                <div className="text-4xl mb-2">{cat.emoji}</div>
                <p className="font-semibold text-gray-900 text-sm">{cat.name}</p>
              </div>
            </Link>
          ))}
        </div>
      </div>

      {/* Best Sellers Section */}
      <div className="bg-green-50 py-12">
        <div className="max-w-7xl mx-auto px-4">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">🔥 Best Sellers</h2>
          {loading ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : bestSellers.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellers.slice(0, 4).map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          ) : (
            <p className="text-gray-600">No products available</p>
          )}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ New Arrivals</h2>
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="h-64 bg-gray-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : newArrivals.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newArrivals.slice(0, 4).map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <p className="text-gray-600">No products available</p>
        )}
      </div>

      {/* Promo Banner */}
      <div className="bg-gradient-to-r from-green-600 to-green-700 text-white py-8 mt-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h3 className="text-2xl font-bold mb-2">Free Delivery on First Order!</h3>
          <p className="mb-4">Use code: WELCOME50 for 50% off</p>
          <button className="bg-white text-green-600 px-6 py-2 rounded-lg font-semibold hover:bg-gray-100 transition">
            Shop Now
          </button>
        </div>
      </div>
    </div>
  )
}

export default Home
