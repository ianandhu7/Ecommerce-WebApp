import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { getOrderTracking, trackByNumber } from '../api/shippingService';
import toast from 'react-hot-toast';

const OrderTracking = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(false);
    const [searchQuery, setSearchQuery] = useState(orderId || '');

    console.log('OrderTracking component rendered', { orderId, searchQuery, loading, order });

    useEffect(() => {
        if (orderId) {
            fetchOrderTracking(orderId);
        }
    }, [orderId]);

    const fetchOrderTracking = async (id) => {
        setLoading(true);
        try {
            const data = await getOrderTracking(id);
            setOrder(data);
        } catch (error) {
            console.error('Error fetching order:', error);
            toast.error('Order not found');
        } finally {
            setLoading(false);
        }
    };

    const handleSearch = async (e) => {
        e.preventDefault();
        if (!searchQuery) return;

        setLoading(true);
        try {
            // First try as Order ID
            try {
                const data = await getOrderTracking(searchQuery);
                setOrder(data);
                navigate(`/track/${searchQuery}`);
                return;
            } catch {
                // Ignore error and try as tracking number
            }

            // Try as Tracking Number
            const shipment = await trackByNumber(searchQuery);
            if (shipment && shipment.orderId) {
                const data = await getOrderTracking(shipment.orderId);
                setOrder(data);
                navigate(`/track/${shipment.orderId}`);
            } else {
                throw new Error('Not found');
            }
        } catch (error) {
            console.error('Search error:', error);
            toast.error('Order or Tracking Number not found');
            setOrder(null);
        } finally {
            setLoading(false);
        }
    };

    const getStatusColor = (status) => {
        const colors = {
            pending: 'bg-yellow-100 text-yellow-800',
            processing: 'bg-blue-100 text-blue-800',
            shipped: 'bg-purple-100 text-purple-800',
            in_transit: 'bg-indigo-100 text-indigo-800',
            out_for_delivery: 'bg-orange-100 text-orange-800',
            delivered: 'bg-green-100 text-green-800',
            cancelled: 'bg-red-100 text-red-800'
        };
        return colors[status] || 'bg-gray-100 text-gray-800';
    };

    const getStatusIcon = (status) => {
        const icons = {
            pending: '📦',
            processing: '⚙️',
            shipped: '🚚',
            in_transit: '🚚',
            out_for_delivery: '🚛',
            delivered: '✅',
            cancelled: '❌'
        };
        return icons[status] || '📦';
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    return (
        <div className="min-h-screen bg-gray-50 py-12 px-4">
            <div className="max-w-4xl mx-auto">
                <h1 className="text-3xl font-bold mb-8 text-gray-800">Track Your Order</h1>

                {/* Search Form */}
                <div className="bg-white p-6 rounded-lg shadow-md mb-8">
                    <form onSubmit={handleSearch} className="flex gap-4">
                        <input
                            type="text"
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                            placeholder="Enter Order ID or Tracking Number"
                            className="flex-1 p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                        />
                        <button
                            type="submit"
                            className="bg-blue-600 text-white px-8 py-3 rounded-lg font-semibold hover:bg-blue-700 transition"
                        >
                            Track
                        </button>
                    </form>
                </div>

                {loading && (
                    <div className="text-center py-12">
                        <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
                        <p className="mt-4 text-gray-600">Loading order details...</p>
                    </div>
                )}

                {!loading && order && (
                    <div className="space-y-6">
                        {/* Order Header */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <div className="flex justify-between items-start mb-4">
                                <div>
                                    <h2 className="text-2xl font-bold text-gray-800">Order #{order.id}</h2>
                                    <p className="text-gray-600 mt-1">
                                        Placed on {formatDate(order.createdAt)}
                                    </p>
                                </div>
                                <span className={`px-4 py-2 rounded-full font-semibold ${getStatusColor(order.status)}`}>
                                    {getStatusIcon(order.status)} {order.status.toUpperCase()}
                                </span>
                            </div>

                            {order.trackingNumber && (
                                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                                    <p className="text-sm text-gray-600">Tracking Number</p>
                                    <p className="text-xl font-bold text-blue-800">{order.trackingNumber}</p>
                                    <p className="text-sm text-gray-600 mt-1">Carrier: {order.carrier}</p>
                                </div>
                            )}
                        </div>

                        {/* Tracking Timeline */}
                        {order.Shipment && order.Shipment.trackingEvents && (
                            <div className="bg-white p-6 rounded-lg shadow-md">
                                <h3 className="text-xl font-semibold mb-6">Tracking History</h3>
                                <div className="space-y-4">
                                    {order.Shipment.trackingEvents.map((event, index) => (
                                        <div key={index} className="flex gap-4">
                                            <div className="flex flex-col items-center">
                                                <div className={`w-4 h-4 rounded-full ${index === 0 ? 'bg-blue-600' : 'bg-gray-300'
                                                    }`}></div>
                                                {index < order.Shipment.trackingEvents.length - 1 && (
                                                    <div className="w-0.5 h-full bg-gray-300 mt-2"></div>
                                                )}
                                            </div>
                                            <div className="flex-1 pb-6">
                                                <p className="font-semibold text-gray-800">{event.description}</p>
                                                <p className="text-sm text-gray-600">{event.location}</p>
                                                <p className="text-xs text-gray-500 mt-1">
                                                    {formatDate(event.timestamp)}
                                                </p>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        )}

                        {/* Shipping Address */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Shipping Address</h3>
                            <div className="text-gray-700">
                                <p>{order.shippingAddress}</p>
                                <p>{order.shippingCity}, {order.shippingState} {order.shippingZip}</p>
                                <p>{order.shippingCountry}</p>
                                {order.shippingPhone && <p className="mt-2">Phone: {order.shippingPhone}</p>}
                            </div>
                        </div>

                        {/* Order Items */}
                        <div className="bg-white p-6 rounded-lg shadow-md">
                            <h3 className="text-xl font-semibold mb-4">Order Items</h3>
                            <div className="space-y-4">
                                {order.Products && order.Products.map((product) => (
                                    <div key={product.id} className="flex gap-4 items-center border-b pb-4">
                                        {/* Product Image */}
                                        <div className="flex-shrink-0 bg-gray-100 rounded-lg overflow-hidden" style={{ width: '6rem', height: '6rem' }}>
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                className="w-full h-full object-cover"
                                                onError={(e) => { e.target.src = 'https://placehold.co/100x100?text=No+Image'; }}
                                            />
                                        </div>
                                        {/* Product Details */}
                                        <div className="flex-1">
                                            <p className="font-semibold text-gray-800 text-lg">{product.name}</p>
                                            <p className="text-sm text-gray-600">
                                                Brand: {product.brand || 'N/A'}
                                            </p>
                                            <p className="text-sm text-gray-600">
                                                Quantity: {product.OrderProducts?.quantity || 1}
                                            </p>
                                        </div>
                                        {/* Price */}
                                        <div className="text-right">
                                            <p className="text-sm text-gray-600">Price</p>
                                            <p className="font-bold text-gray-800 text-lg">
                                                ${(product.price * (product.OrderProducts?.quantity || 1)).toFixed(2)}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="mt-4 pt-4 border-t">
                                <div className="flex justify-between text-gray-700 mb-2">
                                    <span>Subtotal</span>
                                    <span>${(order.total - order.shippingCost).toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-gray-700 mb-2">
                                    <span>Shipping ({order.shippingMethod})</span>
                                    <span>${order.shippingCost.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold text-gray-800">
                                    <span>Total</span>
                                    <span>${order.total.toFixed(2)}</span>
                                </div>
                            </div>
                        </div>

                        {order.estimatedDelivery && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                <p className="text-green-800 font-semibold">
                                    📅 Estimated Delivery: {formatDate(order.estimatedDelivery)}
                                </p>
                            </div>
                        )}
                    </div>
                )}

                {!loading && !order && searchQuery && (
                    <div className="bg-white p-12 rounded-lg shadow-md text-center">
                        <p className="text-gray-600 text-lg">No order found with ID: {searchQuery}</p>
                        <p className="text-gray-500 mt-2">Please check your order ID and try again</p>
                    </div>
                )}
            </div>
        </div>
    );
};

export default OrderTracking;
