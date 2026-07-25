import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { adminAPI, productAPI } from '../../utils/api'
import { formatPrice, formatDate } from '../../utils/formatters'
import { showToast } from '../../utils/toast'

const AdminPanel = () => {
  const [tab, setTab] = useState('products')
  const [products, setProducts] = useState([])
  const [orders, setOrders] = useState([])
  const [loading, setLoading] = useState(true)
  const [selectedOrder, setSelectedOrder] = useState(null)

  const [formData, setFormData] = useState({
    name: '',
    category: 'plants',
    subCategory: 'indoor',
    price: '',
    discountPrice: '',
    stock: '',
    description: '',
    image: '',
    deliveryTime: '45'
  })

  // Fetch products and orders
  const fetchData = async () => {
    try {
      setLoading(true)
      const [prodRes, orderRes] = await Promise.all([
        productAPI.getAllProducts({ limit: 100 }),
        adminAPI.getOrders()
      ])
      setProducts(prodRes.data.data || [])
      setOrders(orderRes.data.data || [])
    } catch (error) {
      console.error('Error fetching admin data:', error)
      showToast('Failed to fetch data from server', 'error')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchData()
  }, [])

  // Auto-adjust subcategory option based on category choice
  useEffect(() => {
    if (formData.category === 'plants') {
      setFormData(prev => ({ ...prev, subCategory: 'indoor' }))
    } else if (formData.category === 'seeds') {
      setFormData(prev => ({ ...prev, subCategory: 'flower' }))
    } else if (formData.category === 'soil') {
      setFormData(prev => ({ ...prev, subCategory: 'potting' }))
    }
  }, [formData.category])

  const handleAddProduct = async (e) => {
    e.preventDefault()
    try {
      const priceNum = parseFloat(formData.price)
      const discountPriceNum = parseFloat(formData.discountPrice) || priceNum
      const stockNum = parseInt(formData.stock) || 0

      if (discountPriceNum > priceNum) {
        showToast('Discount price cannot be greater than regular price', 'error')
        return
      }

      const productData = {
        ...formData,
        price: priceNum,
        discountPrice: discountPriceNum,
        stock: stockNum
      }

      const response = await adminAPI.createProduct(productData)
      if (response.data.success) {
        showToast('Product added successfully!')
        setProducts([response.data.data, ...products])
        setFormData({
          name: '',
          category: 'plants',
          subCategory: 'indoor',
          price: '',
          discountPrice: '',
          stock: '',
          description: '',
          image: '',
          deliveryTime: '45'
        })
      }
    } catch (error) {
      console.error('Error adding product:', error)
      showToast(error.response?.data?.error || 'Failed to add product', 'error')
    }
  }

  const handleDeleteProduct = async (id) => {
    if (!window.confirm('Are you sure you want to delete this product?')) return
    try {
      const response = await adminAPI.deleteProduct(id)
      if (response.data.success) {
        showToast('Product deleted successfully')
        setProducts(products.filter(p => p._id !== id))
      }
    } catch (error) {
      console.error('Error deleting product:', error)
      showToast('Failed to delete product', 'error')
    }
  }

  const handleUpdateOrderStatus = async (orderId, newStatus) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, { orderStatus: newStatus })
      if (response.data.success) {
        showToast(`Order status updated to ${newStatus}`)
        // Update in list
        setOrders(orders.map(o => o._id === orderId ? { ...o, orderStatus: newStatus } : o))
        // Update selected order view
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, orderStatus: newStatus })
        }
      }
    } catch (error) {
      console.error('Error updating order status:', error)
      showToast('Failed to update status', 'error')
    }
  }

  const handleUpdatePaymentStatus = async (orderId, newPaymentStatus) => {
    try {
      const response = await adminAPI.updateOrderStatus(orderId, { paymentStatus: newPaymentStatus })
      if (response.data.success) {
        showToast(`Payment status updated to ${newPaymentStatus}`)
        setOrders(orders.map(o => o._id === orderId ? { ...o, paymentStatus: newPaymentStatus } : o))
        if (selectedOrder && selectedOrder._id === orderId) {
          setSelectedOrder({ ...selectedOrder, paymentStatus: newPaymentStatus })
        }
      }
    } catch (error) {
      console.error('Error updating payment status:', error)
      showToast('Failed to update payment status', 'error')
    }
  }

  // Calculate Sold Items Reports
  const calculateSalesReport = () => {
    const report = {}
    let totalRevenue = 0
    let totalItemsSoldCount = 0
    let completedOrders = 0

    orders.forEach(order => {
      // Exclude cancelled and failed orders from revenue calculations
      if (order.orderStatus !== 'cancelled') {
        totalRevenue += order.total || 0
        completedOrders += 1

        order.items.forEach(item => {
          const key = item.productId || item.name // fallback to name if productId missing
          if (!report[key]) {
            report[key] = {
              name: item.name,
              image: item.image,
              quantity: 0,
              revenue: 0,
              category: 'plants' // default fallback
            }
          }
          report[key].quantity += item.quantity
          report[key].revenue += item.price * item.quantity
          totalItemsSoldCount += item.quantity
        })
      }
    })

    // Map categories from products if available
    Object.keys(report).forEach(key => {
      const dbProd = products.find(p => p._id === key || p.name === report[key].name)
      if (dbProd) {
        report[key].category = dbProd.category
      }
    })

    const sortedItems = Object.values(report).sort((a, b) => b.quantity - a.quantity)

    return {
      itemsSold: sortedItems,
      totalRevenue,
      totalItemsSoldCount,
      totalOrdersCount: orders.length,
      activeOrdersCount: completedOrders
    }
  }

  const reportData = calculateSalesReport()

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-green-600"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Header */}
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-8">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Dashboard</h1>
            <p className="text-gray-500 text-sm mt-1">Manage GreenCart products, track live sales, and fulfill orders.</p>
          </div>
          <Link to="/" className="bg-white border border-gray-300 text-gray-700 px-4 py-2 rounded-lg font-semibold hover:bg-gray-50 transition shadow-sm">
            ← Back to Store
          </Link>
        </div>

        {/* Tabs */}
        <div className="flex gap-2 md:gap-4 mb-8 border-b border-gray-200 overflow-x-auto pb-px">
          <button
            onClick={() => setTab('products')}
            className={`px-4 py-2 font-semibold text-sm md:text-base transition whitespace-nowrap ${
              tab === 'products'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📦 Products ({products.length})
          </button>
          <button
            onClick={() => setTab('orders')}
            className={`px-4 py-2 font-semibold text-sm md:text-base transition whitespace-nowrap ${
              tab === 'orders'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📋 Orders ({orders.length})
          </button>
          <button
            onClick={() => setTab('reports')}
            className={`px-4 py-2 font-semibold text-sm md:text-base transition whitespace-nowrap ${
              tab === 'reports'
                ? 'text-green-600 border-b-2 border-green-600'
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            📊 Sales & Sold Items
          </button>
        </div>

        {/* Products Tab */}
        {tab === 'products' && (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Product List */}
            <div className="lg:col-span-2 order-2 lg:order-1">
              <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead className="bg-gray-50 border-b border-gray-200">
                      <tr>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Product</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Price (INR)</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Stock</th>
                        <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-200 text-sm">
                      {products.map(product => (
                        <tr key={product._id} className="hover:bg-gray-50/50">
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <img src={product.image || 'https://placehold.co/40'} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                              <div>
                                <p className="font-semibold text-gray-900">{product.name}</p>
                                <p className="text-gray-500 text-xs capitalize">{product.subCategory}</p>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-green-50 text-green-700 border border-green-100 capitalize">
                              {product.category}
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <div className="flex flex-col">
                              <span className="font-semibold text-gray-900">{formatPrice(product.discountPrice)}</span>
                              {product.price > product.discountPrice && (
                                <span className="text-gray-400 line-through text-xs">{formatPrice(product.price)}</span>
                              )}
                            </div>
                          </td>
                          <td className="px-6 py-4">
                            <span className={`font-semibold ${product.stock < 10 ? 'text-red-600' : 'text-gray-700'}`}>
                              {product.stock} units
                            </span>
                          </td>
                          <td className="px-6 py-4">
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
                              className="text-red-600 hover:text-red-700 font-semibold hover:underline"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            {/* Add Product Form */}
            <div className="lg:col-span-1 order-1 lg:order-2">
              <div className="bg-white rounded-xl p-6 shadow-sm border border-gray-200">
                <h2 className="text-lg font-bold text-gray-900 mb-4 pb-2 border-b">Add New Product</h2>
                <form onSubmit={handleAddProduct} className="space-y-4">
                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Name</label>
                    <input
                      type="text"
                      value={formData.name}
                      onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                      placeholder="Money Plant, Marigold Seeds, etc."
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Category</label>
                      <select
                        value={formData.category}
                        onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                      >
                        <option value="plants">Plants</option>
                        <option value="seeds">Seeds</option>
                        <option value="soil">Soil</option>
                      </select>
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Subcategory</label>
                      <select
                        value={formData.subCategory}
                        onChange={(e) => setFormData({ ...formData, subCategory: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                      >
                        {formData.category === 'plants' && (
                          <>
                            <option value="indoor">Indoor</option>
                            <option value="vegetable">Vegetable</option>
                            <option value="fruit">Fruit</option>
                            <option value="decor">Decor</option>
                          </>
                        )}
                        {formData.category === 'seeds' && (
                          <>
                            <option value="flower">Flower</option>
                            <option value="vegetable">Vegetable</option>
                            <option value="fruit">Fruit</option>
                          </>
                        )}
                        {formData.category === 'soil' && (
                          <>
                            <option value="potting">Potting Soil</option>
                            <option value="organic">Organic Compost</option>
                            <option value="fertilizer">Soil Fertilizer</option>
                          </>
                        )}
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="199"
                        value={formData.price}
                        onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Discount Price (₹)</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="149"
                        value={formData.discountPrice}
                        onChange={(e) => setFormData({ ...formData, discountPrice: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Stock</label>
                      <input
                        type="number"
                        min="0"
                        placeholder="50"
                        value={formData.stock}
                        onChange={(e) => setFormData({ ...formData, stock: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                        required
                      />
                    </div>

                    <div>
                      <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Delivery (mins)</label>
                      <input
                        type="text"
                        placeholder="45"
                        value={formData.deliveryTime}
                        onChange={(e) => setFormData({ ...formData, deliveryTime: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                        required
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Image URL</label>
                    <input
                      type="url"
                      placeholder="https://images.unsplash.com/..."
                      value={formData.image}
                      onChange={(e) => setFormData({ ...formData, image: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500"
                      required
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-bold text-gray-700 uppercase tracking-wider mb-1">Description</label>
                    <textarea
                      rows="3"
                      placeholder="Provide full description..."
                      value={formData.description}
                      onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                      className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:border-green-500 resize-none"
                    ></textarea>
                  </div>

                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2.5 rounded-lg font-semibold hover:bg-green-700 transition shadow-sm hover:shadow-md"
                  >
                    Add Product
                  </button>
                </form>
              </div>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {tab === 'orders' && (
          <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left border-collapse">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Order ID</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Customer</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Date</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-200 text-sm">
                  {orders.length > 0 ? (
                    orders.map(order => (
                      <tr key={order._id} className="hover:bg-gray-50/50">
                        <td className="px-6 py-4 font-semibold text-gray-900">{order.orderId || order._id}</td>
                        <td className="px-6 py-4">
                          <div>
                            <p className="font-semibold text-gray-900">
                              {order.deliveryAddress?.firstName} {order.deliveryAddress?.lastName}
                            </p>
                            <p className="text-gray-500 text-xs">{order.deliveryAddress?.phone}</p>
                          </div>
                        </td>
                        <td className="px-6 py-4 text-gray-600">{formatDate(order.createdAt)}</td>
                        <td className="px-6 py-4 font-bold text-gray-900">{formatPrice(order.total)}</td>
                        <td className="px-6 py-4">
                          <span className={`px-2.5 py-0.5 rounded-full text-xs font-semibold border ${
                            order.orderStatus === 'delivered'
                              ? 'bg-green-50 text-green-800 border-green-100'
                              : order.orderStatus === 'cancelled'
                              ? 'bg-red-50 text-red-800 border-red-100'
                              : 'bg-blue-50 text-blue-800 border-blue-100'
                          } capitalize`}>
                            {order.orderStatus}
                          </span>
                        </td>
                        <td className="px-6 py-4">
                          <button
                            onClick={() => setSelectedOrder(order)}
                            className="bg-green-50 text-green-700 border border-green-100 px-3 py-1.5 rounded-lg text-xs font-bold hover:bg-green-100 transition"
                          >
                            View & Manage
                          </button>
                        </td>
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6" className="text-center py-8 text-gray-500 font-semibold">No orders placed yet</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reports Tab */}
        {tab === 'reports' && (
          <div className="space-y-8">
            {/* Summary Metrics */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Sales Revenue</p>
                <p className="text-3xl font-extrabold text-green-600">{formatPrice(reportData.totalRevenue)}</p>
                <p className="text-gray-400 text-xs mt-1">Excludes cancelled orders</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Orders Placed</p>
                <p className="text-3xl font-extrabold text-gray-900">{reportData.totalOrdersCount}</p>
                <p className="text-gray-400 text-xs mt-1">Including all order statuses</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Active Sales Count</p>
                <p className="text-3xl font-extrabold text-blue-600">{reportData.activeOrdersCount}</p>
                <p className="text-gray-400 text-xs mt-1">Non-cancelled orders</p>
              </div>

              <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                <p className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Total Items Sold</p>
                <p className="text-3xl font-extrabold text-indigo-600">{reportData.totalItemsSoldCount} units</p>
                <p className="text-gray-400 text-xs mt-1">Volume of products delivered</p>
              </div>
            </div>

            {/* Aggregated Sold Items Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
              <div className="p-5 border-b border-gray-200">
                <h3 className="text-lg font-bold text-gray-900">Sold Items Sales Report</h3>
                <p className="text-gray-500 text-xs mt-1">Summary of items ordered and revenue generated (excluding cancelled orders).</p>
              </div>
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Item Details</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Category</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Quantity Sold</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Total Revenue</th>
                      <th className="px-6 py-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">Popularity Rate</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200 text-sm">
                    {reportData.itemsSold.length > 0 ? (
                      reportData.itemsSold.map((item, idx) => {
                        const totalSoldAcrossAll = reportData.totalItemsSoldCount || 1
                        const percentage = Math.round((item.quantity / totalSoldAcrossAll) * 100)
                        return (
                          <tr key={idx} className="hover:bg-gray-50/50">
                            <td className="px-6 py-4">
                              <div className="flex items-center gap-3">
                                <img src={item.image || 'https://placehold.co/40'} alt="" className="w-10 h-10 object-cover rounded-lg border" />
                                <span className="font-semibold text-gray-900">{item.name}</span>
                              </div>
                            </td>
                            <td className="px-6 py-4">
                              <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-gray-100 text-gray-700 capitalize">
                                {item.category}
                              </span>
                            </td>
                            <td className="px-6 py-4 font-semibold text-gray-700">{item.quantity} units</td>
                            <td className="px-6 py-4 font-bold text-green-600">{formatPrice(item.revenue)}</td>
                            <td className="px-6 py-4">
                              <div className="w-full bg-gray-100 rounded-full h-2 max-w-[120px]">
                                <div 
                                  className="bg-green-600 h-2 rounded-full" 
                                  style={{ width: `${percentage}%` }}
                                ></div>
                              </div>
                              <span className="text-[10px] text-gray-400 mt-1 block">{percentage}% of all sales</span>
                            </td>
                          </tr>
                        )
                      })
                    ) : (
                      <tr>
                        <td colSpan="5" className="text-center py-12 text-gray-500 font-semibold">No items have been sold yet</td>
                      </tr>
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Order Details & Management Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="bg-white rounded-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto shadow-2xl border border-gray-100 flex flex-col">
            {/* Modal Header */}
            <div className="p-6 border-b border-gray-200 flex justify-between items-center bg-gray-50 rounded-t-xl">
              <div>
                <h3 className="text-xl font-bold text-gray-900">Order Management</h3>
                <p className="text-gray-500 text-xs mt-0.5">ID: {selectedOrder.orderId || selectedOrder._id}</p>
              </div>
              <button
                onClick={() => setSelectedOrder(null)}
                className="text-gray-400 hover:text-gray-600 text-xl font-bold p-1 hover:bg-gray-200/50 rounded-lg transition"
              >
                ✕
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6 space-y-6 flex-grow">
              {/* Order Status Controller */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 bg-green-50/50 border border-green-100/70 p-4 rounded-xl">
                <div>
                  <label className="block text-xs font-bold text-green-800 uppercase tracking-wider mb-1.5">Update Order Status</label>
                  <select
                    value={selectedOrder.orderStatus}
                    onChange={(e) => handleUpdateOrderStatus(selectedOrder._id, e.target.value)}
                    className="w-full bg-white px-3 py-1.5 border border-green-300 rounded-lg text-sm text-green-900 focus:outline-none"
                  >
                    <option value="placed">Placed</option>
                    <option value="confirmed">Confirmed</option>
                    <option value="packing">Packing</option>
                    <option value="shipped">Shipped</option>
                    <option value="delivered">Delivered</option>
                    <option value="cancelled">Cancelled</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-green-800 uppercase tracking-wider mb-1.5">Update Payment Status</label>
                  <select
                    value={selectedOrder.paymentStatus || 'pending'}
                    onChange={(e) => handleUpdatePaymentStatus(selectedOrder._id, e.target.value)}
                    className="w-full bg-white px-3 py-1.5 border border-green-300 rounded-lg text-sm text-green-900 focus:outline-none"
                  >
                    <option value="pending">Pending</option>
                    <option value="completed">Completed</option>
                    <option value="failed">Failed</option>
                  </select>
                </div>
              </div>

              {/* Customer & Address Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm border-b pb-1 text-green-700">Delivery Address</h4>
                  <div className="text-gray-700 text-xs space-y-1">
                    <p className="font-bold text-gray-900 text-sm">
                      {selectedOrder.deliveryAddress?.firstName} {selectedOrder.deliveryAddress?.lastName}
                    </p>
                    <p>{selectedOrder.deliveryAddress?.address}</p>
                    {selectedOrder.deliveryAddress?.landmark && <p>Landmark: {selectedOrder.deliveryAddress.landmark}</p>}
                    <p>{selectedOrder.deliveryAddress?.city}, {selectedOrder.deliveryAddress?.state} - {selectedOrder.deliveryAddress?.pincode}</p>
                    <p className="mt-2 font-bold text-gray-900">Phone: {selectedOrder.deliveryAddress?.phone}</p>
                  </div>
                </div>

                <div>
                  <h4 className="font-bold text-gray-900 mb-2 text-sm border-b pb-1 text-green-700">Order Information</h4>
                  <div className="text-gray-700 text-xs space-y-1">
                    <p><strong>Order Date:</strong> {formatDate(selectedOrder.createdAt)}</p>
                    <p><strong>Payment Method:</strong> {selectedOrder.paymentMethod?.toUpperCase() || 'COD'}</p>
                    <p><strong>Delivery Slot:</strong> <span className="capitalize">{selectedOrder.deliverySlot || 'express'}</span></p>
                    <p className="text-green-600 font-semibold mt-2">
                      Estimated Delivery Slot: {selectedOrder.deliverySlot === 'express' ? '45 mins' : 'Standard Delivery'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Items Purchased */}
              <div>
                <h4 className="font-bold text-gray-900 mb-3 text-sm border-b pb-1 text-green-700">Items Purchased</h4>
                <div className="border border-gray-200 rounded-lg overflow-hidden divide-y divide-gray-100 max-h-[220px] overflow-y-auto">
                  {selectedOrder.items.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center p-3 text-xs">
                      <div className="flex items-center gap-3">
                        <img src={item.image || 'https://placehold.co/40'} alt="" className="w-10 h-10 object-cover rounded border" />
                        <div>
                          <p className="font-bold text-gray-900 text-sm">{item.name}</p>
                          <p className="text-gray-500">{formatPrice(item.price)} each</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-semibold text-gray-800">Qty: {item.quantity}</p>
                        <p className="font-bold text-gray-900 text-sm mt-0.5">{formatPrice(item.price * item.quantity)}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Bill Details */}
              <div className="bg-gray-50 p-4 rounded-xl border border-gray-200 flex flex-col gap-1.5 text-xs">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>{formatPrice(selectedOrder.subtotal || (selectedOrder.total - (selectedOrder.deliveryFee || 40)))}</span>
                </div>
                {selectedOrder.discount > 0 && (
                  <div className="flex justify-between text-red-600 font-semibold">
                    <span>Coupon Discount</span>
                    <span>-{formatPrice(selectedOrder.discount)}</span>
                  </div>
                )}
                <div className="flex justify-between text-gray-600">
                  <span>Delivery Fee</span>
                  <span>{formatPrice(selectedOrder.deliveryFee || 0)}</span>
                </div>
                <div className="flex justify-between text-gray-600 border-b pb-2">
                  <span>Handling & Taxes</span>
                  <span>{formatPrice(selectedOrder.handlingCharge || 0)}</span>
                </div>
                <div className="flex justify-between text-base font-extrabold text-gray-900 pt-1">
                  <span>Total Bill Amount</span>
                  <span className="text-green-600">{formatPrice(selectedOrder.total)}</span>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-gray-50 border-t border-gray-200 flex justify-end rounded-b-xl">
              <button
                onClick={() => setSelectedOrder(null)}
                className="bg-gray-900 text-white px-5 py-2 rounded-lg font-semibold hover:bg-gray-800 transition text-sm shadow"
              >
                Close View
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminPanel
