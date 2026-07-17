import React, { useState } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice } from '../utils/formatters'
import { showToast } from '../utils/toast'
import ProductCard from '../components/ProductCard'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  // Mock product
  const product = {
    _id: id,
    name: 'Money Plant (Pothos)',
    category: 'plants',
    subCategory: 'indoor',
    price: 149,
    discountPrice: 99,
    stock: 50,
    image: 'https://images.unsplash.com/photo-1509909756405-dfc993d674d4?w=500&h=500&fit=crop',
    images: [
      'https://images.unsplash.com/photo-1509909756405-dfc993d674d4?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=500&h=500&fit=crop',
      'https://images.unsplash.com/photo-1450126613828-dc30d279aacc?w=500&h=500&fit=crop'
    ],
    rating: 4.8,
    reviews: 245,
    deliveryTime: '45',
    description: 'Money Plant is one of the best air-purifying plants that is low-maintenance and suitable for indoor spaces. It has heart-shaped leaves and vines that look beautiful in any corner of your home.',
    careInstructions: [
      'Light: Bright, indirect light is ideal',
      'Water: Keep soil moist but not waterlogged',
      'Temperature: 18-25°C',
      'Humidity: 50-60% is perfect',
      'Fertilizer: Monthly during growing season',
      'Pruning: Trim regularly to maintain shape'
    ],
    features: [
      'Low maintenance plant',
      'Perfect for air purification',
      'Ideal for hanging baskets',
      'Non-toxic for pets',
      'Can tolerate low light',
      'Fast growing'
    ]
  }

  const inWishlist = isInWishlist(product._id)

  const handleAddToCart = () => {
    addToCart(product, quantity)
    showToast(`${product.name} added to cart!`)
  }

  const handleBuyNow = () => {
    addToCart(product, quantity)
    navigate('/checkout')
  }

  const handleWishlist = () => {
    if (inWishlist) {
      removeFromWishlist(product._id)
      showToast('Removed from wishlist')
    } else {
      addToWishlist(product)
      showToast('Added to wishlist!')
    }
  }

  const relatedProducts = [
    {
      _id: '2',
      name: 'Pothos Plant',
      category: 'plants',
      subCategory: 'indoor',
      price: 129,
      discountPrice: 79,
      stock: 60,
      image: 'https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=300&h=300&fit=crop',
      rating: 4.9,
      reviews: 312,
      deliveryTime: '45'
    },
    {
      _id: '3',
      name: 'Philodendron',
      category: 'plants',
      subCategory: 'indoor',
      price: 169,
      discountPrice: 119,
      stock: 40,
      image: 'https://images.unsplash.com/photo-1450126613828-dc30d279aacc?w=300&h=300&fit=crop',
      rating: 4.7,
      reviews: 198,
      deliveryTime: '45'
    },
    {
      _id: '4',
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
      _id: '5',
      name: 'Spider Plant',
      category: 'plants',
      subCategory: 'indoor',
      price: 159,
      discountPrice: 109,
      stock: 25,
      image: 'https://images.unsplash.com/photo-1450126613828-dc30d279aacc?w=300&h=300&fit=crop',
      rating: 4.6,
      reviews: 156,
      deliveryTime: '45'
    }
  ]

  const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100)

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto text-sm text-gray-600">
          <button onClick={() => navigate(-1)} className="hover:text-green-600">← Back</button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="bg-gray-200 rounded-lg overflow-hidden mb-4">
              <img
                src={product.images[selectedImage]}
                alt={product.name}
                className="w-full h-96 object-cover"
              />
            </div>
            <div className="flex gap-2">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 ${
                    idx === selectedImage ? 'border-green-600' : 'border-gray-300'
                  }`}
                >
                  <img src={img} alt="" className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          </div>

          {/* Details */}
          <div>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">{product.name}</h1>

            {/* Rating */}
            <div className="flex items-center gap-2 mb-4">
              <span className="text-yellow-400">⭐ {product.rating}</span>
              <span className="text-gray-600">({product.reviews} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(product.discountPrice)}
              </span>
              <span className="text-xl text-gray-500 line-through">
                {formatPrice(product.price)}
              </span>
              <span className="bg-red-500 text-white px-2 py-1 rounded text-sm font-bold">
                {discountPercent}% OFF
              </span>
            </div>

            {/* Delivery */}
            <p className="text-sm text-gray-600 mb-6">
              ⚡ Delivery in {product.deliveryTime} mins | Free above ₹499
            </p>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-sm text-green-600 font-semibold">✓ In Stock ({product.stock} available)</p>
              ) : (
                <p className="text-sm text-red-600 font-semibold">Out of Stock</p>
              )}
            </div>

            {/* Quantity Selector */}
            <div className="flex items-center gap-4 mb-6">
              <span className="text-sm font-semibold text-gray-700">Quantity:</span>
              <div className="flex items-center border border-gray-300 rounded-lg">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
                >
                  −
                </button>
                <span className="px-4 py-2 text-lg font-semibold">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="px-3 py-2 text-lg text-gray-600 hover:bg-gray-100"
                >
                  +
                </button>
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition disabled:opacity-50"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="w-full py-2 text-center border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              {inWishlist ? '❤️' : '🤍'} {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded-lg mt-6 text-sm text-blue-700">
              ℹ️ Free delivery on orders above ₹499
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2">
            {/* Description */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">About This Product</h2>
              <p className="text-gray-700 leading-relaxed">{product.description}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6 mb-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Features</h2>
              <ul className="space-y-2">
                {product.features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Care Instructions */}
            <div className="bg-white rounded-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-4">Care Instructions</h2>
              <ul className="space-y-2">
                {product.careInstructions.map((instruction, idx) => (
                  <li key={idx} className="text-gray-700">
                    <span className="font-semibold text-green-600">{instruction.split(':')[0]}:</span>
                    <span>{instruction.split(':')[1]}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-lg p-6 h-fit sticky top-24">
            <h3 className="font-bold text-gray-900 mb-4">Delivery & Returns</h3>
            <div className="space-y-3 text-sm text-gray-700">
              <div>
                <p className="font-semibold text-gray-900">🚚 Express Delivery</p>
                <p className="text-gray-600">Next 45 minutes</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">🔄 Returns</p>
                <p className="text-gray-600">7-day return policy</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">✓ Genuine Product</p>
                <p className="text-gray-600">Authentic, verified plants</p>
              </div>
              <div>
                <p className="font-semibold text-gray-900">💬 Customer Support</p>
                <p className="text-gray-600">Available 24/7</p>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        <div>
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Similar Products</h2>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {relatedProducts.map(prod => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      </div>
    </div>
  )
}

export default ProductDetail
