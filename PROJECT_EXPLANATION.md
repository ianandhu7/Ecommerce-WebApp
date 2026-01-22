# SOULSTYLE - E-Commerce Web Application
## Project Overview & Technical Explanation

### 1. Project Summary
**SOULSTYLE** is a full-stack e-commerce web application designed for selling premium footwear and fashion items. It features a modern, responsive user interface, a robust backend API, and a comprehensive admin dashboard for managing products, orders, and customers.

### 2. Technology Stack

#### **Frontend (Client-Side)**
*   **Framework**: React.js (v19) - Used for building a dynamic, single-page application (SPA).
*   **Build Tool**: Vite - Ensures fast development server start-up and optimized production builds.
*   **Styling**: 
    *   **Tailwind CSS**: For utility-first, responsive styling.
    *   **Vanilla CSS**: For custom animations and specific component styles.
*   **Routing**: React Router DOM (v7) - Handles navigation between pages (Home, Shop, Cart, etc.) without reloading.
*   **State Management**: React Context API - Manages global state for:
    *   `AuthContext`: User login status and profile data.
    *   `CartContext`: Shopping cart items and totals.
    *   `WishlistContext`: User's saved items.
*   **HTTP Client**: Axios - Handles API requests to the backend.
*   **Icons**: React Icons (FontAwesome, Material Design, etc.).
*   **Notifications**: React Hot Toast - Displays success/error popups.
*   **Charts**: Recharts - Visualizes data in the Admin Dashboard.

#### **Backend (Server-Side)**
*   **Runtime**: Node.js - Executes JavaScript on the server.
*   **Framework**: Express.js - Handles routing, middleware, and API endpoints.
*   **Database**: PostgreSQL (via Sequelize ORM) - Relational database for storing users, products, orders, etc.
*   **ORM**: Sequelize - Allows interacting with the database using JavaScript objects instead of raw SQL queries.
*   **Authentication**: JSON Web Tokens (JWT) - Securely transmits information between parties as a JSON object.
*   **Security**: 
    *   `bcryptjs`: Hashes passwords before storing them in the database.
    *   `cors`: Manages Cross-Origin Resource Sharing policies.
*   **Payments**: Stripe & Razorpay - Integrated payment gateways for processing transactions.
*   **Email**: Nodemailer - Sends email notifications (e.g., order confirmation).

### 3. Architecture & Data Flow

The application follows a **Client-Server Architecture**:

1.  **User Interaction**: The user interacts with the React Frontend (e.g., clicks "Add to Cart").
2.  **API Request**: The Frontend sends an HTTP request (GET, POST, PUT, DELETE) via Axios to the Backend API (e.g., `POST /api/cart/add`).
3.  **Request Processing**: The Express Backend receives the request.
    *   **Middleware**: Checks if the user is authenticated (using JWT).
    *   **Controller**: Executes the business logic (e.g., "Find product", "Check stock").
4.  **Database Operation**: The Controller uses Sequelize models (`User`, `Product`, `Order`) to query or update the PostgreSQL database.
5.  **Response**: The Backend sends a JSON response back to the Frontend (e.g., `{ success: true, cartItem: ... }`).
6.  **UI Update**: The Frontend receives the data and updates the UI (e.g., Cart counter increases).

### 4. Key Features & Modules

#### **A. User Features**
*   **Authentication**: Sign Up, Login, Logout, Password Reset.
*   **Product Browsing**: Filter by category (Men/Women), search functionality, detailed product views.
*   **Shopping Experience**: 
    *   **Cart**: Add/remove items, adjust quantities.
    *   **Wishlist**: Save items for later.
    *   **Checkout**: Shipping address form, payment integration.
*   **Order Management**: View order history, track order status.

#### **B. Admin Dashboard**
*   **Overview**: Visual charts for sales, revenue, and user growth.
*   **Product Management**: Add, edit, or delete products.
*   **Order Management**: View all orders, update shipping status (Processing -> Shipped -> Delivered).
*   **Customer Management**: View customer details and purchase history.

### 5. Folder Structure Explained

#### **Frontend (`/frontend/src`)**
*   `components/`: Reusable UI parts (Navbar, Footer, ProductCard, Button).
*   `pages/`: Full page views (Home, Login, ProductList, AdminDashboard).
*   `context/`: Global state providers (AuthContext, CartContext).
*   `api/`: Centralized API service functions.
*   `assets/`: Images, fonts, and static files.

#### **Backend (`/backend`)**
*   `controllers/`: Logic for handling requests (authController, productController).
*   `models/`: Database schemas defined with Sequelize (User.js, Product.js).
*   `routes/`: API route definitions mapping URLs to controllers.
*   `middleware/`: Functions that run before controllers (authMiddleware).
*   `config/`: Configuration files (database connection).

### 6. How to Run the Project

1.  **Database**: Ensure PostgreSQL is running and configured in `.env`.
2.  **Backend**:
    ```bash
    cd backend
    npm start
    ```
    *Runs on http://localhost:5002*
3.  **Frontend**:
    ```bash
    cd frontend
    npm run dev
    ```
    *Runs on http://localhost:5173*

---
*This document serves as a technical guide to understanding the SOULSTYLE e-commerce platform.*
