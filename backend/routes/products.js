import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, subCategory, search, sort, limit = 20, page = 1 } = req.query
    
    let query = {}
    
    if (category) query.category = category
    if (subCategory) query.subCategory = subCategory
    if (search) query.name = { $regex: search, $options: 'i' }
    
    let products = Product.find(query)
    
    // Sort
    if (sort === 'price-low') products = products.sort({ discountPrice: 1 })
    else if (sort === 'price-high') products = products.sort({ discountPrice: -1 })
    else if (sort === 'rating') products = products.sort({ rating: -1 })
    else products = products.sort({ createdAt: -1 })
    
    // Pagination
    const skip = (parseInt(page) - 1) * parseInt(limit)
    const total = await Product.countDocuments(query)
    
    products = await products.skip(skip).limit(parseInt(limit))
    
    res.json({
      success: true,
      data: products,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Search products
router.get('/search', async (req, res) => {
  try {
    const { q } = req.query
    const products = await Product.find({
      name: { $regex: q, $options: 'i' }
    }).limit(10)
    
    res.json({ success: true, data: products })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
