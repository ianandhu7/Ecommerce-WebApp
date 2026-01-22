import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import axios from 'axios';
import toast from 'react-hot-toast';
import { loadRazorpay } from '../utils/razorpay';
import { getShippingMethods } from '../api/shippingService';
import StripePayment from '../components/StripePayment';
import { FaTimes } from 'react-icons/fa';

const Checkout = () => {
    const { cart, getCartTotal, clearCart } = useContext(CartContext);
    const { user } = useContext(AuthContext);
    const navigate = useNavigate();

    const [shippingData, setShippingData] = useState({
        shippingAddress: '',
        shippingCity: '',
        shippingState: '',
        shippingZip: '',
        shippingCountry: 'USA',
        shippingPhone: ''
    });

    const [shippingMethods, setShippingMethods] = useState([]);
    const [selectedShippingMethod, setSelectedShippingMethod] = useState(null);
    const [loading, setLoading] = useState(false);
    const [paymentMethod, setPaymentMethod] = useState('razorpay');
    const [showStripeModal, setShowStripeModal] = useState(false);

    const cartTotal = getCartTotal();
    const shippingCost = selectedShippingMethod?.cost || 0;
    const finalTotal = cartTotal + shippingCost;

    useEffect(() => {
        const fetchShippingMethods = async () => {
            try {
                const methods = await getShippingMethods(cartTotal);
                setShippingMethods(methods);
                if (methods.length > 0) {
                    setSelectedShippingMethod(methods[0]);
                }
            } catch (error) {
                console.error('Error fetching shipping methods:', error);
                toast.error('Failed to load shipping methods');
            }
        };

        if (cartTotal > 0) {
            fetchShippingMethods();
        }
    }, [cartTotal]);

    const createOrderInDb = async (paymentDetails) => {
        const orderData = {
            userId: user.id || 1,
            products: cart.map(item => ({ id: item.id, quantity: item.quantity })),
            total: finalTotal,
            ...shippingData,
            shippingMethod: selectedShippingMethod.id,
            shippingCost: shippingCost,
            paymentMethod: paymentMethod,
            paymentDetails: paymentDetails
        };

        const orderResponse = await axios.post('http://localhost:5002/api/orders', orderData);
        return orderResponse.data.order;
    };

    const handleRazorpayPayment = async () => {
        setLoading(true);

        const res = await loadRazorpay();
        if (!res) {
            toast.error('Razorpay SDK failed to load. Are you online?');
            setLoading(false);
            return;
        }

        try {
            const result = await axios.post('http://localhost:5002/api/payment/create', {
                amount: finalTotal
            });

            if (!result) {
                toast.error('Server error. Are you online?');
                setLoading(false);
                return;
            }

            const { amount, id: order_id, currency } = result.data;

            const options = {
                key: import.meta.env.VITE_RAZORPAY_KEY_ID || "your_razorpay_key_id",
                amount: amount.toString(),
                currency: currency,
                name: "SoulStyle",
                description: "Order Payment",
                order_id: order_id,
                handler: async function (response) {
                    const data = {
                        razorpay_payment_id: response.razorpay_payment_id,
                        razorpay_order_id: response.razorpay_order_id,
                        razorpay_signature: response.razorpay_signature
                    };

                    const verifyRes = await axios.post('http://localhost:5002/api/payment/verify', data);

                    if (verifyRes.data.message === 'Payment verified successfully') {
                        const order = await createOrderInDb(data);
                        clearCart();
                        toast.success(`Order Placed! Tracking #: ${order.trackingNumber}`);
                        navigate(`/order-success/${order.id}`);
                    } else {
                        toast.error('Payment verification failed');
                    }
                    setLoading(false);
                },
                prefill: {
                    name: user?.name || "Customer",
                    email: user?.email || "customer@example.com",
                    contact: shippingData.shippingPhone || "9999999999"
                },
                notes: {
                    address: shippingData.shippingAddress
                },
                theme: {
                    color: "#000000"
                }
            };

            const paymentObject = new window.Razorpay(options);
            paymentObject.open();

        } catch (error) {
            console.error('Error processing payment:', error);
            toast.error('Payment failed');
            setLoading(false);
        }
    };

    const handleStripeSuccess = async (paymentIntent) => {
        try {
            const order = await createOrderInDb({
                paymentIntentId: paymentIntent.id,
                status: paymentIntent.status
            });
            setShowStripeModal(false);
            clearCart();
            navigate(`/order-success/${order.id}`);
        } catch (error) {
            console.error('Error creating order after Stripe payment:', error);
            toast.error('Payment successful but failed to create order. Please contact support.');
        }
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        if (!user) {
            toast.error('Please login to place an order');
            navigate('/login');
            return;
        }

        if (!selectedShippingMethod) {
            toast.error('Please select a shipping method');
            return;
        }

        if (paymentMethod === 'razorpay') {
            handleRazorpayPayment();
        } else if (paymentMethod === 'stripe') {
            setShowStripeModal(true);
        }
    };

    if (cart.length === 0) {
        return (
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '4rem 2rem'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    marginBottom: '1.5rem',
                    color: '#000',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}>Your cart is empty</h2>
                <button
                    onClick={() => navigate('/products')}
                    style={{
                        padding: '0.75rem 2rem',
                        backgroundColor: '#000',
                        color: 'white',
                        border: 'none',
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        cursor: 'pointer',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}
                >
                    Continue Shopping
                </button>
            </div>
        );
    }

    return (
        <div className="checkout-container" style={{
            minHeight: '100vh',
            backgroundColor: '#F5F5F5',
            padding: '6rem 2rem 4rem'
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .checkout-container {
                        padding: 5rem 1rem 3rem !important;
                    }
                }
                @media (max-width: 480px) {
                    .checkout-container {
                        padding: 5rem 0.75rem 2rem !important;
                    }
                }
            `}</style>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '300',
                    marginBottom: '3rem',
                    color: '#000',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}>Checkout</h1>

                <div className="checkout-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 450px',
                    gap: '3rem'
                }}>
                    <style>{`
                        @media (max-width: 1024px) {
                            .checkout-grid {
                                grid-template-columns: 1fr 380px !important;
                                gap: 2rem !important;
                            }
                        }
                        @media (max-width: 768px) {
                            .checkout-grid {
                                grid-template-columns: 1fr !important;
                                gap: 2rem !important;
                            }
                        }
                    `}</style>
                    {/* Left Column - Forms */}
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
                        {/* Shipping Address */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '500',
                                marginBottom: '1.5rem',
                                color: '#000',
                                letterSpacing: '0.05em'
                            }}>Shipping Address</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr', gap: '1.25rem' }}>
                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: '#000',
                                        marginBottom: '0.5rem'
                                    }}>Street Address</label>
                                    <input
                                        type="text"
                                        value={shippingData.shippingAddress}
                                        onChange={(e) => setShippingData({ ...shippingData, shippingAddress: e.target.value })}
                                        placeholder="123 Main Street"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            border: '1px solid #E5E5E5',
                                            fontSize: '0.875rem',
                                            outline: 'none',
                                            transition: 'border-color 0.2s'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#000'}
                                        onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                                        required
                                    />
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: '#000',
                                            marginBottom: '0.5rem'
                                        }}>City</label>
                                        <input
                                            type="text"
                                            value={shippingData.shippingCity}
                                            onChange={(e) => setShippingData({ ...shippingData, shippingCity: e.target.value })}
                                            placeholder="New York"
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                border: '1px solid #E5E5E5',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#000'}
                                            onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: '#000',
                                            marginBottom: '0.5rem'
                                        }}>State</label>
                                        <input
                                            type="text"
                                            value={shippingData.shippingState}
                                            onChange={(e) => setShippingData({ ...shippingData, shippingState: e.target.value })}
                                            placeholder="NY"
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                border: '1px solid #E5E5E5',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#000'}
                                            onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                                            required
                                        />
                                    </div>
                                </div>

                                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: '#000',
                                            marginBottom: '0.5rem'
                                        }}>ZIP Code</label>
                                        <input
                                            type="text"
                                            value={shippingData.shippingZip}
                                            onChange={(e) => setShippingData({ ...shippingData, shippingZip: e.target.value })}
                                            placeholder="10001"
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                border: '1px solid #E5E5E5',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#000'}
                                            onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                                            required
                                        />
                                    </div>

                                    <div>
                                        <label style={{
                                            display: 'block',
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: '#000',
                                            marginBottom: '0.5rem'
                                        }}>Country</label>
                                        <input
                                            type="text"
                                            value={shippingData.shippingCountry}
                                            onChange={(e) => setShippingData({ ...shippingData, shippingCountry: e.target.value })}
                                            placeholder="USA"
                                            style={{
                                                width: '100%',
                                                padding: '0.875rem',
                                                border: '1px solid #E5E5E5',
                                                fontSize: '0.875rem',
                                                outline: 'none'
                                            }}
                                            onFocus={(e) => e.target.style.borderColor = '#000'}
                                            onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                                            required
                                        />
                                    </div>
                                </div>

                                <div>
                                    <label style={{
                                        display: 'block',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        color: '#000',
                                        marginBottom: '0.5rem'
                                    }}>Phone Number</label>
                                    <input
                                        type="tel"
                                        value={shippingData.shippingPhone}
                                        onChange={(e) => setShippingData({ ...shippingData, shippingPhone: e.target.value })}
                                        placeholder="(555) 123-4567"
                                        style={{
                                            width: '100%',
                                            padding: '0.875rem',
                                            border: '1px solid #E5E5E5',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#000'}
                                        onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                                        required
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Shipping Method */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '500',
                                marginBottom: '1.5rem',
                                color: '#000',
                                letterSpacing: '0.05em'
                            }}>Shipping Method</h2>

                            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                                {shippingMethods.map((method) => (
                                    <div
                                        key={method.id}
                                        onClick={() => setSelectedShippingMethod(method)}
                                        style={{
                                            padding: '1.25rem',
                                            border: selectedShippingMethod?.id === method.id ? '2px solid #000' : '1px solid #E5E5E5',
                                            cursor: 'pointer',
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            transition: 'all 0.2s'
                                        }}
                                        onMouseEnter={(e) => {
                                            if (selectedShippingMethod?.id !== method.id) {
                                                e.currentTarget.style.borderColor = '#999';
                                            }
                                        }}
                                        onMouseLeave={(e) => {
                                            if (selectedShippingMethod?.id !== method.id) {
                                                e.currentTarget.style.borderColor = '#E5E5E5';
                                            }
                                        }}
                                    >
                                        <div>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: '#000',
                                                marginBottom: '0.25rem'
                                            }}>{method.name}</div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#666'
                                            }}>{method.estimatedDays}</div>
                                        </div>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            color: method.isFree ? '#10B981' : '#000'
                                        }}>
                                            {method.isFree ? 'FREE' : `$${method.cost.toFixed(2)}`}
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Payment Method */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '500',
                                marginBottom: '1.5rem',
                                color: '#000',
                                letterSpacing: '0.05em'
                            }}>Payment Method</h2>

                            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                                <div
                                    onClick={() => setPaymentMethod('razorpay')}
                                    style={{
                                        padding: '1.25rem',
                                        border: paymentMethod === 'razorpay' ? '2px solid #000' : '1px solid #E5E5E5',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (paymentMethod !== 'razorpay') {
                                            e.currentTarget.style.borderColor = '#999';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (paymentMethod !== 'razorpay') {
                                            e.currentTarget.style.borderColor = '#E5E5E5';
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Razorpay</span>
                                </div>

                                <div
                                    onClick={() => setPaymentMethod('stripe')}
                                    style={{
                                        padding: '1.25rem',
                                        border: paymentMethod === 'stripe' ? '2px solid #000' : '1px solid #E5E5E5',
                                        cursor: 'pointer',
                                        textAlign: 'center',
                                        transition: 'all 0.2s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (paymentMethod !== 'stripe') {
                                            e.currentTarget.style.borderColor = '#999';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (paymentMethod !== 'stripe') {
                                            e.currentTarget.style.borderColor = '#E5E5E5';
                                        }
                                    }}
                                >
                                    <span style={{ fontSize: '0.875rem', fontWeight: '500' }}>Stripe</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Order Summary */}
                    <div>
                        <div className="order-summary-sticky" style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            position: 'sticky',
                            top: '100px'
                        }}>
                            <style>{`
                                @media (max-width: 768px) {
                                    .order-summary-sticky {
                                        position: static !important;
                                    }
                                }
                            `}</style>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '500',
                                marginBottom: '1.5rem',
                                color: '#000',
                                letterSpacing: '0.05em'
                            }}>Order Summary</h2>

                            {/* Cart Items */}
                            <div style={{
                                maxHeight: '300px',
                                overflowY: 'auto',
                                marginBottom: '1.5rem',
                                paddingRight: '0.5rem'
                            }}>
                                {cart.map((item) => (
                                    <div key={item.id} style={{
                                        display: 'flex',
                                        gap: '1rem',
                                        marginBottom: '1rem',
                                        paddingBottom: '1rem',
                                        borderBottom: '1px solid #F5F5F5'
                                    }}>
                                        <div style={{
                                            width: '60px',
                                            height: '60px',
                                            backgroundColor: '#F9FAFB',
                                            flexShrink: 0,
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center'
                                        }}>
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                style={{
                                                    width: '100%',
                                                    height: '100%',
                                                    objectFit: 'cover'
                                                }}
                                                onError={(e) => {
                                                    e.target.style.display = 'none';
                                                }}
                                            />
                                        </div>
                                        <div style={{ flex: 1 }}>
                                            <div style={{
                                                fontSize: '0.875rem',
                                                fontWeight: '500',
                                                color: '#000',
                                                marginBottom: '0.25rem'
                                            }}>{item.name}</div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#666',
                                                marginBottom: '0.25rem'
                                            }}>{item.brand}</div>
                                            <div style={{
                                                fontSize: '0.75rem',
                                                color: '#666'
                                            }}>Qty: {item.quantity}</div>
                                        </div>
                                        <div style={{
                                            fontSize: '0.875rem',
                                            fontWeight: '500',
                                            color: '#000'
                                        }}>
                                            ${(item.price * item.quantity).toFixed(2)}
                                        </div>
                                    </div>
                                ))}
                            </div>

                            {/* Totals */}
                            <div style={{
                                paddingTop: '1.5rem',
                                borderTop: '1px solid #E5E5E5'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.75rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{ color: '#666' }}>Subtotal</span>
                                    <span style={{ color: '#000', fontWeight: '500' }}>${cartTotal.toFixed(2)}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.875rem'
                                }}>
                                    <span style={{ color: '#666' }}>Shipping</span>
                                    <span style={{
                                        color: selectedShippingMethod?.isFree ? '#10B981' : '#000',
                                        fontWeight: '500'
                                    }}>
                                        {selectedShippingMethod?.isFree ? 'FREE' : `$${shippingCost.toFixed(2)}`}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingTop: '1.5rem',
                                    borderTop: '1px solid #E5E5E5',
                                    fontSize: '1.125rem',
                                    fontWeight: '600',
                                    marginBottom: '2rem'
                                }}>
                                    <span style={{ color: '#000' }}>Total</span>
                                    <span style={{ color: '#000' }}>${finalTotal.toFixed(2)}</span>
                                </div>

                                {/* Place Order Button */}
                                <button
                                    onClick={handleSubmit}
                                    disabled={loading || !selectedShippingMethod}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        backgroundColor: loading || !selectedShippingMethod ? '#E5E5E5' : '#000',
                                        color: loading || !selectedShippingMethod ? '#999' : 'white',
                                        border: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        cursor: loading || !selectedShippingMethod ? 'not-allowed' : 'pointer',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s'
                                    }}
                                    onMouseEnter={(e) => {
                                        if (!loading && selectedShippingMethod) {
                                            e.currentTarget.style.backgroundColor = '#333';
                                        }
                                    }}
                                    onMouseLeave={(e) => {
                                        if (!loading && selectedShippingMethod) {
                                            e.currentTarget.style.backgroundColor = '#000';
                                        }
                                    }}
                                >
                                    {loading ? 'Processing...' : 'Place Order'}
                                </button>

                                {!selectedShippingMethod && (
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: '#EF4444',
                                        textAlign: 'center',
                                        marginTop: '0.75rem'
                                    }}>
                                        Please select a shipping method
                                    </p>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Stripe Payment Modal */}
            {showStripeModal && (
                <div style={{
                    position: 'fixed',
                    inset: 0,
                    backgroundColor: 'rgba(0,0,0,0.5)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    zIndex: 50,
                    padding: '1rem'
                }}>
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        maxWidth: '500px',
                        width: '100%',
                        padding: '2rem',
                        position: 'relative'
                    }}>
                        <button
                            onClick={() => setShowStripeModal(false)}
                            style={{
                                position: 'absolute',
                                top: '1rem',
                                right: '1rem',
                                background: 'none',
                                border: 'none',
                                cursor: 'pointer',
                                padding: '0.5rem'
                            }}
                        >
                            <FaTimes style={{ fontSize: '1.25rem', color: '#666' }} />
                        </button>

                        <h2 style={{
                            fontSize: '1.5rem',
                            fontWeight: '500',
                            marginBottom: '0.5rem',
                            color: '#000'
                        }}>Stripe Payment</h2>
                        <p style={{
                            fontSize: '0.875rem',
                            color: '#666',
                            marginBottom: '1.5rem'
                        }}>Complete your purchase securely</p>

                        <div style={{
                            backgroundColor: '#F0F9FF',
                            border: '1px solid #BFDBFE',
                            padding: '1rem',
                            marginBottom: '1.5rem',
                            fontSize: '0.875rem'
                        }}>
                            <div style={{ fontWeight: '600', color: '#1E40AF', marginBottom: '0.5rem' }}>
                                Test Mode
                            </div>
                            <div style={{ color: '#3B82F6', marginBottom: '0.5rem' }}>
                                Use card: <code style={{
                                    backgroundColor: 'white',
                                    padding: '0.25rem 0.5rem',
                                    fontFamily: 'monospace'
                                }}>4242 4242 4242 4242</code>
                            </div>
                            <div style={{ fontSize: '0.75rem', color: '#60A5FA' }}>
                                Any future date and CVC
                            </div>
                        </div>

                        <StripePayment
                            amount={finalTotal}
                            onSuccess={handleStripeSuccess}
                        />
                    </div>
                </div>
            )}
        </div>
    );
};

export default Checkout;
