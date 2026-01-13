# 🚀 Quick Reference Guide

## Project Structure at a Glance

### Backend (Node.js + Express + PostgreSQL)
```
📂 backend/
├── 🔧 server.js              → Entry point, starts Express server
├── ⚙️  config/db.js           → PostgreSQL connection via Sequelize
├── 🛡️  middleware/
│   └── authMiddleware.js     → JWT verification & admin check
├── 📊 models/                 → Database models (Sequelize)
│   ├── index.js              → Model associations & exports
│   ├── User.js               → Users table
│   ├── Product.js            → Products table
│   ├── Order.js              → Orders table
│   ├── OrderProduct.js       → Order-Product junction table
│   ├── Shipment.js           → Shipments table
│   └── Wishlist.js           → Wishlists table
├── 🎮 controllers/            → Business logic
│   ├── userController.js     → Auth (register, login, password reset)
│   ├── productController.js  → Products (list, search, filter)
│   ├── orderController.js    → Orders (create, track, cancel)
│   ├── paymentController.js  → Payments (Razorpay, Stripe)
│   ├── shippingController.js → Shipping (methods, tracking)
│   ├── wishlistController.js → Wishlist (add, remove)
│   └── adminController.js    → Admin (analytics, user management)
└── 🛣️  routes/index.js        → API endpoints mapping
```

### Frontend (React + Vite)
```
📂 frontend/src/
├── 🎯 main.jsx                → React entry point
├── 📱 App.jsx                 → Main app with routing & providers
├── 🌐 api/                    → API service layer
│   ├── axios.js              → Configured Axios instance
│   ├── productService.js     → Product API calls
│   ├── shippingService.js    → Shipping/Order API calls
│   └── wishlistService.js    → Wishlist API calls
├── 🔄 context/                → Global state management
│   ├── AuthContext.jsx       → User authentication state
│   ├── CartContext.jsx       → Shopping cart state
│   └── WishlistContext.jsx   → Wishlist state
├── 🧩 components/             → Reusable UI components
│   ├── Navbar.jsx            → Top navigation
│   ├── Footer.jsx            → Footer
│   ├── Hero.jsx              → Homepage hero
│   ├── ProductCard.jsx       → Product display card
│   ├── ShippingForm.jsx      → Checkout shipping form
│   └── ... (7 more)
├── 📄 pages/                  → Route pages
│   ├── Home.jsx              → Homepage
│   ├── ProductList.jsx       → Product catalog
│   ├── Product.jsx           → Product details
│   ├── Cart.jsx              → Shopping cart
│   ├── Checkout.jsx          → Checkout process
│   ├── Login.jsx             → User login
│   ├── Register.jsx          → User registration
│   ├── Wishlist.jsx          → User wishlist
│   ├── OrderHistory.jsx      → Past orders
│   ├── OrderTracking.jsx     → Track shipment
│   ├── AdminDashboard.jsx    → Admin analytics
│   └── ... (6 more)
├── 🔧 services/
│   └── adminApi.js           → Admin-specific API calls
└── 🛠️  utils/
    └── razorpay.js           → Razorpay script loader
```

---

## 🔗 Key Connections

### Authentication Flow
```
Login Page → AuthContext.login() → POST /api/auth/login 
→ userController.loginUser() → Verify password → Generate JWT 
→ Return token → Store in localStorage → Update state
```

### Product Purchase Flow
```
ProductList → Add to Cart → CartContext 
→ Checkout → Payment → POST /api/orders 
→ orderController.createOrder() → Create Order + OrderProducts + Shipment 
→ OrderSuccess Page
```

### Admin Access Flow
```
Admin Login → JWT token with role='admin' 
→ AdminDashboard → GET /api/admin/* 
→ authMiddleware (verify JWT) → adminMiddleware (check role) 
→ adminController → Return data
```

---

## 📡 API Endpoints Summary

### Public Endpoints
- `POST /api/auth/register` - Create account
- `POST /api/auth/login` - Login
- `GET /api/products` - List products
- `GET /api/products/:id` - Product details
- `POST /api/orders` - Create order
- `POST /api/payment/create` - Create payment

### Protected Endpoints (JWT Required)
- `GET /api/user/profile` - Get profile
- `PUT /api/user/profile` - Update profile
- `GET /api/orders/:userId` - User's orders
- `PUT /api/orders/:orderId/cancel` - Cancel order

### Admin Endpoints (JWT + Admin Role)
- `GET /api/admin/users-summary` - Customer list
- `GET /api/admin/analytics/*` - Analytics data
- `DELETE /api/admin/users/:id` - Delete user
- `PUT /api/admin/users/:id/status` - Update user status

---

## 🗄️ Database Schema

```
Users
├── id (PK)
├── name, email, password
├── role (customer/admin)
└── status (active/inactive)

Products
├── id (PK)
├── name, brand, price
├── category, gender
└── image, description

Orders
├── id (PK)
├── userId (FK → Users)
├── totalAmount, status
├── paymentMethod, paymentStatus
└── shippingAddress (JSON)

OrderProducts (Junction)
├── OrderId (FK → Orders)
├── ProductId (FK → Products)
├── quantity
└── price

Shipments
├── id (PK)
├── orderId (FK → Orders)
├── trackingNumber, carrier
├── status, estimatedDelivery
└── shippedDate, deliveredDate

Wishlists
├── id (PK)
├── userId (FK → Users)
└── productId (FK → Products)
```

