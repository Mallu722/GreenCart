import express from 'express'
import Product from '../models/Product.js'

const router = express.Router()

// Get all products with advanced filtering
router.get('/', async (req, res) => {
  try {
    const { 
      category, 
      subCategory, 
      search, 
      sort = 'createdAt', 
      order = -1,
      limit = 20, 
      page = 1,
      minPrice,
      maxPrice,
      minRating
    } = req.query
    
    let query = {}
    
    // Category filter
    if (category && category !== 'all') {
      query.category = category
    }
    
    // Subcategory filter
    if (subCategory && subCategory !== 'all') {
      query.subCategory = subCategory
    }
    
    // Search filter - search in name and description
    if (search && search.trim()) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { description: { $regex: search, $options: 'i' } }
      ]
    }
    
    // Price range filter
    if (minPrice || maxPrice) {
      query.discountPrice = {}
      if (minPrice) query.discountPrice.$gte = parseInt(minPrice)
      if (maxPrice) query.discountPrice.$lte = parseInt(maxPrice)
    }
    
    // Rating filter
    if (minRating) {
      query.rating = { $gte: parseFloat(minRating) }
    }
    
    // Sorting
    const sortObj = {}
    let sortField = 'createdAt'
    let sortOrder = -1

    if (sort === 'price') {
      sortField = 'discountPrice'
      sortOrder = 1 // Low to high
    } else if (sort === 'priceDesc') {
      sortField = 'discountPrice'
      sortOrder = -1 // High to low
    } else if (sort === 'rating') {
      sortField = 'rating'
      sortOrder = -1 // Highest rated
    } else if (sort === 'popular') {
      sortField = 'reviews'
      sortOrder = -1 // Most popular
    }
    sortObj[sortField] = sortOrder
    
    let products = Product.find(query).sort(sortObj)
    
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

// Get bestsellers
router.get('/bestsellers', async (req, res) => {
  try {
    const bestsellers = await Product.find()
      .sort({ reviews: -1, rating: -1 })
      .limit(8)
    
    res.json({ success: true, data: bestsellers })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Search with suggestions
router.get('/search/suggestions', async (req, res) => {
  try {
    const { q } = req.query
    if (!q || q.length < 2) {
      return res.json({ success: true, data: [] })
    }
    
    const suggestions = await Product.find({
      name: { $regex: q, $options: 'i' }
    })
    .select('name category subCategory image')
    .limit(8)
    
    res.json({ success: true, data: suggestions })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get products by category with subcategories
router.get('/category/:category', async (req, res) => {
  try {
    const { category } = req.params
    const { subCategory } = req.query
    
    let query = { category }
    if (subCategory && subCategory !== 'all') {
      query.subCategory = subCategory
    }
    
    const products = await Product.find(query)
      .sort({ createdAt: -1 })
      .limit(20)
    
    const subcategories = await Product.distinct('subCategory', { category })
    
    res.json({
      success: true,
      data: products,
      subcategories: subcategories
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

// Get recommended/similar products
router.get('/:id/similar', async (req, res) => {
  try {
    const product = await Product.findById(req.params.id)
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    
    const similar = await Product.find({
      _id: { $ne: product._id },
      category: product.category,
      subCategory: product.subCategory
    })
    .limit(4)
    
    res.json({ success: true, data: similar })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
