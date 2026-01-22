# 📚 Complete Project Architecture Guide
## E-Commerce Web Application - File Structure & Connections

---

## 🏗️ Project Overview

This is a **full-stack e-commerce application** with:
- **Frontend**: React + Vite (Port 5173)
- **Backend**: Node.js + Express (Port 5002)
- **Database**: PostgreSQL (via Sequelize ORM)
- **Payment**: Razorpay & Stripe integration
- **Authentication**: JWT-based auth with role management

---

# 📁 BACKEND ARCHITECTURE

## Backend File Structure
```
backend/
├── config/
│   └── db.js                    # Database connection
├── controllers/
│   ├── adminController.js       # Admin operations
│   ├── orderController.js       # Order management
│   ├── paymentController.js     # Payment processing
│   ├── productController.js     # Product operations
│   ├── shippingController.js    # Shipping & tracking
│   ├── userController.js        # User authentication
│   └── wishlistController.js    # Wishlist operations
├── middleware/
│   └── authMiddleware.js        # JWT authentication & authorization
├── models/
│   ├── index.js                 # Model associations
│   ├── User.js                  # User model
│   ├── Product.js               # Product model
│   ├── Order.js                 # Order model
│   ├── OrderProduct.js          # Order-Product junction
│   ├── Shipment.js              # Shipment model
│   └── Wishlist.js              # Wishlist model
├── routes/
│   └── index.js                 # API route definitions
├── package.json                 # Backend dependencies
└── server.js                    # Express server entry point
```

---

## 🔧 Backend Files Explained

### **1. server.js** (Entry Point)
**Purpose**: Main server file that starts the Express application

**What it does**:
- Loads environment variables from `.env`
- Initializes Express app
- Sets up middleware (CORS, JSON parsing)
- Connects to PostgreSQL database
- Syncs database models
- Starts server on port 5002

**Connections**:
- Imports: `config/db.js`, `routes/index.js`
- Used by: None (this is the entry point)

---

### **2. config/db.js**
**Purpose**: Database connection configuration

**What it does**:
- Creates Sequelize instance with PostgreSQL connection
- Configures SSL for cloud database (Neon)
- Cleans DATABASE_URL from environment variables
- Disables SQL query logging

**Connections**:
- Imported by: `server.js`, all models, controllers
- Uses: Environment variable `DATABASE_URL`

---

### **3. middleware/authMiddleware.js**
**Purpose**: Authentication and authorization middleware

**What it does**:
- **authMiddleware**: Verifies JWT tokens from request headers
- **adminMiddleware**: Checks if authenticated user has admin role
- Attaches user object to `req.user` for protected routes

**Connections**:
- Imported by: `routes/index.js`
- Uses: `models/User.js`, JWT_SECRET from env

**Flow**:
```
Request → authMiddleware → Verify JWT → Fetch User → req.user → Next()
                                                              ↓
                                                      adminMiddleware → Check role
```

---

### **4. models/** (Database Models)

#### **models/index.js**
**Purpose**: Central hub for all models and their relationships

**What it does**:
- Imports all individual models
- Defines associations between models:
  - User ↔ Order (One-to-Many)
  - Order ↔ Product (Many-to-Many via OrderProduct)
  - Order ↔ Shipment (One-to-One)
  - User ↔ Wishlist (One-to-Many)
  - Product ↔ Wishlist (One-to-Many)
- Exports all models as a single object

**Connections**:
- Imports: All model files
- Exported to: All controllers, routes

---

#### **models/User.js**
**Purpose**: User account data model

**Fields**:
- `id` (Primary Key)
- `name`, `email`, `password`
- `role` (customer/admin)
- `status` (active/inactive)
- `phone`, `address`

**Relationships**:
- Has many: Orders, Wishlists

**Used by**: userController, adminController, authMiddleware

---

#### **models/Product.js**
**Purpose**: Product catalog data model

**Fields**:
- `id` (Primary Key)
- `name`, `brand`, `price`
- `image`, `category`, `gender`
- `description`

**Relationships**:
- Belongs to many: Orders (via OrderProduct)
- Has many: Wishlists

**Used by**: productController, orderController

---

#### **models/Order.js**
**Purpose**: Customer order data model

**Fields**:
- `id` (Primary Key)
- `userId` (Foreign Key → User)
- `totalAmount`, `status`
- `paymentMethod`, `paymentStatus`
- `shippingAddress`

**Relationships**:
- Belongs to: User
- Has many: OrderProducts
- Has one: Shipment
- Belongs to many: Products (via OrderProduct)

**Used by**: orderController, shippingController

---

#### **models/OrderProduct.js**
**Purpose**: Junction table for Order-Product many-to-many relationship

**Fields**:
- `OrderId` (Foreign Key → Order)
- `ProductId` (Foreign Key → Product)
- `quantity`, `price`

**Relationships**:
- Belongs to: Order, Product

**Used by**: orderController (to store product quantities in orders)

---

#### **models/Shipment.js**
**Purpose**: Shipping and tracking information

**Fields**:
- `id` (Primary Key)
- `orderId` (Foreign Key → Order)
- `trackingNumber`, `carrier`
- `status`, `estimatedDelivery`
- `shippedDate`, `deliveredDate`

**Relationships**:
- Belongs to: Order

**Used by**: shippingController, orderController

---

#### **models/Wishlist.js**
**Purpose**: User's saved products

**Fields**:
- `id` (Primary Key)
- `userId` (Foreign Key → User)
- `productId` (Foreign Key → Product)

**Relationships**:
- Belongs to: User, Product

**Used by**: wishlistController

---

### **5. controllers/** (Business Logic)

#### **controllers/userController.js**
**Purpose**: User authentication and profile management

**Functions**:
- `registerUser()` - Create new user account
- `loginUser()` - Authenticate user, return JWT token
- `forgotPassword()` - Generate password reset token
- `resetPassword()` - Update password with reset token
- `getProfile()` - Get authenticated user's profile
- `updateProfile()` - Update user information
- `changePassword()` - Change user password

**Connections**:
- Uses: `models/User.js`, bcrypt, JWT
- Called by: `routes/index.js` (auth routes)

**Flow**:
```
POST /api/auth/register → registerUser() → Hash password → Create User → Return JWT
POST /api/auth/login → loginUser() → Verify password → Return JWT
```

---

#### **controllers/productController.js**
**Purpose**: Product catalog operations

**Functions**:
- `getAllProducts()` - Fetch all products with filters (category, gender, brand, price)
- `getProductById()` - Get single product details
- `getProductSuggestions()` - Auto-complete search suggestions
- `seedProducts()` - Seed initial product data (development)

**Connections**:
- Uses: `models/Product.js`
- Called by: `routes/index.js` (product routes)

**Flow**:
```
GET /api/products?category=Shoes&gender=Men → getAllProducts() → Query DB → Return products
GET /api/products/suggestions?q=nike → getProductSuggestions() → Search DB → Return matches
```

---

#### **controllers/orderController.js**
**Purpose**: Order creation and management

**Functions**:
- `createOrder()` - Create new order with products
- `getUserOrders()` - Get all orders for a user
- `getOrderTracking()` - Get order tracking details
- `updateOrderStatus()` - Update order status (admin)
- `cancelOrder()` - Cancel order (customer)

**Connections**:
- Uses: `models/Order.js`, `models/OrderProduct.js`, `models/Product.js`, `models/Shipment.js`
- Called by: `routes/index.js` (order routes)

**Flow**:
```
POST /api/orders → createOrder() → Create Order → Create OrderProducts → Create Shipment → Return order
GET /api/orders/:userId → getUserOrders() → Fetch orders with products → Return orders
PUT /api/orders/:orderId/cancel → cancelOrder() → Check status → Update to cancelled
```

---

#### **controllers/paymentController.js**
**Purpose**: Payment processing integration

**Functions**:
- `createPaymentOrder()` - Create Razorpay order
- `verifyPayment()` - Verify Razorpay payment signature
- `createStripePaymentIntent()` - Create Stripe payment intent

**Connections**:
- Uses: Razorpay SDK, Stripe SDK
- Called by: `routes/index.js` (payment routes)

**Flow**:
```
POST /api/payment/create → createPaymentOrder() → Razorpay.orders.create() → Return order_id
POST /api/payment/verify → verifyPayment() → Verify signature → Return success
POST /api/payment/stripe/create-intent → createStripePaymentIntent() → Stripe API → Return client_secret
```

---

#### **controllers/shippingController.js**
**Purpose**: Shipping methods and tracking

**Functions**:
- `getShippingMethods()` - Get available shipping options
- `calculateShipping()` - Calculate shipping cost
- `getTrackingInfo()` - Get tracking by order ID
- `trackByNumber()` - Get tracking by tracking number
- `updateShipmentStatus()` - Update shipment status (admin)

**Connections**:
- Uses: `models/Shipment.js`, `models/Order.js`
- Called by: `routes/index.js` (shipping routes)

**Flow**:
```
GET /api/shipping/methods → getShippingMethods() → Return shipping options
POST /api/shipping/calculate → calculateShipping() → Calculate cost → Return amount
GET /api/shipping/track-number/:trackingNumber → trackByNumber() → Find shipment → Return details
```

---

#### **controllers/wishlistController.js**
**Purpose**: User wishlist management

**Functions**:
- `getUserWishlist()` - Get user's wishlist with product details
- `addToWishlist()` - Add product to wishlist
- `removeFromWishlist()` - Remove by wishlist ID
- `removeByUserAndProduct()` - Remove by user and product ID

**Connections**:
- Uses: `models/Wishlist.js`, `models/Product.js`
- Called by: `routes/index.js` (wishlist routes)

**Flow**:
```
GET /api/wishlist/:userId → getUserWishlist() → Fetch with products → Return wishlist
POST /api/wishlist → addToWishlist() → Create wishlist entry → Return success
```

---

#### **controllers/adminController.js**
**Purpose**: Admin dashboard and user management

**Functions**:
- `getUsersSummary()` - Get customer list with order stats
- `getUserDetail()` - Get detailed user information
- `getUsersGrowth()` - Get user registration analytics
- `getTopCustomers()` - Get top spending customers
- `getCategoryStats()` - Get product category statistics
- `getAllUsers()` - Get all users (admin CRUD)
- `createUser()` - Create new user (admin)
- `updateUserRole()` - Change user role
- `updateUserStatus()` - Activate/deactivate user
- `deleteUser()` - Delete user account

