# 🌿 GreenCart - Plant Delivery Web Application

A full-stack quick-commerce style plant delivery application inspired by Blinkit and Flipkart UX. Order fresh plants and seeds with delivery in 45 minutes!

## 📋 Project Overview

GreenCart is a modern e-commerce platform for buying plants and seeds with features like:
- Express delivery (45 minutes)
- User authentication
- Shopping cart & wishlist
- Multiple payment methods
- Order tracking
- Admin panel for product management
- Responsive design following Blinkit's UX

## 🛠️ Tech Stack

### Frontend
- **React** 18+ (JavaScript only)
- **Vite** (Fast build tool)
- **Tailwind CSS** (Styling)
- **React Router DOM** (Navigation)
- **Axios** (API calls)
- **React Context API** (State management)

### Backend
- **Node.js** (Runtime)
- **Express.js** (Web framework)
- **MongoDB** (Database)
- **Mongoose** (ODM)
- **JWT** (Authentication)
- **bcryptjs** (Password hashing)

## 📂 Project Structure

```
GreenCart/
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Header.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ProductCard.jsx
│   │   ├── context/
│   │   │   ├── CartContext.jsx
│   │   │   └── WishlistContext.jsx
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Category.jsx
│   │   │   ├── ProductDetail.jsx
│   │   │   ├── Cart.jsx
│   │   │   ├── Checkout.jsx
│   │   │   ├── OrderConfirmation.jsx
│   │   │   ├── Profile.jsx
│   │   │   ├── Auth/
│   │   │   │   ├── Login.jsx
│   │   │   │   └── Signup.jsx
│   │   │   └── Admin/
│   │   │       └── AdminPanel.jsx
│   │   ├── utils/
│   │   │   ├── api.js
│   │   │   ├── formatters.js
│   │   │   └── toast.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── index.html
│   ├── package.json
│   ├── vite.config.js
│   ├── tailwind.config.js
│   └── postcss.config.js
│
├── backend/
│   ├── models/
│   │   ├── Product.js
│   │   ├── User.js
│   │   └── Order.js
│   ├── routes/
│   │   ├── products.js
│   │   ├── auth.js
│   │   ├── orders.js
│   │   └── admin.js
│   ├── middleware/
│   │   └── auth.js
│   ├── server.js
│   ├── package.json
│   └── .env
│
└── README.md
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16+)
- MongoDB (local or cloud)
- npm or yarn

### Installation & Setup

#### 1. Clone and Navigate
```bash
cd GreenCart
```

#### 2. Backend Setup
```bash
cd backend
npm install

# Configure MongoDB in .env
# MONGODB_URI=mongodb://localhost:27017/greencart

