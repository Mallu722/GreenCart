# GreenCart - Quick Reference Guide

## 🚀 One-Command Start

### Windows
```bash
start.bat
```

### Mac/Linux
```bash
bash start.sh
```

Or manually:
```bash
# Terminal 1
cd backend && npm run dev

# Terminal 2  
cd frontend && npm run dev
```

---

## 📍 URLs

| Service | URL |
|---------|-----|
| Frontend | http://localhost:5173 |
| Backend API | http://localhost:5000 |
| API Health | http://localhost:5000/api/health |
| Home | http://localhost:5173/ |
| Admin | http://localhost:5173/admin |
| Profile | http://localhost:5173/profile |

---

## 🔑 Demo Credentials

```
Email: demo@greencart.com
Password: demo123
```

---

## 💾 Coupon Code

```
Code: WELCOME50
Discount: 10% off
Usage: Shown in order summary
```

---

## 📁 Important Files

### Frontend Key Files
- `src/App.jsx` - Router setup, main layout
- `src/components/Header.jsx` - Navigation, cart badge
- `src/context/CartContext.jsx` - Cart state management
- `src/pages/Home.jsx` - Home page with carousel
- `src/utils/api.js` - API calls setup

### Backend Key Files
- `server.js` - Express app initialization
- `models/Product.js` - Product schema
- `routes/products.js` - Product endpoints
- `middleware/auth.js` - JWT verification
- `.env` - Environment variables

---

## 🛠️ Common Tasks

### Change Delivery Fee
**File**: `frontend/src/utils/formatters.js`
```javascript
export const calculateDeliveryFee = (total) => {
  return total >= 499 ? 0 : 40  // Edit threshold or amount
}
```

### Change Colors
**File**: `frontend/tailwind.config.js`
```javascript
colors: {
  green: {
    600: '#16a34a',  // Change these values
    700: '#15803d'
  }
}
```

### Add New Product Category
**File**: `backend/models/Product.js`
```javascript
subCategory: {
  enum: ['indoor', 'vegetable', 'fruit', 'decor', 'flower', 'new-category']
}
```

### Update API Base URL
**File**: `frontend/src/utils/api.js`
```javascript
const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api'
```

### Change Banner Rotation Speed
**File**: `frontend/src/pages/Home.jsx`
```javascript
setInterval(() => {
  setBannerIndex((prev) => (prev + 1) % banners.length)
}, 5000)  // Change 5000 to desired milliseconds
```

---

## 🐛 Troubleshooting

### MongoDB Connection Failed
```
Error: connect ECONNREFUSED 127.0.0.1:27017

Solution:
1. Ensure MongoDB is running: mongod
2. Check connection string in .env
3. If using Atlas, verify IP whitelist
```

### Port Already in Use
```
Error: listen EADDRINUSE :::5000

Solution:
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Mac/Linux
lsof -i :5000
kill -9 [PID]
```

### Module Not Found
```
Error: Cannot find module 'react'

Solution:
cd frontend
rm -rf node_modules
npm install
```

### API Not Responding
```
Error: Cannot GET /api/products

Solution:
1. Check backend is running on port 5000
2. Verify MongoDB connection
3. Check .env file configuration
```

### CORS Error
```
Error: Access to XMLHttpRequest blocked by CORS

Solution:
Update backend .env:
CORS_ORIGIN=http://localhost:5173

Restart backend server
```

### Images Not Loading
```
Solution:
- Use full HTTPS URLs for images
- Format: https://images.unsplash.com/...
- Or upload to your own server
```

---

## 📊 API Quick Reference

### GET Requests
```javascript
// Get all products
GET /api/products

// Get single product
GET /api/products/:id

// Get user profile (needs token)
GET /api/auth/profile

// Get user orders (needs token)
GET /api/orders
```

### POST Requests
```javascript
// User signup
POST /api/auth/signup
Body: { name, email, password }

// User login
POST /api/auth/login
Body: { email, password }

// Create order (needs token)
POST /api/orders
Body: { items, deliveryAddress, paymentMethod, deliverySlot }

// Add product (admin)
POST /api/admin/products
Body: { name, category, price, stock, ... }
```

---

## 🎨 UI Component Reference

### Product Card
```javascript
<ProductCard product={product} />
```

### Header
```javascript
Sticky header with:
- Logo
- Search bar
- Cart icon with count
- Auth links
```