**Connections**:
- Uses: `models/User.js`, `models/Order.js`, `models/Product.js`
- Called by: `routes/index.js` (admin routes with authMiddleware + adminMiddleware)

**Flow**:
```
GET /api/admin/users-summary → authMiddleware → adminMiddleware → getUsersSummary() → Return customers
GET /api/admin/analytics/users-growth → getUsersGrowth() → Group by month → Return data
```

---

### **6. routes/index.js**
**Purpose**: API endpoint definitions and route mapping

**What it does**:
- Defines all API routes
- Maps routes to controller functions
- Applies middleware (auth, admin) to protected routes
- Organizes routes by feature (products, orders, auth, etc.)

**Route Categories**:

1. **Product Routes** (Public)
   - `GET /api/products` → getAllProducts
   - `GET /api/products/:id` → getProductById
   - `GET /api/products/suggestions` → getProductSuggestions

2. **Auth Routes** (Public)
   - `POST /api/auth/register` → registerUser
   - `POST /api/auth/login` → loginUser
   - `POST /api/auth/forgot-password` → forgotPassword
   - `POST /api/auth/reset-password` → resetPassword

3. **User Routes** (Protected - authMiddleware)
   - `GET /api/user/profile` → getProfile
   - `PUT /api/user/profile` → updateProfile
   - `PUT /api/user/password` → changePassword

4. **Order Routes** (Mixed)
   - `POST /api/orders` → createOrder
   - `GET /api/orders/:userId` → getUserOrders
   - `GET /api/orders/:orderId/tracking` → getOrderTracking
   - `PUT /api/orders/:orderId/cancel` → cancelOrder

5. **Payment Routes** (Public)
   - `POST /api/payment/create` → createPaymentOrder
   - `POST /api/payment/verify` → verifyPayment
   - `POST /api/payment/stripe/create-intent` → createStripePaymentIntent

6. **Shipping Routes** (Public)
   - `GET /api/shipping/methods` → getShippingMethods
   - `POST /api/shipping/calculate` → calculateShipping
   - `GET /api/shipping/track-number/:trackingNumber` → trackByNumber

7. **Wishlist Routes** (Public)
   - `GET /api/wishlist/:userId` → getUserWishlist
   - `POST /api/wishlist` → addToWishlist
   - `DELETE /api/wishlist/:id` → removeFromWishlist

8. **Admin Routes** (Protected - authMiddleware + adminMiddleware)
   - `GET /api/admin/users-summary` → getUsersSummary
   - `GET /api/admin/user/:id` → getUserDetail
   - `GET /api/admin/analytics/users-growth` → getUsersGrowth
   - `GET /api/admin/analytics/top-customers` → getTopCustomers
   - `GET /api/admin/analytics/category-stats` → getCategoryStats
   - `GET /api/admin/users` → getAllUsers
   - `POST /api/admin/users` → createUser
   - `PUT /api/admin/users/:id/role` → updateUserRole
   - `PUT /api/admin/users/:id/status` → updateUserStatus
   - `DELETE /api/admin/users/:id` → deleteUser

**Connections**:
- Imports: All controllers, authMiddleware, adminMiddleware
- Used by: `server.js` (mounted at `/api`)

---

# 📁 FRONTEND ARCHITECTURE

## Frontend File Structure
```
frontend/
├── public/
│   ├── products/              # Static product images
│   ├── puffer-jacket.avif     # Hero image
│   └── vite.svg               # Vite logo
├── src/
│   ├── api/                   # API service layer
│   │   ├── axios.js           # Axios instance configuration
│   │   ├── productService.js  # Product API calls
│   │   ├── shippingService.js # Shipping API calls
│   │   └── wishlistService.js # Wishlist API calls
│   ├── assets/                # Static assets (images)
│   │   ├── download.jpg       # Hero model image
│   │   ├── newcollection1.png # Editorial image 1
│   │   └── newcollection2.jpg # Editorial image 2
│   ├── components/            # Reusable UI components
│   │   ├── EditorialSection.jsx
│   │   ├── Footer.jsx
│   │   ├── Hero.jsx
│   │   ├── Navbar.jsx
│   │   ├── NewCollections.jsx
│   │   ├── Newsletter.jsx
│   │   ├── ProductCard.jsx
│   │   ├── SectionHeader.jsx
│   │   ├── ShippingForm.jsx
│   │   ├── ShippingMethodSelector.jsx
│   │   └── StripePayment.jsx
│   ├── context/               # React Context providers
│   │   ├── AuthContext.jsx    # Authentication state
│   │   ├── CartContext.jsx    # Shopping cart state
│   │   └── WishlistContext.jsx # Wishlist state
│   ├── pages/                 # Page components (routes)
│   │   ├── AdminCustomerDetail.jsx
│   │   ├── AdminCustomers.jsx
│   │   ├── AdminDashboard.jsx
│   │   ├── Cart.jsx
│   │   ├── Checkout.jsx
│   │   ├── ForgotPassword.jsx
│   │   ├── Home.jsx
│   │   ├── Login.jsx
│   │   ├── New.jsx
│   │   ├── OrderHistory.jsx
│   │   ├── OrderSuccess.jsx
│   │   ├── OrderTracking.jsx
│   │   ├── Product.jsx
│   │   ├── ProductList.jsx
│   │   ├── Register.jsx
│   │   ├── ResetPassword.jsx
│   │   └── Wishlist.jsx
│   ├── services/              # Business logic services
│   │   └── adminApi.js        # Admin API calls
│   ├── utils/                 # Utility functions
│   │   └── razorpay.js        # Razorpay script loader
│   ├── App.css                # Global styles
│   ├── App.jsx                # Main app component
│   ├── index.css              # Tailwind imports
│   └── main.jsx               # React entry point
├── index.html                 # HTML template
├── package.json               # Frontend dependencies
├── tailwind.config.js         # Tailwind CSS config
└── vite.config.js             # Vite configuration
```

