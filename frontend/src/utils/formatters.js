export const formatPrice = (price) => {
  return '₹' + price.toLocaleString('en-IN')
}

export const calculateDeliveryFee = (total) => {
  return total >= 499 ? 0 : 40
}

export const formatDate = (date) => {
  return new Date(date).toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'short',
    year: 'numeric'
  })
}

export const generateOrderId = () => {
  return 'GC' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
}
