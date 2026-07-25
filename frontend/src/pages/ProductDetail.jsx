import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice } from '../utils/formatters'
import { showToast } from '../utils/toast'
import ProductCard from '../components/ProductCard'
import { productAPI } from '../utils/api'

const ProductDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  
  const [product, setProduct] = useState(null)
  const [relatedProducts, setRelatedProducts] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [quantity, setQuantity] = useState(1)
  const [selectedImage, setSelectedImage] = useState(0)

  useEffect(() => {
    const fetchProductDetails = async () => {
      try {
        setLoading(true)
        setError(null)
        
        const [prodRes, similarRes] = await Promise.all([
          productAPI.getProductById(id),
          productAPI.getSimilarProducts(id)
        ])
        
        setProduct(prodRes.data.data)
        setRelatedProducts(similarRes.data.data || [])
        setSelectedImage(0)
        setQuantity(1)
      } catch (err) {
        console.error('Error fetching product details:', err)
        setError('Failed to load product details. Please try again.')
      } finally {
        setLoading(false)
      }
    }

    fetchProductDetails()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  if (error || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 p-4">
        <p className="text-red-600 text-lg font-semibold mb-4">{error || 'Product not found'}</p>
        <button 
          onClick={() => navigate('/')} 
          className="bg-green-600 text-white px-6 py-2 rounded-lg font-semibold hover:bg-green-700 transition"
        >
          Back to Store
        </button>
      </div>
    )
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

  const discountPercent = Math.round(((product.price - product.discountPrice) / product.price) * 100)
  
  // Safe fallbacks for images, care instructions, and features
  const images = (product.images && product.images.length > 0) 
    ? product.images 
    : [product.image || 'https://images.unsplash.com/photo-1509909756405-dfc993d674d4?w=500&h=500&fit=crop']

  const careInstructionsArray = Array.isArray(product.careInstructions)
    ? product.careInstructions
    : product.careInstructions && typeof product.careInstructions === 'string'
      ? product.careInstructions.split('|').map(s => s.trim())
      : ['Care: Place in bright indirect sunlight.', 'Water: Water only when the topsoil feels dry.']

  const features = product.features || [
    'Premium quality product curated for home gardens',
    'Provides excellent vitality and health benefits',
    'Low-maintenance, suitable for busy plant parents',
    'Carefully package-shipped to avoid any damage',
    'Fast delivery under 45 minutes to your doorstep'
  ]

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Breadcrumb */}
      <div className="bg-white border-b border-gray-200 px-4 py-3">
        <div className="max-w-7xl mx-auto text-sm text-gray-600 flex justify-between items-center">
          <button onClick={() => navigate(-1)} className="hover:text-green-600 flex items-center gap-1">
            <span>←</span> Back
          </button>
          <span className="capitalize">{product.category} &gt; {product.subCategory}</span>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Images */}
          <div>
            <div className="bg-white rounded-lg overflow-hidden border border-gray-200 shadow-sm mb-4">
              <img
                src={images[selectedImage]}
                alt={product.name}
                className="w-full h-[400px] object-cover"
              />
            </div>
            <div className="flex gap-2 overflow-x-auto py-1">
              {images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setSelectedImage(idx)}
                  className={`w-16 h-16 rounded-lg overflow-hidden border-2 flex-shrink-0 transition ${
                    idx === selectedImage ? 'border-green-600 shadow-md' : 'border-gray-200 hover:border-green-400'
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
              <span className="text-yellow-400 font-bold">⭐ {product.rating || '4.5'}</span>
              <span className="text-gray-600 text-sm">({product.reviews || '10'} reviews)</span>
            </div>

            {/* Price */}
            <div className="flex items-baseline gap-3 mb-4">
              <span className="text-3xl font-bold text-green-600">
                {formatPrice(product.discountPrice)}
              </span>
              {product.price > product.discountPrice && (
                <>
                  <span className="text-xl text-gray-500 line-through">
                    {formatPrice(product.price)}
                  </span>
                  <span className="bg-red-500 text-white px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider animate-pulse">
                    {discountPercent}% OFF
                  </span>
                </>
              )}
            </div>

            {/* Delivery */}
            <p className="text-sm text-gray-600 mb-6 flex items-center gap-1.5">
              <span>⚡</span> Delivery in <strong className="text-green-600">{product.deliveryTime || '45'} mins</strong> | Free above ₹499
            </p>

            {/* Stock */}
            <div className="mb-6">
              {product.stock > 0 ? (
                <p className="text-sm text-green-600 font-semibold flex items-center gap-1">
                  <span className="text-lg">✓</span> In Stock ({product.stock} available)
                </p>
              ) : (
                <p className="text-sm text-red-600 font-semibold flex items-center gap-1">
                  <span className="text-lg">✗</span> Out of Stock
                </p>
              )}
            </div>

            {/* Quantity Selector */}
            {product.stock > 0 && (
              <div className="flex items-center gap-4 mb-6">
                <span className="text-sm font-semibold text-gray-700">Quantity:</span>
                <div className="flex items-center border border-gray-300 rounded-lg bg-white shadow-sm">
                  <button
                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                    className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-100 transition rounded-l-lg"
                  >
                    −
                  </button>
                  <span className="px-4 py-1.5 text-lg font-semibold min-w-[40px] text-center">{quantity}</span>
                  <button
                    onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                    className="px-3 py-1.5 text-lg text-gray-600 hover:bg-gray-100 transition rounded-r-lg"
                  >
                    +
                  </button>
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="grid grid-cols-2 gap-3 mb-6">
              <button
                onClick={handleAddToCart}
                disabled={product.stock === 0}
                className="bg-green-600 text-white py-3 rounded-lg font-semibold hover:bg-green-700 transition disabled:bg-gray-400 disabled:cursor-not-allowed shadow-md hover:shadow-lg"
              >
                Add to Cart
              </button>
              <button
                onClick={handleBuyNow}
                disabled={product.stock === 0}
                className="border-2 border-green-600 text-green-600 py-3 rounded-lg font-semibold hover:bg-green-50 transition disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Buy Now
              </button>
            </div>

            {/* Wishlist */}
            <button
              onClick={handleWishlist}
              className="w-full py-2 text-center border border-gray-300 rounded-lg font-semibold text-gray-700 hover:bg-gray-50 transition flex items-center justify-center gap-2"
            >
              <span className="text-lg">{inWishlist ? '❤️' : '🤍'}</span> {inWishlist ? 'Remove from Wishlist' : 'Add to Wishlist'}
            </button>

            {/* Info */}
            <div className="bg-blue-50 p-4 rounded-lg mt-6 text-sm text-blue-700 flex items-center gap-2 border border-blue-100">
              <span>ℹ️</span> Free delivery on orders above ₹499
            </div>
          </div>
        </div>

        {/* Tabs */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
          <div className="lg:col-span-2 space-y-6">
            {/* Description */}
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">About This Product</h2>
              <p className="text-gray-700 leading-relaxed text-sm md:text-base">{product.description || 'No description available for this product.'}</p>
            </div>

            {/* Features */}
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Key Highlights</h2>
              <ul className="space-y-2.5">
                {features.map((feature, idx) => (
                  <li key={idx} className="flex items-start gap-3 text-gray-700 text-sm md:text-base">
                    <span className="text-green-600 mt-1">✓</span>
                    <span>{feature}</span>
                  </li>
                ))}
              </ul>
            </div>

            {/* Care Instructions */}
            <div className="bg-white rounded-lg p-6 border border-gray-100 shadow-sm">
              <h2 className="text-xl font-bold text-gray-900 mb-4 border-b pb-2">Care & Instructions</h2>
              <ul className="space-y-3">
                {careInstructionsArray.map((instruction, idx) => {
                  const parts = instruction.split(':')
                  return (
                    <li key={idx} className="text-gray-700 text-sm md:text-base">
                      {parts.length > 1 ? (
                        <>
                          <strong className="text-green-700 font-semibold">{parts[0].trim()}:</strong>
                          <span>{parts.slice(1).join(':').trim()}</span>
                        </>
                      ) : (
                        <span>{instruction}</span>
                      )}
                    </li>
                  )
                })}
              </ul>
            </div>
          </div>

          {/* Sidebar */}
          <div className="bg-white rounded-lg p-6 h-fit sticky top-24 border border-gray-100 shadow-sm">
            <h3 className="font-bold text-gray-900 mb-4 border-b pb-2 text-lg">Delivery & Returns</h3>
            <div className="space-y-4 text-sm text-gray-700">
              <div className="flex items-start gap-3">
                <span className="text-lg">🚚</span>
                <div>
                  <p className="font-semibold text-gray-900">Express Delivery</p>
                  <p className="text-gray-500 text-xs mt-0.5">Delivered in 45 minutes to your doorstep</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t pt-3">
                <span className="text-lg">🔄</span>
                <div>
                  <p className="font-semibold text-gray-900">7-Day Returns</p>
                  <p className="text-gray-500 text-xs mt-0.5">Easy returns if not satisfied with plant freshness</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t pt-3">
                <span className="text-lg">🛡️</span>
                <div>
                  <p className="font-semibold text-gray-900">Genuine & Healthy</p>
                  <p className="text-gray-500 text-xs mt-0.5">Directly sourced from trusted nursery growers</p>
                </div>
              </div>
              <div className="flex items-start gap-3 border-t pt-3">
                <span className="text-lg">💬</span>
                <div>
                  <p className="font-semibold text-gray-900">24/7 Expert Support</p>
                  <p className="text-gray-500 text-xs mt-0.5">Free horticultural consultations post-purchase</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <div>
            <h2 className="text-2xl font-bold text-gray-900 mb-6 font-semibold">Similar Products You May Like</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              {relatedProducts.map(prod => (
                <ProductCard key={prod._id} product={prod} />
              ))}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}

export default ProductDetail