---

## 🎨 Frontend Files Explained

### **1. main.jsx** (Entry Point)
**Purpose**: React application entry point

**What it does**:
- Imports React and ReactDOM
- Renders the root App component
- Wraps app in StrictMode
- Mounts to `#root` div in index.html

**Connections**:
- Imports: `App.jsx`, `index.css`
- Used by: None (this is the entry point)

---

### **2. App.jsx** (Main Component)
**Purpose**: Application shell with routing and global providers

**What it does**:
- Sets up React Router with all routes
- Wraps app in Context Providers (Auth, Cart, Wishlist)
- Renders Navbar and Footer on all pages
- Configures toast notifications

**Route Structure**:
```
/ → Home
/new → New (New arrivals)
/products → ProductList
/products/:id → Product (Product detail)
/cart → Cart
/wishlist → Wishlist
/login → Login
/register → Register
/forgot-password → ForgotPassword
/reset-password → ResetPassword
/checkout → Checkout
/order-success/:orderId → OrderSuccess
/orders → OrderHistory
/track → OrderTracking
/track/:orderId → OrderTracking
/admin/dashboard → AdminDashboard
/admin/customers → AdminCustomers
/admin/customer/:id → AdminCustomerDetail
```

**Connections**:
- Imports: All pages, Navbar, Footer, all Context providers
- Imported by: `main.jsx`

---

### **3. api/** (API Service Layer)

#### **api/axios.js**
**Purpose**: Configured Axios instance for API calls

