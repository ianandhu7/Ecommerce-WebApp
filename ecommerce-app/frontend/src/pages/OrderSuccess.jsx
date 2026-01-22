import React, { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { getOrderTracking } from '../api/shippingService';
import { FaCheckCircle, FaReceipt, FaTruck } from 'react-icons/fa';

const OrderSuccess = () => {
    const { orderId } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await getOrderTracking(orderId);
                setOrder(data);
            } catch (error) {
                console.error('Error fetching order:', error);
            } finally {
                setLoading(false);
            }
        };

        if (orderId) {
            fetchOrder();
        }
    }, [orderId]);

    if (loading) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F5F5'
            }}>
                <div style={{
                    width: '50px',
                    height: '50px',
                    border: '3px solid #E5E5E5',
                    borderTop: '3px solid #000',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                }}></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                backgroundColor: '#F5F5F5',
                padding: '2rem'
            }}>
                <h2 style={{
                    fontSize: '1.5rem',
                    fontWeight: '300',
                    marginBottom: '1.5rem',
                    color: '#000',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}>Order not found</h2>
                <Link
                    to="/"
                    style={{
                        color: '#000',
                        textDecoration: 'underline',
                        fontSize: '0.875rem'
                    }}
                >
                    Return to Home
                </Link>
            </div>
        );
    }

    return (
        <div style={{
            minHeight: '100vh',
            backgroundColor: '#F5F5F5',
            padding: '4rem 2rem 3rem'
        }}>
            <div style={{
                maxWidth: '900px',
                margin: '0 auto'
            }}>
                {/* Success Header */}
                <div style={{
                    textAlign: 'center',
                    marginBottom: '2.5rem'
                }}>
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '80px',
                        height: '80px',
                        borderRadius: '50%',
                        backgroundColor: '#D1FAE5',
                        marginBottom: '1.25rem'
                    }}>
                        <FaCheckCircle style={{
                            fontSize: '2.5rem',
                            color: '#10B981'
                        }} />
                    </div>
                    <h1 style={{
                        fontSize: '2rem',
                        fontWeight: '300',
                        color: '#000',
                        marginBottom: '0.5rem',
                        letterSpacing: '0.05em'
                    }}>Order Placed Successfully!</h1>
                    <p style={{
                        fontSize: '0.9375rem',
                        color: '#666',
                        letterSpacing: '0.025em'
                    }}>Thank you for your purchase.</p>
                </div>

                {/* Main Content Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '1.5rem',
                    marginBottom: '2rem'
                }}>
                    {/* Left Column */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '1.5rem'
                    }}>
                        {/* Tracking Number */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            textAlign: 'center'
                        }}>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#666',
                                marginBottom: '1rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase'
                            }}>Your Tracking Number</p>
                            <div style={{
                                fontSize: '1.375rem',
                                fontWeight: '700',
                                color: '#6366F1',
                                letterSpacing: '0.1em',
                                marginBottom: '1rem',
                                fontFamily: 'monospace',
                                padding: '0.875rem',
                                backgroundColor: '#F0F9FF',
                                borderRadius: '4px'
                            }}>
                                {order.trackingNumber}
                            </div>
                            <p style={{
                                fontSize: '0.875rem',
                                color: '#999',
                                lineHeight: '1.6'
                            }}>Save this number to track your shipment status.</p>
                        </div>

                        {/* Order Details */}
                        <div style={{
                            backgroundColor: 'white',
                            padding: '1.75rem',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                        }}>
                            <h3 style={{
                                fontSize: '1rem',
                                fontWeight: '500',
                                color: '#000',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                letterSpacing: '0.025em'
                            }}>
                                <FaReceipt style={{ fontSize: '1.25rem', color: '#666' }} />
                                Order Details
                            </h3>

                            <div style={{
                                display: 'flex',
                                flexDirection: 'column',
                                gap: '1rem'
                            }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingBottom: '1rem',
                                    borderBottom: '1px solid #F5F5F5'
                                }}>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#666',
                                        fontWeight: '500'
                                    }}>Order ID:</span>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#000',
                                        fontWeight: '600'
                                    }}>#{order.id}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingBottom: '1rem',
                                    borderBottom: '1px solid #F5F5F5'
                                }}>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#666',
                                        fontWeight: '500'
                                    }}>Date:</span>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#000',
                                        fontWeight: '600'
                                    }}>
                                        {new Date(order.createdAt).toLocaleDateString('en-US', {
                                            month: 'long',
                                            day: 'numeric',
                                            year: 'numeric'
                                        })}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingBottom: '1rem',
                                    borderBottom: '1px solid #F5F5F5'
                                }}>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#666',
                                        fontWeight: '500'
                                    }}>Total:</span>
                                    <span style={{
                                        fontSize: '1.125rem',
                                        color: '#000',
                                        fontWeight: '700'
                                    }}>
                                        ${order.total.toFixed(2)}
                                    </span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between'
                                }}>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#666',
                                        fontWeight: '500'
                                    }}>Payment:</span>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#000',
                                        fontWeight: '600'
                                    }}>
                                        Paid via {order.paymentMethod === 'stripe' ? 'Stripe' : 'Razorpay'}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Right Column - Shipping Info */}
                    <div>
                        <div style={{
                            backgroundColor: 'white',
                            padding: '2rem',
                            borderRadius: '4px',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            height: '100%'
                        }}>
                            <h3 style={{
                                fontSize: '1.125rem',
                                fontWeight: '500',
                                color: '#000',
                                marginBottom: '1.5rem',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.75rem',
                                letterSpacing: '0.025em'
                            }}>
                                <FaTruck style={{ fontSize: '1.25rem', color: '#666' }} />
                                Shipping Information
                            </h3>

                            <div style={{
                                fontSize: '0.9375rem',
                                color: '#333',
                                lineHeight: '1.8'
                            }}>
                                <div style={{
                                    marginBottom: '1.5rem',
                                    paddingBottom: '1.5rem',
                                    borderBottom: '1px solid #F5F5F5'
                                }}>
                                    <p style={{
                                        fontSize: '0.75rem',
                                        color: '#999',
                                        marginBottom: '0.5rem',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em'
                                    }}>Delivery Address</p>
                                    <p style={{ fontWeight: '500', marginBottom: '0.25rem' }}>
                                        {order.shippingAddress}
                                    </p>
                                    <p style={{ marginBottom: '0.25rem' }}>
                                        {order.shippingCity}, {order.shippingState} {order.shippingZip}
                                    </p>
                                    <p>{order.shippingCountry}</p>
                                </div>

                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    padding: '1rem',
                                    backgroundColor: '#F9FAFB',
                                    borderRadius: '4px'
                                }}>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#666',
                                        fontWeight: '500'
                                    }}>Shipping Method:</span>
                                    <span style={{
                                        fontSize: '0.875rem',
                                        color: '#000',
                                        fontWeight: '600'
                                    }}>
                                        {order.shippingMethod || 'Standard Shipping'}
                                    </span>
                                </div>

                                <div style={{
                                    marginTop: '2rem',
                                    padding: '1.5rem',
                                    backgroundColor: '#FEF3C7',
                                    borderRadius: '4px',
                                    border: '1px solid #FDE68A'
                                }}>
                                    <p style={{
                                        fontSize: '0.875rem',
                                        color: '#92400E',
                                        lineHeight: '1.6',
                                        margin: 0
                                    }}>
                                        <strong>Note:</strong> You will receive an email confirmation with tracking details once your order ships.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Action Buttons */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1.5rem',
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <Link
                        to={`/track/${order.id}`}
                        style={{
                            flex: 1,
                            padding: '1rem 2rem',
                            backgroundColor: 'white',
                            color: '#000',
                            textAlign: 'center',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            border: '1px solid #000',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#000';
                            e.currentTarget.style.color = 'white';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#000';
                        }}
                    >
                        Track Order
                    </Link>
                    <Link
                        to="/products"
                        style={{
                            flex: 1,
                            padding: '1rem 2rem',
                            backgroundColor: '#000',
                            color: 'white',
                            textAlign: 'center',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            border: '1px solid #000',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = '#333';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#000';
                        }}
                    >
                        Continue Shopping
                    </Link>
                </div>
            </div>

            {/* Add keyframes for loading spinner */}
            <style>{`
                @keyframes spin {
                    0% { transform: rotate(0deg); }
                    100% { transform: rotate(360deg); }
                }
            `}</style>
        </div>
    );
};

export default OrderSuccess;
