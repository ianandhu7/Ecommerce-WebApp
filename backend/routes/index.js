const express = require('express');
const router = express.Router();
const { getAllProducts, seedProducts, getProductSuggestions } = require('../controllers/productController');
const { registerUser, loginUser, forgotPassword, resetPassword, getProfile, updateProfile, changePassword } = require('../controllers/userController');

const { createOrder, getUserOrders, getOrderTracking, updateOrderStatus, cancelOrder } = require('../controllers/orderController');
const { getProductById } = require('../controllers/productController');

const { createPaymentOrder, verifyPayment, createStripePaymentIntent } = require('../controllers/paymentController');

const {
    getShippingMethods,
    calculateShipping,
    getTrackingInfo,
    trackByNumber,
    updateShipmentStatus
} = require('../controllers/shippingController');

const {
    getUserWishlist,
    addToWishlist,
    removeFromWishlist,
    removeByUserAndProduct
} = require('../controllers/wishlistController');

const {
    getUsersSummary,
    getUserDetail,
    getUsersGrowth,
    getTopCustomers,
    getCategoryStats,
    createUser,
    updateUserRole,
    updateUserStatus,
    deleteUser,
    getAllUsers
} = require('../controllers/adminController');

const { authMiddleware, adminMiddleware } = require('../middleware/authMiddleware');

// Product Routes
router.get('/products/suggestions', getProductSuggestions); // Auto-suggestion endpoint (must be before :id route)
router.get('/products', getAllProducts);
router.get('/products/:id', getProductById);
router.get('/seed', seedProducts); // Temporary route to seed DB

// Shipping Routes
router.get('/shipping/methods', getShippingMethods);
router.post('/shipping/calculate', calculateShipping);
router.get('/shipping/track-number/:trackingNumber', trackByNumber);
router.put('/shipping/:orderId/status', updateShipmentStatus);

// Order Routes
router.post('/orders', createOrder);
router.get('/orders/:userId', getUserOrders);
router.get('/orders/:orderId/tracking', getOrderTracking);
router.put('/orders/:orderId/status', updateOrderStatus);
router.put('/orders/:orderId/cancel', cancelOrder);

// Payment Routes
router.post('/payment/create', createPaymentOrder);
router.post('/payment/verify', verifyPayment);
router.post('/payment/stripe/create-intent', createStripePaymentIntent);

// Auth Routes
router.post('/auth/register', registerUser);
router.post('/auth/login', loginUser);
router.post('/auth/forgot-password', forgotPassword);
router.post('/auth/reset-password', resetPassword);

// Protected User Routes (Requires Authentication)
router.get('/user/profile', authMiddleware, getProfile);
router.put('/user/profile', authMiddleware, updateProfile);
router.put('/user/password', authMiddleware, changePassword);

// Wishlist Routes
router.get('/wishlist/:userId', getUserWishlist);
router.post('/wishlist', addToWishlist);
router.delete('/wishlist/:id', removeFromWishlist);
router.post('/wishlist/remove', removeByUserAndProduct);

// ===== ADMIN ROUTES (Requires Admin Role) =====

// User Analytics
router.get('/admin/users-summary', authMiddleware, adminMiddleware, getUsersSummary);
router.get('/admin/user/:id', authMiddleware, adminMiddleware, getUserDetail);

// Global Analytics
router.get('/admin/analytics/users-growth', authMiddleware, adminMiddleware, getUsersGrowth);
router.get('/admin/analytics/top-customers', authMiddleware, adminMiddleware, getTopCustomers);
router.get('/admin/analytics/category-stats', authMiddleware, adminMiddleware, getCategoryStats);

// User Management (CRUD)
router.get('/admin/users', authMiddleware, adminMiddleware, getAllUsers);
router.post('/admin/users', authMiddleware, adminMiddleware, createUser);
router.put('/admin/users/:id/role', authMiddleware, adminMiddleware, updateUserRole);
router.put('/admin/users/:id/status', authMiddleware, adminMiddleware, updateUserStatus);
router.delete('/admin/users/:id', authMiddleware, adminMiddleware, deleteUser);

module.exports = router;

