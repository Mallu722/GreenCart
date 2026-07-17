import express from 'express'
import jwt from 'jsonwebtoken'
import User from '../models/User.js'
import { protect } from '../middleware/auth.js'

const router = express.Router()

// Register
router.post('/signup', async (req, res) => {
  try {
    const { name, email, password } = req.body
    
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, error: 'Missing required fields' })
    }
    
    // Check if user exists
    const existingUser = await User.findOne({ email })
    if (existingUser) {
      return res.status(400).json({ success: false, error: 'User already exists' })
    }
    
    // Create user
    const user = new User({ name, email, password })
    await user.save()
    
    // Create token
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    res.status(201).json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email }
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body
    
    if (!email || !password) {
      return res.status(400).json({ success: false, error: 'Email and password required' })
    }
    
    const user = await User.findOne({ email })
    if (!user) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    
    const isMatch = await user.comparePassword(password)
    if (!isMatch) {
      return res.status(401).json({ success: false, error: 'Invalid credentials' })
    }
    
    const token = jwt.sign(
      { userId: user._id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '7d' }
    )
    
    res.json({
      success: true,
      data: {
        token,
        user: { id: user._id, name: user.name, email: user.email }
      }
    })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

// Get profile
router.get('/profile', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password')
    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' })
    }
    res.json({ success: true, data: user })
  } catch (error) {
    res.status(500).json({ success: false, error: error.message })
  }
})

export default router
