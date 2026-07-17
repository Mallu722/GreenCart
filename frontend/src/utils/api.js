import axios from 'axios'

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json'
  }
})

// Add token to requests if it exists
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

export const productAPI = {
  getAllProducts: (filters = {}) => {
    const params = new URLSearchParams()
    if (filters.category) params.append('category', filters.category)
    if (filters.subCategory) params.append('subCategory', filters.subCategory)
    if (filters.search) params.append('search', filters.search)
    if (filters.sort) params.append('sort', filters.sort)
    if (filters.minPrice) params.append('minPrice', filters.minPrice)
    if (filters.maxPrice) params.append('maxPrice', filters.maxPrice)
    if (filters.minRating) params.append('minRating', filters.minRating)
    if (filters.page) params.append('page', filters.page)
    if (filters.limit) params.append('limit', filters.limit)
    
    return api.get(`/products?${params.toString()}`)
  },
  
  getProductById: (id) => api.get(`/products/${id}`),
  
  getProductsByCategory: (category, subCategory = null) => {
    let url = `/products/category/${category}`
    if (subCategory) url += `?subCategory=${subCategory}`
    return api.get(url)
  },
  
  searchProducts: (query) => api.get('/products', {
    params: { search: query }
  }),
  
  getSearchSuggestions: (query) => api.get('/products/search/suggestions', {
    params: { q: query }
  }),
  
  getSimilarProducts: (productId) => api.get(`/products/${productId}/similar`),
  
  getBestsellers: () => api.get('/products/bestsellers')
}

export const authAPI = {
  login: (email, password) => api.post('/auth/login', { email, password }),
  signup: (name, email, password) => api.post('/auth/signup', { name, email, password }),
  getProfile: () => api.get('/auth/profile'),
  logout: () => {
    localStorage.removeItem('token')
  }
}

export const orderAPI = {
  createOrder: (orderData) => api.post('/orders', orderData),
  getOrderHistory: () => api.get('/orders'),
  getOrderById: (id) => api.get(`/orders/${id}`)
}

export const adminAPI = {
  createProduct: (productData) => api.post('/admin/products', productData),
  updateProduct: (id, productData) => api.put(`/admin/products/${id}`, productData),
  deleteProduct: (id) => api.delete(`/admin/products/${id}`),
  getOrders: () => api.get('/admin/orders')
}

export default api