---

## 🎨 React Component Hierarchy

```
App
├── AuthContext Provider
│   ├── CartContext Provider
│   │   └── WishlistContext Provider
│   │       └── Router
│   │           ├── Navbar (all pages)
│   │           ├── Routes
│   │           │   ├── / → Home
│   │           │   │   ├── Hero
│   │           │   │   ├── NewCollections
│   │           │   │   │   └── ProductCard (x N)
│   │           │   │   └── EditorialSection
│   │           │   ├── /products → ProductList
│   │           │   │   └── ProductCard (x N)
│   │           │   ├── /products/:id → Product
│   │           │   ├── /cart → Cart
│   │           │   ├── /checkout → Checkout
│   │           │   │   ├── ShippingForm
│   │           │   │   ├── ShippingMethodSelector
│   │           │   │   └── StripePayment
│   │           │   ├── /login → Login
│   │           │   ├── /admin/dashboard → AdminDashboard
│   │           │   └── ... (other routes)
│   │           └── Footer (all pages)
│   └── Toaster (notifications)
```

---

## 🔐 State Management

### AuthContext
- **State**: `user`, `token`, `isAuthenticated`
- **Methods**: `login()`, `register()`, `logout()`, `updateUser()`
- **Storage**: localStorage
- **Used by**: Login, Register, Navbar, Protected pages

### CartContext
- **State**: `cartItems` (array)
- **Methods**: `addToCart()`, `removeFromCart()`, `updateQuantity()`, `clearCart()`
- **Storage**: localStorage
- **Used by**: ProductList, Product, Cart, Checkout, Navbar

### WishlistContext
- **State**: `wishlistItems` (array)
- **Methods**: `addToWishlist()`, `removeFromWishlist()`, `isInWishlist()`
- **Storage**: API + state
- **Used by**: ProductList, Product, Wishlist

---

## 🚦 Request Flow Example

### Adding Product to Cart
```
1. User clicks "Add to Cart" on ProductCard
2. ProductCard calls CartContext.addToCart(product, quantity)
3. CartContext updates state: [...cartItems, newItem]
4. CartContext saves to localStorage
5. Navbar re-renders with updated cart count
6. Toast notification shows "Added to cart"
```

### Placing an Order
```
1. User fills checkout form (shipping address)
2. User selects shipping method
3. User chooses payment method (Razorpay)
4. User clicks "Place Order"
5. Frontend: POST /api/payment/create
6. Backend: Create Razorpay order → Return order_id
7. Frontend: Open Razorpay modal
8. User completes payment
9. Frontend: POST /api/payment/verify
10. Backend: Verify signature
11. Frontend: POST /api/orders (with cart items)
12. Backend: Create Order, OrderProducts, Shipment
13. Backend: Return order with tracking number
14. Frontend: Clear cart, redirect to /order-success/:orderId
15. OrderSuccess page displays confirmation
```

---

## 📦 Dependencies

### Backend
- **express** - Web framework
- **sequelize** - ORM for PostgreSQL
- **pg** - PostgreSQL driver
- **bcryptjs** - Password hashing
- **jsonwebtoken** - JWT authentication
- **cors** - Cross-origin requests
- **dotenv** - Environment variables
- **razorpay** - Payment gateway
- **stripe** - Payment gateway

### Frontend
- **react** - UI library
- **react-router-dom** - Routing
- **axios** - HTTP client
- **react-hot-toast** - Notifications
- **@stripe/react-stripe-js** - Stripe integration
- **tailwindcss** - CSS framework
- **vite** - Build tool

---

## 🌟 Key Features

✅ User authentication (register, login, password reset)
✅ Product catalog with filters (category, gender, brand, price)
✅ Shopping cart with localStorage persistence
✅ Wishlist functionality
✅ Checkout with shipping address
✅ Multiple payment methods (Razorpay, Stripe)
✅ Order tracking with shipment status
✅ Order history and cancellation
✅ Admin dashboard with analytics
✅ Customer management (view, delete, activate/deactivate)
✅ Responsive design
✅ Search with auto-suggestions
✅ Role-based access control

---

## 🚀 Running the Application

### Backend
```bash
cd backend
npm install
npm start  # Runs on http://localhost:5002
```

### Frontend
```bash
cd frontend
npm install
npm run dev  # Runs on http://localhost:5173
```

### Environment Setup
1. Create `.env` in root with `DATABASE_URL`, `JWT_SECRET`
2. Create `.env` in frontend with `VITE_RAZORPAY_KEY_ID`, `VITE_STRIPE_PUBLISHABLE_KEY`
3. Database will auto-sync on backend start

---

## 📚 For More Details

See **PROJECT_ARCHITECTURE_GUIDE.md** for:
- Complete file-by-file breakdown
- Detailed data flow diagrams
- API request/response examples
- Database relationship explanations
- Code examples and patterns

---

**Total Project Size**: 60+ files, 10,000+ lines of code
**Architecture**: Full-stack MERN-style (PostgreSQL instead of MongoDB)
**Pattern**: MVC with service layer and context-based state management
