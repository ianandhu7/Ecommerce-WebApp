import React, { useState, useEffect, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { getUserOrders } from '../api/shippingService';
import toast from 'react-hot-toast';

const OrderHistory = () => {
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all');
    const [showCancellationSuccess, setShowCancellationSuccess] = useState(false);
    const [cancelledOrderDetails, setCancelledOrderDetails] = useState(null);

    useEffect(() => {
        if (!user) {
            toast.error('Please log in to view your orders');
            navigate('/login');
            return;
        }
        fetchOrders();
    }, [user, navigate]);

    const fetchOrders = async () => {
        if (!user || !user.id) {
            console.error('No user found or user ID missing');
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            console.log('Fetching orders for user ID:', user.id);
            const response = await getUserOrders(user.id);
            console.log('Orders fetched:', response);
            setOrders(response);
        } catch (error) {
            console.error('Error fetching orders:', error);
            toast.error('Failed to load orders');
        } finally {
            setLoading(false);
        }
    };

    const handleTrackOrder = (orderId) => {
        navigate(`/track/${orderId}`);
    };

    const handleCancelOrder = async (orderId) => {
        if (!window.confirm('Are you sure you want to cancel this order?')) {
            return;
        }

        try {
            const orderToCancel = orders.find(order => order.id === orderId);
            console.log('Attempting to cancel order:', orderId, orderToCancel);

            // Call the backend API to cancel the order
            const response = await fetch(`http://localhost:5002/api/orders/${orderId}/cancel`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            console.log('Cancel response status:', response.status);
            const data = await response.json();
            console.log('Cancel response data:', data);

            if (!response.ok) {
                throw new Error(data.message || 'Failed to cancel order');
            }

            // Update local state to reflect cancellation
            setOrders(orders.map(order =>
                order.id === orderId
                    ? { ...order, status: 'cancelled' }
                    : order
            ));

            setCancelledOrderDetails(orderToCancel);
            setShowCancellationSuccess(true);
            toast.success('Order cancelled successfully');
        } catch (error) {
            console.error('Error cancelling order:', error);
            toast.error(error.message || 'Failed to cancel order');
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-[#FFF9C4] text-[#854D0E]',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric'
        });
    };

    const filteredOrders = orders.filter(order => {
        if (filter === 'all') return true;
        if (filter === 'successful') return order.status === 'delivered';
        if (filter === 'pending') return ['pending', 'processing', 'shipped'].includes(order.status);
        return order.status === filter;
    });

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 pt-20 flex justify-center items-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-white py-12">
            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8">
                <h1 className="text-3xl font-bold text-gray-900 mb-8">My Orders</h1>

                {/* Cancellation Success Modal */}
                {showCancellationSuccess && cancelledOrderDetails && (
                    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                        <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 transform transition-all">
                            <div className="flex justify-center mb-6">
                                <div className="bg-green-100 rounded-full p-4">
                                    <svg className="w-16 h-16 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                                    </svg>
                                </div>
                            </div>

                            <h2 className="text-2xl font-bold text-center text-gray-900 mb-2">
                                Cancellation Successful
                            </h2>
                            <p className="text-center text-gray-600 mb-6">
                                Your order has been cancelled successfully
                            </p>

                            <div className="bg-gray-50 rounded-lg p-4 mb-6 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Order Number:</span>
                                    <span className="font-semibold text-gray-900">#{cancelledOrderDetails.trackingNumber || cancelledOrderDetails.id}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Order Total:</span>
                                    <span className="font-semibold text-gray-900">${parseFloat(cancelledOrderDetails.total).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-600">Status:</span>
                                    <span className="px-2 py-1 bg-red-100 text-red-800 rounded-full text-xs font-medium">Cancelled</span>
                                </div>
                            </div>

                            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6">
                                <p className="text-sm text-blue-800">
                                    💳 Refund will be processed within 5-7 business days to your original payment method.
                                </p>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    onClick={() => {
                                        setShowCancellationSuccess(false);
                                        setCancelledOrderDetails(null);
                                    }}
                                    className="flex-1 px-4 py-3 bg-gray-900 text-white rounded-lg font-semibold hover:bg-gray-800 transition-colors"
                                >
                                    Continue Shopping
                                </button>
                                <button
                                    onClick={() => {
                                        setShowCancellationSuccess(false);
                                        setCancelledOrderDetails(null);
                                    }}
                                    className="flex-1 px-4 py-3 border border-gray-300 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition-colors"
                                >
                                    Close
                                </button>
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Filter Tabs */}
                <div className="flex gap-8 mb-8 border-b border-gray-200 overflow-x-auto">
                    {['All', 'Successful', 'Cancelled', 'Pending'].map((label) => (
                        <button
                            key={label}
                            onClick={() => setFilter(label.toLowerCase())}
                            className={`pb-4 text-sm font-medium transition-colors relative whitespace-nowrap ${filter === label.toLowerCase()
                                ? 'text-gray-900'
                                : 'text-gray-500 hover:text-gray-700'
                                }`}
                        >
                            {label}
                            {filter === label.toLowerCase() && (
                                <div className="absolute bottom-0 left-0 w-full h-0.5 bg-gray-900"></div>
                            )}
                        </button>
                    ))}
                </div>

                <div className="space-y-8">
                    {filteredOrders.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-lg border border-dashed border-gray-300">
                            <div className="mx-auto h-12 w-12 text-gray-400 mb-4">
                                <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
                                </svg>
                            </div>
                            <h3 className="mt-2 text-sm font-medium text-gray-900">No orders found</h3>
                            <p className="mt-1 text-sm text-gray-500">Start shopping to create your first order.</p>
                            <div className="mt-6">
                                <button
                                    onClick={() => navigate('/products')}
                                    className="inline-flex items-center px-4 py-2 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-gray-900 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                                >
                                    Start Shopping
                                </button>
                            </div>
                        </div>
                    ) : (
                        filteredOrders.map((order) => (
                            <div key={order.id} className="bg-white rounded-lg border border-gray-200 overflow-hidden">
                                <div className="p-6 border-b border-gray-100 flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div>
                                        <h3 className="text-lg font-bold text-gray-900">
                                            Order #{order.trackingNumber || order.id}
                                        </h3>
                                        <p className="text-sm text-gray-500 mt-1">
                                            Placed on {formatDate(order.createdAt)}
                                        </p>
                                    </div>
                                    <div className="flex items-center gap-4 flex-wrap">
                                        <span className={`px-3 py-1 rounded-sm text-xs font-medium capitalize ${getStatusColor(order.status)}`}>
                                            {order.status}
                                        </span>

                                        {['pending', 'processing'].includes(order.status) && (
                                            <button
                                                onClick={() => handleCancelOrder(order.id)}
                                                className="text-sm text-gray-600 hover:text-gray-900 font-medium transition-colors"
                                            >
                                                Cancel Order
                                            </button>
                                        )}

                                        <button
                                            onClick={() => handleTrackOrder(order.id)}
                                            className="px-4 py-2 bg-black text-white text-sm font-medium rounded hover:bg-gray-800 transition-colors shadow-sm"
                                        >
                                            Track Order
                                        </button>
                                    </div>
                                </div>

                                <div className="p-6 border-b border-gray-100">
                                    {order.Products && order.Products.length > 0 ? (
                                        order.Products.map((product) => (
                                            <div key={product.id} className="flex gap-6 mb-6 last:mb-0">
                                                <div className="w-24 h-24 flex-shrink-0 bg-gray-100 rounded-md overflow-hidden">
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="w-full h-full object-cover object-center"
                                                    />
                                                </div>
                                                <div className="flex-1">
                                                    <h4 className="text-base font-semibold text-gray-900">{product.name}</h4>
                                                    <p className="text-sm text-gray-500 mt-1">Qty: {product.OrderProducts?.quantity || 1}</p>
                                                    <p className="text-sm font-bold text-gray-900 mt-2">${product.price}</p>
                                                </div>
                                            </div>
                                        ))
                                    ) : (
                                        <p className="text-sm text-gray-400">No product details available.</p>
                                    )}
                                </div>

                                {order.Products && order.Products.length > 0 && (
                                    <div className="p-6 grid grid-cols-1 md:grid-cols-3 gap-8">
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Address</h4>
                                            <p className="text-sm text-gray-600 leading-relaxed">
                                                {order.shippingAddress}<br />
                                                {order.shippingCity}, {order.shippingState} {order.shippingZip}
                                            </p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Shipping Method</h4>
                                            <p className="text-sm text-gray-600">{order.shippingMethod || 'Standard'}</p>
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-900 mb-2">Total Amount</h4>
                                            <p className="text-xl font-bold text-gray-900">${parseFloat(order.total).toFixed(2)}</p>
                                        </div>
                                    </div>
                                )}

                                {order.Products && order.Products.length > 0 && (
                                    <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center gap-3">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                        </svg>
                                        <span className="text-sm text-gray-600">
                                            Estimated Delivery: <span className="font-medium text-gray-900">{order.estimatedDelivery ? formatDate(order.estimatedDelivery) : 'TBD'}</span>
                                        </span>
                                    </div>
                                )}
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
};

export default OrderHistory;
