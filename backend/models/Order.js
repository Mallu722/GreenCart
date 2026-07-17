import mongoose from 'mongoose'

const orderSchema = new mongoose.Schema({
  orderId: {
    type: String,
    unique: true,
    required: true
  },
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User'
  },
  items: [{
    productId: mongoose.Schema.Types.ObjectId,
    name: String,
    price: Number,
    quantity: Number,
    image: String
  }],
  deliveryAddress: {
    firstName: String,
    lastName: String,
    phone: String,
    pincode: String,
    address: String,
    landmark: String,
    city: String,
    state: String
  },
  paymentMethod: {
    type: String,
    enum: ['cod', 'upi', 'card'],
    default: 'cod'
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'completed', 'failed'],
    default: 'pending'
  },
  orderStatus: {
    type: String,
    enum: ['placed', 'confirmed', 'packing', 'shipped', 'delivered', 'cancelled'],
    default: 'placed'
  },
  subtotal: Number,
  deliveryFee: Number,
  handlingCharge: Number,
  discount: {
    type: Number,
    default: 0
  },
  total: Number,
  deliverySlot: {
    type: String,
    enum: ['express', 'standard'],
    default: 'express'
  },
  estimatedDelivery: Date,
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
})

const Order = mongoose.model('Order', orderSchema)
export default Order