npm run dev  # or npm start
# Backend runs on http://localhost:5000
```

#### 3. Frontend Setup
```bash
cd ../frontend
npm install
npm run dev
# Frontend runs on http://localhost:5173
```

## 📦 Core Features

### Pages Implemented

1. **Home Page** ✅
   - Carousel banner with auto-rotation
   - Category quick-access grid
   - Best sellers section
   - New arrivals section
   - Promotional banner

2. **Category Page** ✅
   - Filterable product listings
   - Sidebar filters (type, price, rating)
   - Sorting options (popular, rating, price)
   - Responsive grid layout

3. **Product Detail Page** ✅
   - Product image gallery
   - Description and care instructions
   - Price display with discount
   - Quantity selector
   - Add to cart / Buy now buttons
   - Related products section

4. **Shopping Cart** ✅
   - Item list with quantity management
   - Price breakdown
   - Delivery slot selection
   - Coupon code input
   - Order summary

5. **Checkout** ✅
   - Multi-step form (Address → Payment)
   - Address form with validation
   - Payment method selection
   - Order summary sidebar

6. **Order Confirmation** ✅
   - Order ID and delivery estimate
   - Order timeline
   - Next steps information

7. **Authentication** ✅
   - Login page
   - Signup page
   - JWT token management

8. **User Profile** ✅
   - Order history
   - Profile information
   - Saved addresses

9. **Admin Panel** ✅
   - Product management (add, edit, delete)
   - Order management
   - Admin dashboard

## 🎨 Design Features

- **Color Scheme**: Green-themed (primary: #16a34a)
- **Currency**: Indian Rupees (₹)
- **Number Format**: Indian numbering (e.g., ₹1,299)
- **Responsive**: Mobile-first design
- **UI Elements**:
  - Card-based layout
  - Rounded corners
  - Soft shadows
  - Toast notifications
  - Skeleton loaders

## 💳 Payment Methods (Mock)
- Cash on Delivery (COD)
- UPI
- Card (Debit/Credit)

## 📍 Delivery Features
- Express delivery: 45 minutes
- Standard delivery: 2 hours
- Free delivery above ₹499
- Delivery fee: ₹40 below ₹499
- Pincode-based delivery check

## 🛍️ Product Categories

### Plants
- Indoor/Decor Plants
- Vegetable Plants
- Fruit Plants

### Seeds
- Vegetable Seeds
- Fruit Seeds
- Flower Seeds

## 🔐 Authentication
- JWT-based authentication
- Bcrypt password hashing
- Token stored in localStorage
- Protected routes

## 💾 State Management
- **Cart**: React Context API
- **Wishlist**: React Context API
- **User Auth**: localStorage + Context

## 📱 Mock Data
- Products: Hard-coded mock data
- Prices: Real Indian rupee values
- Ratings: Simulated user ratings

## 🎯 Nice-to-Have Features Included
- ✅ Search with auto-suggestions
- ✅ Wishlist functionality
- ✅ Coupon code input (mock: WELCOME50)
- ✅ Toast notifications
- ✅ Skeleton loaders
- ✅ Order tracking mockup
- ✅ Admin panel

## 📚 API Endpoints

### Products
- `GET /api/products` - Get all products
- `GET /api/products/:id` - Get product details
- `GET /api/products/search?q=...` - Search products

### Authentication
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `GET /api/auth/profile` - Get user profile (protected)

### Orders
- `POST /api/orders` - Create order (protected)
- `GET /api/orders` - Get user orders (protected)
- `GET /api/orders/:id` - Get order details (protected)

### Admin
- `POST /api/admin/products` - Add product
- `PUT /api/admin/products/:id` - Update product
- `DELETE /api/admin/products/:id` - Delete product
- `GET /api/admin/orders` - Get all orders
- `PATCH /api/admin/orders/:id` - Update order status

## 🧪 Demo Credentials
- **Email**: demo@greencart.com
- **Password**: demo123

## 🎓 Resume Points
1. Full-stack MERN application
2. Modern React with hooks and Context API
3. Responsive design with Tailwind CSS
4. JWT authentication
5. MongoDB data modeling
6. RESTful API design
7. Admin panel with CRUD operations
8. Cart and wishlist functionality
9. Multi-step checkout flow
10. Mobile-first design approach

## 🔄 Data Flow

```
User → Frontend (React) → API Calls (Axios)
                    ↓
              Backend (Express)
                    ↓
             Database (MongoDB)
```

## 📝 Coupon Codes
- **WELCOME50**: 50% discount on first order (code: `WELCOME50`)

## 🌐 Responsive Breakpoints
- Mobile: < 640px
- Tablet: 640px - 1024px
- Desktop: > 1024px

## 📌 Notes
- All prices are in Indian Rupees (₹)
- Delivery time estimate: 45 minutes (express)
- Maximum product image: 300x300px recommended
- JWT token expires in 7 days
- All dates follow Indian date format (DD MMM YYYY)

## 🚀 Future Enhancements
- Real payment gateway integration
- Real SMS/Email notifications
- Advanced search filters
- Product reviews and ratings
- Inventory management
- Analytics dashboard
- Customer support chat
- Plant care tips blog
- Video tutorials

## 📄 License
MIT License - Feel free to use this project as a portfolio piece or learning resource.

## 👨‍💻 Developer Notes
- Built with focus on clean code and reusability
- Component-based architecture
- DRY principles followed
- Mock data makes it easy to switch to real APIs
- All sensitive data in .env files
- Ready for production with minor changes

---

**Made with 🌿 for plant lovers and developers!**
