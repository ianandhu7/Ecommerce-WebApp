import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import Navbar from './components/Navbar';
import Footer from './components/Footer';
import Home from './pages/Home';
import ProductList from './pages/ProductList';
import Product from './pages/Product';
import Cart from './pages/Cart';
import Wishlist from './pages/Wishlist';
import Login from './pages/Login';
import Register from './pages/Register';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import Checkout from './pages/Checkout';
import OrderSuccess from './pages/OrderSuccess';
import OrderTracking from './pages/OrderTracking';
import OrderHistory from './pages/OrderHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminCustomers from './pages/AdminCustomers';
import AdminCustomerDetail from './pages/AdminCustomerDetail';
import New from './pages/New';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { WishlistProvider } from './context/WishlistContext';
import AdminRoute from './components/AdminRoute';
import './App.css';

function App() {
  return (
    <AuthProvider>
      <CartProvider>
        <WishlistProvider>
          <Router>
            <div className="App min-h-screen bg-gray-100">
              <Navbar />
              <div style={{ paddingTop: '160px' }}>
                <Routes>
                  <Route path="/" element={<Home />} />
                  <Route path="/new" element={<New />} />
                  <Route path="/products" element={<ProductList />} />
                  <Route path="/products/:id" element={<Product />} />
                  <Route path="/cart" element={<Cart />} />
                  <Route path="/wishlist" element={<Wishlist />} />
                  <Route path="/login" element={<Login />} />
                  <Route path="/register" element={<Register />} />
                  <Route path="/forgot-password" element={<ForgotPassword />} />
                  <Route path="/reset-password" element={<ResetPassword />} />
                  <Route path="/checkout" element={<Checkout />} />
                  <Route path="/order-success/:orderId" element={<OrderSuccess />} />
                  <Route path="/orders" element={<OrderHistory />} />
                  <Route path="/track" element={<OrderTracking />} />
                  <Route path="/track/:orderId" element={<OrderTracking />} />

                  {/* Admin Routes */}
                  <Route path="/admin/dashboard" element={
                    <AdminRoute>
                      <AdminDashboard />
                    </AdminRoute>
                  } />
                  <Route path="/admin/customers" element={
                    <AdminRoute>
                      <AdminCustomers />
                    </AdminRoute>
                  } />
                  <Route path="/admin/customer/:id" element={
                    <AdminRoute>
                      <AdminCustomerDetail />
                    </AdminRoute>
                  } />
                </Routes>
              </div>
              <Footer />
              <Toaster position="bottom-right" />
            </div>
          </Router>
        </WishlistProvider>
      </CartProvider>
    </AuthProvider>
  );
}

export default App;
