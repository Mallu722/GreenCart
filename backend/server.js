import express from 'express'
import mongoose from 'mongoose'
import cors from 'cors'
import dotenv from 'dotenv'
import productRoutes from './routes/products.js'
import authRoutes from './routes/auth.js'
import orderRoutes from './routes/orders.js'
import adminRoutes from './routes/admin.js'
import { seedDatabase } from './seeds.js'

dotenv.config()

const app = express()

// Middleware
app.use(cors({
  origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
  credentials: true
}))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// Database Connection
mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/greencart')
  .then(() => {
    console.log('MongoDB connected')
    seedDatabase() // Dynamically seed if DB is empty
  })
  .catch(err => console.error('MongoDB connection error:', err))

// Routes
app.use('/api/products', productRoutes)
app.use('/api/auth', authRoutes)
app.use('/api/orders', orderRoutes)
app.use('/api/admin', adminRoutes)

// Health check
app.get('/api/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() })
})

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' })
})

// Error handler
app.use((err, req, res, next) => {
  console.error(err.stack)
  res.status(500).json({ error: 'Internal server error' })
})

const PORT = process.env.PORT || 5000
app.listen(PORT, () => {
  console.log(`GreenCart backend running on port ${PORT}`)
})