### Toast Notification
```javascript
import { showToast } from '../utils/toast'

showToast('Success message!')
showToast('Error message', 'error')
```

### Price Formatting
```javascript
import { formatPrice } from '../utils/formatters'

const formatted = formatPrice(299)  // ₹299
```

---

## 🔒 Authentication Flow

```
1. User Signup/Login
2. Receive JWT Token
3. Store in localStorage
4. Send with each API request
5. Header: Authorization: Bearer {token}
6. Backend verifies token
7. Access granted/denied
```

---

## 📦 State Management

### Using Cart
```javascript
import { useCart } from '../context/CartContext'

const { cartItems, addToCart, removeFromCart, getTotalPrice } = useCart()
```

### Using Wishlist
```javascript
import { useWishlist } from '../context/WishlistContext'

const { wishlist, addToWishlist, removeFromWishlist, isInWishlist } = useWishlist()
```

---

## 🧪 Testing Checklist

- [ ] Can view home page
- [ ] Can search products
- [ ] Can browse categories
- [ ] Can add to cart
- [ ] Can view cart
- [ ] Can checkout
- [ ] Can place order
- [ ] Can login/signup
- [ ] Can view profile
- [ ] Can add/edit products (admin)
- [ ] Mobile responsive
- [ ] Prices display correctly
- [ ] Cart persists after refresh
- [ ] Wishlist works

---

## 📈 Performance Tips

### Frontend Optimization
- Use `npm run build` to create optimized build
- Check Chrome DevTools Lighthouse
- Lazy load images
- Use React.memo for expensive components

### Backend Optimization
- Add database indexes
- Implement pagination
- Cache frequently accessed data
- Use compression middleware

### Database Optimization
- Index commonly searched fields
- Use projections to return only needed fields
- Implement query limits

---

## 🚀 Production Checklist

- [ ] Remove console.log statements
- [ ] Set NODE_ENV=production
- [ ] Use environment-specific configs
- [ ] Enable HTTPS
- [ ] Setup proper error logging
- [ ] Configure rate limiting
- [ ] Setup backup strategy
- [ ] Enable database authentication
- [ ] Use strong JWT secret
- [ ] Configure CORS properly
- [ ] Setup monitoring/alerts
- [ ] Create deployment guide

---

## 📚 File Sizes

| Component | Size | Lines |
|-----------|------|-------|
| App.jsx | 1.5 KB | 50 |
| ProductCard.jsx | 3.2 KB | 100 |
| CartContext.jsx | 2.1 KB | 70 |
| Home.jsx | 8.4 KB | 280 |
| Checkout.jsx | 6.8 KB | 230 |
| server.js | 1.2 KB | 45 |
| Product.js | 1.5 KB | 50 |

---

## 🎯 Next Steps After Setup

1. **Explore Code** - Understand component structure
2. **Modify Colors** - Customize brand colors
3. **Add Products** - Use admin panel to add items
4. **Test Flows** - Go through complete user journey
5. **Customize** - Make it your own
6. **Deploy** - Ship to production
7. **Optimize** - Improve performance
8. **Scale** - Add more features

---

## 🔗 Useful Links

- [React Hooks](https://react.dev/reference/react/hooks)
- [Express Middleware](https://expressjs.com/en/guide/using-middleware.html)
- [MongoDB Queries](https://docs.mongodb.com/manual/crud/)
- [Tailwind Utilities](https://tailwindcss.com/docs/utility-first)
- [JWT Explained](https://jwt.io)
- [REST API Design](https://restfulapi.net/)

---

## 💡 Pro Tips

✅ **Version Control**: Commit frequently  
✅ **Code Comments**: Explain complex logic  
✅ **Error Messages**: Keep them user-friendly  
✅ **Loading States**: Always show feedback  
✅ **Mobile First**: Design for small screens first  
✅ **Consistent Naming**: Follow patterns  
✅ **DRY Code**: Don't Repeat Yourself  
✅ **Security First**: Validate all inputs  
✅ **Performance**: Optimize before deploying  
✅ **Documentation**: Write for future developers  

---

**Happy Coding! 🚀**

For detailed setup instructions, see **SETUP_GUIDE.md**  
For complete features list, see **FEATURES.md**  
For project overview, see **PROJECT_SUMMARY.md**
