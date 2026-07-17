import React from 'react'
import { Link } from 'react-router-dom'
import { useCart } from '../context/CartContext'
import { useWishlist } from '../context/WishlistContext'
import { formatPrice } from '../utils/formatters'
import { showToast } from '../utils/toast'

const ProductCard = ({ product }) => {
  const { addToCart } = useCart()
  const { isInWishlist, addToWishlist, removeFromWishlist } = useWishlist()
  const inWishlist = isInWishlist(product._id)

  const handleAddToCart = () => {
    addToCart(product)
    showToast(`${product.name} added to cart!`)
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

  const discountPercent = product.discountPrice 
    ? Math.round(((product.price - product.discountPrice) / product.price) * 100)
    : 0

  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-200">
      {/* Image container */}
      <Link to={`/product/${product._id}`}>
        <div className="relative h-48 bg-gray-200 overflow-hidden group">
          <img
            src={product.image || 'https://via.placeholder.com/300x300?text=Plant'}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
          />
          {discountPercent > 0 && (
            <div className="absolute top-2 right-2 bg-red-500 text-white px-2 py-1 rounded text-xs font-bold">
              {discountPercent}% OFF
            </div>
          )}
          <button
            onClick={(e) => {
              e.preventDefault()
              handleWishlist()
            }}
            className="absolute top-2 left-2 bg-white rounded-full p-2 shadow hover:shadow-md transition"
          >
            <span className={inWishlist ? 'text-red-500' : 'text-gray-400'}>
              {inWishlist ? '❤️' : '🤍'}
            </span>
          </button>
        </div>
      </Link>

      {/* Content */}
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="font-semibold text-gray-900 text-sm mb-1 line-clamp-2 hover:text-green-600">
            {product.name}
          </h3>
        </Link>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-2">
          <span className="text-yellow-400 text-sm">⭐ {product.rating || 4.5}</span>
          <span className="text-gray-500 text-xs">({product.reviews || 0})</span>
        </div>

        {/* Price */}
        <div className="flex items-baseline gap-2 mb-2">
          <span className="text-lg font-bold text-green-600">
            {formatPrice(product.discountPrice || product.price)}
          </span>
          {product.discountPrice && (
            <span className="text-sm text-gray-500 line-through">
              {formatPrice(product.price)}
            </span>
          )}
        </div>

        {/* Delivery info */}
        <p className="text-xs text-gray-500 mb-3">
          ⚡ Delivery in {product.deliveryTime || '45'} mins
        </p>

        {/* Stock indicator */}
        {product.stock <= 10 && product.stock > 0 && (
          <p className="text-xs text-orange-600 mb-2">
            Only {product.stock} left in stock!
          </p>
        )}

        {/* Add to cart button */}
        <button
          onClick={handleAddToCart}
          disabled={product.stock === 0}
          className={`w-full py-2 rounded-lg font-semibold transition text-sm ${
            product.stock === 0
              ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
              : 'bg-green-600 text-white hover:bg-green-700'
          }`}
        >
          {product.stock === 0 ? 'Out of Stock' : 'Add to Cart'}
        </button>
      </div>
    </div>
  )
}

export default ProductCard
