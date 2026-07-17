import React, { createContext, useContext, useState, useEffect } from 'react'

const WishlistContext = createContext()

export const WishlistProvider = ({ children }) => {
  const [wishlist, setWishlist] = useState(() => {
    const saved = localStorage.getItem('wishlist')
    return saved ? JSON.parse(saved) : []
  })

  useEffect(() => {
    localStorage.setItem('wishlist', JSON.stringify(wishlist))
  }, [wishlist])

  const addToWishlist = (product) => {
    setWishlist(prevItems => {
      const exists = prevItems.find(item => item._id === product._id)
      if (exists) return prevItems
      return [...prevItems, product]
    })
  }

  const removeFromWishlist = (productId) => {
    setWishlist(prevItems => prevItems.filter(item => item._id !== productId))
  }

  const isInWishlist = (productId) => {
    return wishlist.some(item => item._id === productId)
  }

  const value = {
    wishlist,
    addToWishlist,
    removeFromWishlist,
    isInWishlist
  }

  return (
    <WishlistContext.Provider value={value}>{children}</WishlistContext.Provider>
  )
}

export const useWishlist = () => {
  const context = useContext(WishlistContext)
  if (!context) {
    throw new Error('useWishlist must be used within WishlistProvider')
  }
  return context
}
