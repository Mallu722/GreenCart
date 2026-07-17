import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
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

  // Mock products
  const mockBestSellers = [
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
      deliveryTime: '45',
      description: 'Low maintenance indoor plant'
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
      deliveryTime: '45',
      description: 'Perfect for air purification'
    },
    {
      _id: '3',
      name: 'Pothos Plant',
      category: 'plants',
      subCategory: 'indoor',
      price: 129,
      discountPrice: 79,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 312,
      deliveryTime: '45',
      description: 'Easy to grow, trailing vine'
    },
    {
      _id: '4',
      name: 'Spider Plant',
      category: 'plants',
      subCategory: 'indoor',
      price: 159,
      discountPrice: 109,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1450126613828-dc30d279aacc?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 156,
      deliveryTime: '45',
      description: 'Great for hanging baskets'
    }
  ]

  const mockNewArrivals = [
    {
      _id: '5',
      name: 'Tomato Seeds',
      category: 'seeds',
      subCategory: 'vegetable',
      price: 49,
      discountPrice: 39,
      stock: 100,
      image: 'https://images.unsplash.com/photo-1585551666519-0055eca6402d?w=300&h=300&fit=crop',
      rating: 4.5,
      reviews: 89,
      deliveryTime: '30',
      description: 'Premium hybrid tomato seeds'
    },
    {
      _id: '6',
      name: 'Sunflower Seeds',
      category: 'seeds',
      subCategory: 'flower',
      price: 59,
      discountPrice: 44,
      stock: 80,
      image: 'https://images.unsplash.com/photo-1599599810694-b5ac4dd64e1d?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 134,
      deliveryTime: '30',
      description: 'Bright yellow sunflower seeds'
    },
    {
      _id: '7',
      name: 'Aloe Vera Plant',
      category: 'plants',
      subCategory: 'decor',
      price: 179,
      discountPrice: 129,
      stock: 45,
      image: 'https://images.unsplash.com/photo-1576420344272-c6f05ad9e4b7?w=300&h=300&fit=crop',
      rating: 4.8,
      reviews: 201,
      deliveryTime: '45',
      description: 'Medicinal and decorative'
    },
    {
      _id: '8',
      name: 'Cucumber Seeds',
      category: 'seeds',
      subCategory: 'vegetable',
      price: 45,
      discountPrice: 29,
      stock: 120,
      image: 'https://images.unsplash.com/photo-1518917183309-9d19ee268e0d?w=300&h=300&fit=crop',
      rating: 4.4,
      reviews: 76,
      deliveryTime: '30',
      description: 'Fresh cucumber seeds'
    }
  ]

  useEffect(() => {
    // Simulate API call
    setTimeout(() => {
      setBestSellers(mockBestSellers)
      setNewArrivals(mockNewArrivals)
      setLoading(false)
    }, 500)
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
            { name: 'Tools & Pots', emoji: '🪴', link: '/category/tools' }
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
            <div className="flex gap-4 overflow-x-auto">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="w-48 h-64 bg-gray-300 rounded-lg animate-pulse"></div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {bestSellers.map(product => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* New Arrivals Section */}
      <div className="max-w-7xl mx-auto px-4 py-12">
        <h2 className="text-2xl font-bold text-gray-900 mb-6">✨ New Arrivals</h2>
        {loading ? (
          <div className="flex gap-4 overflow-x-auto">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="w-48 h-64 bg-gray-300 rounded-lg animate-pulse"></div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {newArrivals.map(product => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>
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
