import express from 'express'
import Order from '../models/Order.js'
import Product from '../models/Product.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Create order
router.post('/', protect, async (req, res) => {
  try {
    const { items, deliveryAddress, paymentMethod, deliverySlot, coupon } = req.body
    
    if (!items || items.length === 0) {
      return res.status(400).json({ success: false, error: 'No items in order' })
    }
    
    // Calculate totals
    let subtotal = 0
    for (const item of items) {
      const product = await Product.findById(item._id)
      if (!product) {
        return res.status(404).json({ success: false, error: 'Product not found' })
      }
      subtotal += (product.discountPrice || product.price) * item.quantity
    }
    
    const deliveryFee = subtotal >= 499 ? 0 : 40
    const handlingCharge = Math.ceil(subtotal * 0.02)
    const discount = coupon ? Math.round(subtotal * 0.1) : 0
    const total = subtotal + deliveryFee + handlingCharge - discount
    
    // Generate order ID
    const orderId = 'GC' + Date.now() + Math.random().toString(36).substr(2, 9).toUpperCase()
    
    // Estimated delivery
    const estimatedDelivery = new Date()
    estimatedDelivery.setMinutes(estimatedDelivery.getMinutes() + (deliverySlot === 'express' ? 45 : 120))
    
    const order = new Order({
      orderId,
      userId: req.userId,
      items,
      deliveryAddress,
      paymentMethod,
      deliverySlot,
      subtotal,
      deliveryFee,
      handlingCharge,
      discount,
      total,
      estimatedDelivery
    })
    
    await order.save()
    
    res.status(201).json({
      success: true,
      data: order
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get order history
router.get('/', protect, async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.userId }).sort({ createdAt: -1 })
    res.json({ success: true, data: orders })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get single order
router.get('/:id', protect, async (req, res) => {
  try {
    const order = await Order.findById(req.params.id)
    if (!order) {
      return res.status(404).json({ success: false, error: 'Order not found' })
    }
    res.json({ success: true, data: order })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