**What it does**:
- Creates Axios instance with base URL (http://localhost:5002/api)
- Sets up request interceptor to add JWT token to headers
- Retrieves token from localStorage
- Adds Authorization header to all requests

**Connections**:
- Used by: All API service files
- Uses: localStorage (for JWT token)

**Flow**:
```
API Call → axios instance → Request interceptor → Add JWT token → Send request
```

---

#### **api/productService.js**
**Purpose**: Product-related API calls

**Functions**:
- `getAllProducts(filters)` - Fetch products with filters
- `getProductById(id)` - Get single product

**Connections**:
- Uses: `axios.js`
- Used by: ProductList, Product pages

---

#### **api/shippingService.js**
**Purpose**: Shipping and order-related API calls

**Functions**:
- `getShippingMethods()` - Get shipping options
- `getUserOrders(userId)` - Get user's orders
- `getOrderTracking(orderId)` - Get order tracking
- `trackByNumber(trackingNumber)` - Track by number
- `cancelOrder(orderId)` - Cancel order

**Connections**:
- Uses: `axios.js`
- Used by: Checkout, OrderHistory, OrderTracking, OrderSuccess pages

---

#### **api/wishlistService.js**
**Purpose**: Wishlist-related API calls

**Functions**:
- `getUserWishlist(userId)` - Get user's wishlist
- `addToWishlist(userId, productId)` - Add to wishlist
- `removeByUserAndProduct(userId, productId)` - Remove from wishlist

**Connections**:
- Uses: `axios.js`
- Used by: `WishlistContext.jsx`

---

### **4. services/adminApi.js**
**Purpose**: Admin-specific API calls

**Functions**:
- `getUsersSummary()` - Get customer summary
- `getUserDetail(id)` - Get user details
- `getUsersGrowth()` - Get user growth analytics
- `getTopCustomers()` - Get top customers
- `getCategoryStats()` - Get category statistics
- `deleteUser(id)` - Delete user
- `updateUserStatus(id, status)` - Update user status

**Connections**:
- Uses: `axios.js`
- Used by: AdminDashboard, AdminCustomers, AdminCustomerDetail pages

---

### **5. context/** (State Management)

#### **context/AuthContext.jsx**
**Purpose**: Global authentication state management

**State**:
- `user` - Current logged-in user object
- `token` - JWT authentication token
- `isAuthenticated` - Boolean auth status

**Functions**:
- `login(email, password)` - Authenticate user
- `register(userData)` - Create new account
- `logout()` - Clear auth state
- `updateUser(userData)` - Update user profile

**Storage**:
- Persists user and token in localStorage
- Restores state on app reload

**Connections**:
- Used by: All pages that need auth (Login, Register, Navbar, etc.)
- Provides: Auth state to entire app via Context

**Flow**:
```
Login Page → login() → API call → Store token & user → Update state → Redirect
Navbar → useAuth() → Get user → Display user info
Logout → logout() → Clear localStorage → Reset state
```

---

#### **context/CartContext.jsx**
**Purpose**: Shopping cart state management

**State**:
- `cartItems` - Array of products in cart with quantities

**Functions**:
- `addToCart(product, quantity)` - Add product to cart
- `removeFromCart(productId)` - Remove product
- `updateQuantity(productId, quantity)` - Update quantity
- `clearCart()` - Empty cart
- `getCartTotal()` - Calculate total price
- `getCartCount()` - Get total items

**Storage**:
- Persists cart in localStorage
- Restores on app reload

**Connections**:
- Used by: ProductList, Product, Cart, Navbar pages
- Provides: Cart state to entire app

**Flow**:
```
Product Page → addToCart() → Update state → Save to localStorage
Cart Page → updateQuantity() → Recalculate total → Update state
Navbar → getCartCount() → Display badge
```

---

#### **context/WishlistContext.jsx**
**Purpose**: Wishlist state management

**State**:
- `wishlistItems` - Array of wishlist products

**Functions**:
- `addToWishlist(product)` - Add to wishlist (API call)
- `removeFromWishlist(productId)` - Remove from wishlist (API call)
- `isInWishlist(productId)` - Check if product is in wishlist
- `fetchWishlist()` - Reload wishlist from API

**Connections**:
- Uses: `api/wishlistService.js`, `AuthContext`
- Used by: ProductList, Product, Wishlist pages
- Provides: Wishlist state to entire app

**Flow**:
```
Product Page → addToWishlist() → API call → Update state
Wishlist Page → fetchWishlist() → API call → Display items
Product Card → isInWishlist() → Show heart icon state
```

---

### **6. components/** (Reusable Components)

#### **components/Navbar.jsx**
**Purpose**: Top navigation bar

**Features**:
- Logo and brand name
- Navigation links (Home, New, Products)
- Search bar with auto-suggestions
- Cart icon with item count
- Wishlist icon
- User menu (Login/Profile/Admin/Logout)

**Connections**:
- Uses: `AuthContext`, `CartContext`, `useNavigate`
- Displays on: All pages (via App.jsx)

---

#### **components/Footer.jsx**
**Purpose**: Footer with links and information

**Features**:
- Company information
- Quick links
- Customer service links
- Social media links
- Newsletter signup

**Connections**:
- Displays on: All pages (via App.jsx)

---

#### **components/Hero.jsx**
**Purpose**: Homepage hero section

**Features**:
- Large hero image
- Seasonal collection text
- Three-column layout

**Connections**:
- Uses: `assets/download.jpg`
- Displayed on: Home page

---

#### **components/EditorialSection.jsx**
**Purpose**: Editorial/featured content section

**Features**:
- Two-column layout with images
- "NEW COLLECTIONS" heading
- Seasonal collection showcase

**Connections**:
- Uses: `assets/newcollection1.png`, `assets/newcollection2.jpg`
- Displayed on: Home page

---

#### **components/NewCollections.jsx**
**Purpose**: Display new arrival products

**Features**:
- Fetches latest products from API
- Displays in grid layout
- Uses ProductCard component

**Connections**:
- Uses: `api/productService.js`, `ProductCard`
- Displayed on: Home page, New page

---

#### **components/ProductCard.jsx**
**Purpose**: Reusable product display card

**Features**:
- Product image
- Name, brand, price
- Add to cart button
- Wishlist heart icon
- Click to view details

**Connections**:
- Uses: `CartContext`, `WishlistContext`
- Used by: ProductList, NewCollections, Wishlist pages

---

#### **components/SectionHeader.jsx**
**Purpose**: Reusable section heading component

**Features**:
- Styled heading with underline
- Consistent typography

**Connections**:
- Used by: Multiple pages for section titles

---

#### **components/ShippingForm.jsx**
**Purpose**: Shipping address input form

**Features**:
- Name, email, phone fields
- Address, city, state, zip fields
- Form validation

**Connections**:
- Used by: Checkout page
- Passes data to parent component

---

#### **components/ShippingMethodSelector.jsx**
**Purpose**: Shipping method selection

**Features**:
- Displays available shipping options
- Shows price and delivery time
- Radio button selection

**Connections**:
- Uses: `api/shippingService.js`
- Used by: Checkout page

---

#### **components/StripePayment.jsx**
**Purpose**: Stripe payment form integration

**Features**:
- Stripe Elements integration
- Card input fields
- Payment processing

**Connections**:
- Uses: Stripe SDK, backend payment API
- Used by: Checkout page

---

#### **components/Newsletter.jsx**
**Purpose**: Newsletter subscription form

**Features**:
- Email input
- Subscribe button
- Toast notifications

**Connections**:
- Displayed on: Footer

---

### **7. pages/** (Page Components)

#### **pages/Home.jsx**
**Purpose**: Homepage/landing page

**Features**:
- Hero section
- New collections
- Editorial section
- Featured products

**Connections**:
- Uses: Hero, NewCollections, EditorialSection components

---

#### **pages/ProductList.jsx**
**Purpose**: Product catalog with filters

**Features**:
- Product grid display
- Filters (category, gender, brand, price)
- Search functionality
- Sorting options

**Connections**:
- Uses: `api/productService.js`, ProductCard, CartContext

**Flow**:
```
User selects filter → Update state → API call with filters → Display products
```

---

#### **pages/Product.jsx**
**Purpose**: Single product detail page

**Features**:
- Product images
- Name, brand, price, description
- Size/quantity selector
- Add to cart button
- Add to wishlist button

**Connections**:
- Uses: `api/productService.js`, CartContext, WishlistContext
- Route: `/products/:id`

---

#### **pages/Cart.jsx**
**Purpose**: Shopping cart page

**Features**:
- List of cart items
- Quantity adjustment
- Remove items
- Price summary
- Proceed to checkout button

**Connections**:
- Uses: CartContext
- Links to: Checkout page

---

#### **pages/Wishlist.jsx**
**Purpose**: User's saved products

**Features**:
- Grid of wishlist items
- Remove from wishlist
- Add to cart from wishlist

**Connections**:
- Uses: WishlistContext, CartContext, ProductCard

---

#### **pages/Login.jsx**
**Purpose**: User login page

**Features**:
- Email and password fields
- Login button
- Link to register
- Forgot password link

**Connections**:
- Uses: AuthContext
- Redirects to: Home or previous page after login

**Flow**:
```
Enter credentials → login() → API call → Store token → Redirect
```

---

#### **pages/Register.jsx**
**Purpose**: New user registration

**Features**:
- Name, email, password fields
- Register button
- Link to login

**Connections**:
- Uses: AuthContext
- Redirects to: Home after registration

---

#### **pages/ForgotPassword.jsx**
**Purpose**: Password reset request

**Features**:
- Email input
- Send reset link button

**Connections**:
- Calls: `/api/auth/forgot-password`

---

#### **pages/ResetPassword.jsx**
**Purpose**: Set new password

**Features**:
- New password fields
- Reset button
- Uses token from URL

**Connections**:
- Calls: `/api/auth/reset-password`

---

#### **pages/Checkout.jsx**
**Purpose**: Order checkout and payment

**Features**:
- Shipping address form
- Shipping method selection
- Payment method (Razorpay/Stripe)
- Order summary
- Place order button

**Connections**:
- Uses: CartContext, AuthContext, ShippingForm, ShippingMethodSelector, StripePayment
- Calls: `/api/orders`, `/api/payment/*`
- Redirects to: OrderSuccess page

**Flow**:
```
Fill shipping → Select shipping method → Choose payment → Place order → Create order → Process payment → Redirect to success
```

---

#### **pages/OrderSuccess.jsx**
**Purpose**: Order confirmation page

**Features**:
- Order details
- Tracking information
- Thank you message
- Continue shopping button

**Connections**:
- Uses: `api/shippingService.js`
- Route: `/order-success/:orderId`

---

#### **pages/OrderHistory.jsx**
**Purpose**: User's past orders

**Features**:
- List of all orders
- Order status
- Order details
- Track order button
- Cancel order button

**Connections**:
- Uses: `api/shippingService.js`, AuthContext

---

#### **pages/OrderTracking.jsx**
**Purpose**: Track order shipment

**Features**:
- Tracking number input
- Shipment status timeline
- Estimated delivery
- Carrier information

**Connections**:
- Uses: `api/shippingService.js`
- Route: `/track` or `/track/:orderId`

---

#### **pages/AdminDashboard.jsx**
**Purpose**: Admin analytics dashboard

**Features**:
- User growth chart
- Top customers table
- Category statistics
- Revenue metrics

**Connections**:
- Uses: `services/adminApi.js`, AuthContext
- Protected by: Admin role check

---

#### **pages/AdminCustomers.jsx**
**Purpose**: Customer management

**Features**:
- Customer list table
- Search and filter
- View details button
- Delete user button
- Activate/deactivate user

**Connections**:
- Uses: `services/adminApi.js`
- Links to: AdminCustomerDetail

---

#### **pages/AdminCustomerDetail.jsx**
**Purpose**: Detailed customer information

**Features**:
- User profile information
- Order history
- Total spending
- Account status

**Connections**:
- Uses: `services/adminApi.js`
- Route: `/admin/customer/:id`

---

#### **pages/New.jsx**
**Purpose**: New arrivals page

**Features**:
- Display latest products
- Similar to ProductList but filtered for new items

**Connections**:
- Uses: `api/productService.js`, ProductCard

---

### **8. utils/razorpay.js**
**Purpose**: Load Razorpay payment script

**What it does**:
- Dynamically loads Razorpay checkout script
- Returns promise for script loading
- Prevents duplicate script loading

**Connections**:
- Used by: Checkout page

---

## 🔄 Complete Data Flow Examples

### **1. User Registration Flow**
```
Register Page
    ↓
Enter user details (name, email, password)
    ↓
Click "Register" button
    ↓
AuthContext.register()
    ↓
POST /api/auth/register
    ↓
Backend: userController.registerUser()
    ↓
Hash password with bcrypt
    ↓
Create User in database
    ↓
Generate JWT token
    ↓
Return { user, token }
    ↓
Frontend: Store in localStorage
    ↓
Update AuthContext state
    ↓
Redirect to Home page
```

---

### **2. Product Purchase Flow**
```
ProductList Page
    ↓
Browse products → Click product
    ↓
Product Detail Page
    ↓
Select quantity → Click "Add to Cart"
    ↓
CartContext.addToCart()
    ↓
Update cart state → Save to localStorage
    ↓
Navigate to Cart Page
    ↓
Review items → Click "Checkout"
    ↓
Checkout Page
    ↓
Fill shipping form
    ↓
Select shipping method
    ↓
Choose payment method (Razorpay/Stripe)
    ↓
Click "Place Order"
    ↓
POST /api/payment/create (create payment order)
    ↓
Backend: paymentController.createPaymentOrder()
    ↓
Razorpay/Stripe creates order
    ↓
Return order_id/client_secret
    ↓
Frontend: Open payment modal
    ↓
User completes payment
    ↓
POST /api/payment/verify
    ↓
Backend: Verify payment signature
    ↓
POST /api/orders (create order)
    ↓
Backend: orderController.createOrder()
    ↓
Create Order record
    ↓
Create OrderProduct records
    ↓
Create Shipment record with tracking number
    ↓
Return order details
    ↓
Frontend: Clear cart
    ↓
Redirect to OrderSuccess page
    ↓
Display order confirmation and tracking info
```

---

### **3. Admin Analytics Flow**
```
Admin logs in
    ↓
Navigate to /admin/dashboard
    ↓
AdminDashboard Page loads
    ↓
Parallel API calls:
    ├─ GET /api/admin/analytics/users-growth
    ├─ GET /api/admin/analytics/top-customers
    └─ GET /api/admin/analytics/category-stats
    ↓
Backend: authMiddleware verifies JWT
    ↓
Backend: adminMiddleware checks role
    ↓
Backend: adminController functions execute
    ↓
Query database with aggregations
    ↓
Return analytics data
    ↓
Frontend: Render charts and tables
    ↓
Admin clicks "View Customers"
    ↓
Navigate to /admin/customers
    ↓
GET /api/admin/users-summary
    ↓
Backend: Fetch users with order counts
    ↓
Return customer list
    ↓
Display in table with actions
    ↓
Admin clicks "View Details" on customer
    ↓
Navigate to /admin/customer/:id
    ↓
GET /api/admin/user/:id
    ↓
Backend: Fetch user with orders and products
    ↓
Return detailed user data
    ↓
Display customer profile and order history
```

---

### **4. Wishlist Management Flow**
```
User browses ProductList
    ↓
Click heart icon on ProductCard
    ↓
WishlistContext.addToWishlist()
    ↓
POST /api/wishlist
    ↓
Backend: wishlistController.addToWishlist()
    ↓
Create Wishlist record (userId + productId)
    ↓
Return success
    ↓
Frontend: Update wishlist state
    ↓
Heart icon turns red
    ↓
User navigates to /wishlist
    ↓
Wishlist Page loads
    ↓
WishlistContext.fetchWishlist()
    ↓
GET /api/wishlist/:userId
    ↓
Backend: wishlistController.getUserWishlist()
    ↓
Query Wishlist with Product details
    ↓
Return wishlist items
    ↓
Display products in grid
    ↓
User clicks "Add to Cart" on wishlist item
    ↓
CartContext.addToCart()
    ↓
Update cart state
    ↓
User clicks "Remove" from wishlist
    ↓
WishlistContext.removeFromWishlist()
    ↓
POST /api/wishlist/remove
    ↓
Backend: Delete wishlist record
    ↓
Frontend: Update state
    ↓
Item removed from display
```

---

## 🔐 Authentication Flow

### **JWT Token Lifecycle**
```
1. LOGIN
   User enters credentials
   → POST /api/auth/login
   → Backend verifies password
   → Generate JWT with user.id
   → Return { user, token }
   → Frontend stores in localStorage
   → Set in AuthContext state

2. AUTHENTICATED REQUESTS
   User makes API call
   → axios.js request interceptor
   → Get token from localStorage
   → Add "Authorization: Bearer {token}" header
   → Send request
   → Backend authMiddleware extracts token
   → Verify JWT signature
   → Decode user.id
   → Fetch user from database
   → Attach to req.user
   → Continue to controller

3. ADMIN REQUESTS
   Same as above, plus:
   → adminMiddleware checks req.user.role
   → If role === 'admin', continue
   → Else, return 403 Forbidden

4. LOGOUT
   User clicks logout
   → AuthContext.logout()
   → Clear localStorage
   → Reset state
   → Redirect to home
```

---

## 📦 Database Relationships

```
User (1) ──────< (Many) Order
  │                        │
  │                        │ (1-to-1)
  │                        │
  │                    Shipment
  │
  │ (1-to-Many)
  │
Wishlist ───> (Many-to-1) Product
                              │
                              │
                              │ (Many-to-Many via OrderProduct)
                              │
                          Order
```

**Detailed Relationships**:
- **User → Order**: One user can have many orders
- **Order → Shipment**: One order has one shipment
- **Order ↔ Product**: Many-to-many (via OrderProduct junction table)
- **User → Wishlist**: One user can have many wishlist items
- **Product → Wishlist**: One product can be in many wishlists

---

## 🌐 API Request/Response Examples

### **Create Order**
**Request**:
```http
POST /api/orders
Authorization: Bearer {jwt_token}
Content-Type: application/json

{
  "userId": 1,
  "products": [
    { "productId": 5, "quantity": 2, "price": 120.00 },
    { "productId": 8, "quantity": 1, "price": 85.00 }
  ],
  "totalAmount": 325.00,
  "paymentMethod": "razorpay",
  "paymentStatus": "completed",
  "shippingAddress": {
    "name": "John Doe",
    "phone": "1234567890",
    "address": "123 Main St",
    "city": "New York",
    "state": "NY",
    "zipCode": "10001"
  },
  "shippingMethod": "standard"
}
```

**Response**:
```json
{
  "id": 42,
  "userId": 1,
  "totalAmount": 325.00,
  "status": "pending",
  "paymentMethod": "razorpay",
  "paymentStatus": "completed",
  "shippingAddress": { ... },
  "createdAt": "2025-12-10T10:00:00Z",
  "Shipment": {
    "id": 42,
    "orderId": 42,
    "trackingNumber": "TRK1733824800000",
    "carrier": "Standard Shipping",
    "status": "pending",
    "estimatedDelivery": "2025-12-17T10:00:00Z"
  },
  "Products": [
    {
      "id": 5,
      "name": "Nike Air Max",
      "price": 120.00,
      "OrderProduct": { "quantity": 2 }
    },
    {
      "id": 8,
      "name": "Adidas Hoodie",
      "price": 85.00,
      "OrderProduct": { "quantity": 1 }
    }
  ]
}
```

---

## 🎯 Key Design Patterns

### **1. Context Pattern (State Management)**
- AuthContext, CartContext, WishlistContext
- Provides global state without prop drilling
- Persists state in localStorage

### **2. Service Layer Pattern**
- API calls abstracted into service files
- Axios instance with interceptors
- Centralized error handling

### **3. Controller Pattern (Backend)**
- Business logic separated from routes
- Reusable controller functions
- Clear separation of concerns

### **4. Middleware Pattern**
- Authentication middleware
- Authorization middleware
- Request/response transformation

### **5. Component Composition**
- Reusable components (ProductCard, SectionHeader)
- Page components compose smaller components
- Props for customization

---

## 📝 Environment Variables

### **Backend (.env)**
```env
DATABASE_URL=postgresql://user:password@host/database
JWT_SECRET=your_jwt_secret_key
PORT=5002
RAZORPAY_KEY_ID=your_razorpay_key
RAZORPAY_KEY_SECRET=your_razorpay_secret
STRIPE_SECRET_KEY=your_stripe_secret
```

### **Frontend (.env)**
```env
VITE_API_URL=http://localhost:5002/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key
VITE_STRIPE_PUBLISHABLE_KEY=your_stripe_publishable_key
```

---

## 🚀 Application Startup Flow

### **Backend**
```
1. npm start
2. Load .env variables
3. server.js executes
4. Connect to PostgreSQL (config/db.js)
5. Load all models (models/index.js)
6. Sync database (create/update tables)
7. Mount routes (/api → routes/index.js)
8. Start Express server on port 5002
9. Listen for requests
```

### **Frontend**
```
1. npm run dev
2. Vite starts dev server
3. Load index.html
4. Execute main.jsx
5. Render App.jsx
6. Initialize Context Providers
7. Set up React Router
8. Render initial route (Home)
9. Restore state from localStorage
10. App ready on port 5173
```

---

## 🔗 Complete Connection Map

```
main.jsx
  └─> App.jsx
       ├─> AuthContext (wraps entire app)
       │    └─> Uses: localStorage, axios
       ├─> CartContext (wraps entire app)
       │    └─> Uses: localStorage
       ├─> WishlistContext (wraps entire app)
       │    └─> Uses: wishlistService, AuthContext
       ├─> Router
       │    ├─> Navbar (on all pages)
       │    │    └─> Uses: AuthContext, CartContext
       │    ├─> Routes
       │    │    ├─> Home → Hero, NewCollections, EditorialSection
       │    │    ├─> ProductList → productService, ProductCard
       │    │    ├─> Product → productService, CartContext, WishlistContext
       │    │    ├─> Cart → CartContext
       │    │    ├─> Checkout → CartContext, ShippingForm, StripePayment
       │    │    ├─> Login → AuthContext
       │    │    ├─> AdminDashboard → adminApi
       │    │    └─> ... (other pages)
       │    └─> Footer (on all pages)
       └─> Toaster (notifications)

API Services Layer:
  ├─> axios.js (base configuration)
  ├─> productService.js → Backend /api/products
  ├─> shippingService.js → Backend /api/shipping, /api/orders
  ├─> wishlistService.js → Backend /api/wishlist
  └─> adminApi.js → Backend /api/admin

Backend:
server.js
  ├─> config/db.js (PostgreSQL connection)
  ├─> models/index.js
  │    ├─> User.js
  │    ├─> Product.js
  │    ├─> Order.js
  │    ├─> OrderProduct.js
  │    ├─> Shipment.js
  │    └─> Wishlist.js
  └─> routes/index.js
       ├─> middleware/authMiddleware.js
       ├─> controllers/userController.js
       ├─> controllers/productController.js
       ├─> controllers/orderController.js
       ├─> controllers/paymentController.js
       ├─> controllers/shippingController.js
       ├─> controllers/wishlistController.js
       └─> controllers/adminController.js
```

---

## 📊 Summary

This e-commerce application follows a **clean architecture** with:

✅ **Clear separation of concerns**
- Frontend: UI components, state management, API calls
- Backend: Routes, controllers, models, middleware

✅ **Modular design**
- Reusable components
- Service layer for API calls
- Context for global state

✅ **Secure authentication**
- JWT tokens
- Password hashing
- Role-based access control

✅ **Scalable structure**
- Easy to add new features
- Well-organized file structure
- Clear data flow

✅ **Full-featured e-commerce**
- Product catalog
- Shopping cart
- Wishlist
- Order management
- Payment integration
- Admin dashboard
- User authentication

---

**Total Files**: 60+ files working together to create a complete e-commerce platform! 🎉
