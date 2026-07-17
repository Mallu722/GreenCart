# GreenCart - Complete Setup Guide

## 🎯 Quick Start (5 minutes)

### Step 1: Install MongoDB
**Option A: Local MongoDB**
```bash
# On Windows (via Chocolatey)
choco install mongodb-community

# On Mac (via Homebrew)
brew install mongodb-community

# Start MongoDB
mongod
```

**Option B: MongoDB Atlas (Cloud)**
1. Visit [mongodb.com/cloud/atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free account
3. Create a cluster
4. Get connection string: `mongodb+srv://username:password@cluster.mongodb.net/greencart`

### Step 2: Setup Backend
```bash
cd GreenCart/backend

# Install dependencies
npm install

# Create .env file (already exists)
# Update MONGODB_URI if using local MongoDB

# Start backend
npm run dev
# Server runs on http://localhost:5000
```

### Step 3: Setup Frontend
```bash
cd GreenCart/frontend

# Install dependencies
npm install

# Start frontend
npm run dev
# Open http://localhost:5173 in browser
```

## 📖 Complete Setup Instructions

### Prerequisites
- Node.js v16+ ([Download](https://nodejs.org/))
- MongoDB ([Download](https://www.mongodb.com/try/download/community))
- Git
- Code Editor (VS Code recommended)

### Backend Setup

#### 1. Navigate to backend folder
```bash
cd GreenCart/backend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Configure environment
Edit `.env` file:
```env
PORT=5000
MONGODB_URI=mongodb://localhost:27017/greencart
JWT_SECRET=your_jwt_secret_key_here_change_in_production
NODE_ENV=development
CORS_ORIGIN=http://localhost:5173
```

#### 4. Seed database with sample products (Optional)
Create `seed.js` in backend folder:
```javascript
import mongoose from 'mongoose'
import Product from './models/Product.js'
import dotenv from 'dotenv'

dotenv.config()

const products = [
  {
    name: 'Money Plant',
    category: 'plants',
    subCategory: 'indoor',
    price: 149,
    discountPrice: 99,
    description: 'Low maintenance indoor plant',
    stock: 50,
    image: 'https://images.unsplash.com/photo-1509909756405-dfc993d674d4?w=300',
    rating: 4.8,
    reviews: 245,
    deliveryTime: '45'
  }
  // Add more products as needed
]

async function seed() {
  await mongoose.connect(process.env.MONGODB_URI)
  await Product.insertMany(products)
  console.log('Database seeded!')
  process.exit()
}

seed()
```

Run: `node seed.js`

#### 5. Start backend server
```bash
npm run dev
```

You should see: `GreenCart backend running on port 5000`

### Frontend Setup

#### 1. Navigate to frontend folder
```bash
cd GreenCart/frontend
```

#### 2. Install dependencies
```bash
npm install
```

#### 3. Start development server
```bash
npm run dev
```

Browser will open at `http://localhost:5173`

### 🧪 Testing the Application

#### 1. Test Home Page
- Visit http://localhost:5173
- See banner carousel, categories, products
- Test category navigation

#### 2. Test Shopping
- Click on a product
- View details, add to cart
- Check cart icon updates

#### 3. Test Authentication
- Click Login/Signup
- Use demo credentials or create new account
- Demo: demo@greencart.com / demo123

#### 4. Test Checkout
- Add products to cart
- Go to Cart page
- Click "Proceed to Checkout"
- Fill delivery address
- Select payment method
- Place order

#### 5. Test Admin Panel
- Navigate to http://localhost:5173/admin
- Add/Edit/Delete products
- View orders

## 🔧 Troubleshooting

### MongoDB Connection Error
**Problem**: `connection refused`
**Solution**: 
- Ensure MongoDB is running: `mongod`
- Check connection string in `.env`
- Verify MongoDB port (default: 27017)

### Port Already in Use
**Problem**: `Error: listen EADDRINUSE :::5000`
**Solution**: Kill the process
```bash
# Windows
netstat -ano | findstr :5000
taskkill /PID [PID] /F

# Mac/Linux
lsof -i :5000
kill -9 [PID]
```

### Module not found errors
**Problem**: `Cannot find module`
**Solution**: 
```bash
# Delete node_modules and reinstall
rm -rf node_modules
npm install
```

### CORS Error
**Problem**: `CORS policy blocked`
**Solution**: 
- Check CORS_ORIGIN in backend `.env`
- Ensure frontend URL matches: `http://localhost:5173`

### Vite dev server not opening browser
```bash
# Manually open: http://localhost:5173
```

## 📱 API Testing with Postman

### Import collection
1. Open Postman
2. Create requests for each endpoint:

#### Products
```
GET http://localhost:5000/api/products
GET http://localhost:5000/api/products/1
GET http://localhost:5000/api/products/search?q=plant
```

#### Auth
```
POST http://localhost:5000/api/auth/signup
Body: {"name":"John","email":"john@test.com","password":"123456"}

POST http://localhost:5000/api/auth/login
Body: {"email":"john@test.com","password":"123456"}
```

## 🚀 Deployment

### Frontend Deployment (Vercel)
```bash
cd frontend
npm run build
# Deploy dist/ folder to Vercel
```

### Backend Deployment (Railway/Render)
1. Push code to GitHub
2. Connect to Railway or Render
3. Set environment variables
4. Deploy!

## 📊 Project Structure Explained

```
frontend/
  ├── src/components/     # Reusable UI components
  ├── src/pages/          # Full-page components
  ├── src/context/        # Global state (Cart, Wishlist)
  ├── src/utils/          # Helper functions, API calls
  └── src/App.jsx         # Main app component with routing

backend/
  ├── models/             # MongoDB schemas
  ├── routes/             # API endpoints
  ├── middleware/         # Authentication, validation
  └── server.js           # Express app setup
```

## 🎓 Learning Path

1. **Understand Structure**: Review file organization
2. **Frontend Flow**: 
   - Home → Category → ProductDetail → Cart → Checkout
3. **Backend Flow**: 
   - Server.js → Routes → Models → MongoDB
4. **State Management**: 
   - CartContext → useCart hook → Components
5. **Authentication**: 
   - Login → JWT Token → Protected Routes

## 📝 Common Tasks

### Add New Product
1. Go to Admin Panel (/admin)
2. Fill form and click "Add Product"
3. Or create via API: `POST /api/admin/products`

### Change Delivery Fee Logic
File: `frontend/src/utils/formatters.js`
```javascript
export const calculateDeliveryFee = (total) => {
  return total >= 499 ? 0 : 40  // Edit these numbers
}
```

### Update Product Categories
Edit: `backend/models/Product.js`
```javascript
subCategory: {
  type: String,
  enum: ['indoor', 'vegetable', 'fruit', 'decor', 'flower'],
  required: true
}
```

### Change Color Scheme
Edit: `frontend/tailwind.config.js`
```javascript
colors: {
  green: { ... }  // Update these values
}
```

## ✅ Checklist Before Going Live

- [ ] All environment variables set
- [ ] MongoDB connection tested
- [ ] Frontend builds without errors: `npm run build`
- [ ] All pages work correctly
- [ ] Payment integration tested
- [ ] User authentication tested
- [ ] Admin panel working
- [ ] Mobile responsive checked
- [ ] Performance optimized
- [ ] Error handling added
- [ ] Security checks (no hardcoded secrets)

## 🆘 Support & Resources

- **React Docs**: https://react.dev
- **Express Docs**: https://expressjs.com
- **MongoDB Docs**: https://docs.mongodb.com
- **Tailwind CSS**: https://tailwindcss.com
- **Vite**: https://vitejs.dev

## 📚 Useful Commands

```bash
# Frontend
npm run dev           # Start dev server
npm run build         # Build for production
npm run preview       # Preview production build

# Backend
npm run dev           # Start with nodemon
npm start            # Start without nodemon
node seed.js         # Seed database
```

---

**Happy Coding! 🚀**
