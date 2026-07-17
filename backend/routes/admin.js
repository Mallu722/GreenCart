import express from 'express'
import Product from '../models/Product.js'
import Order from '../models/Order.js'

const router = express.Router()

// Create product
router.post('/products', async (req, res) => {
  try {
    const { name, category, subCategory, price, discountPrice, description, stock, image, deliveryTime } = req.body
    
    const product = new Product({
      name,
      category,
      subCategory,
      price,
      discountPrice,
      description,
      stock,
      image,
      deliveryTime
    })
    
    await product.save()
    res.status(201).json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update product
router.put('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true }
    )
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    
    res.json({ success: true, data: product })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Delete product
router.delete('/products/:id', async (req, res) => {
  try {
    const product = await Product.findByIdAndDelete(req.params.id)
    
    if (!product) {
      return res.status(404).json({ success: false, error: 'Product not found' })
    }
    
    res.json({ success: true, message: 'Product deleted' })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get all orders
router.get('/orders', async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Update order status
router.patch('/orders/:id', async (req, res) => {
  try {
    const { orderStatus, paymentStatus } = req.body
    
    const order = await Order.findByIdAndUpdate(
      req.params.id,
      { orderStatus, paymentStatus, updatedAt: new Date() },
      { new: true }
    )
    
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }
    
    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
