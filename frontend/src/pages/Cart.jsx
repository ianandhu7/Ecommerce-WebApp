import React, { useContext, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { FaShoppingBag } from 'react-icons/fa';

const Cart = () => {
    const { cart, removeFromCart, updateQuantity, getCartTotal } = useContext(CartContext);
    const [discountCode, setDiscountCode] = useState('');

    useEffect(() => {
        if (cart.length === 0) {
            // Apply global styles for empty cart
            document.body.style.background = 'linear-gradient(to bottom, #64B5F6 0%, #BBDEFB 100%)';
            document.body.style.backgroundAttachment = 'fixed';

            const app = document.querySelector('.App');
            if (app) {
                app.style.backgroundColor = 'transparent';
                app.classList.remove('bg-gray-100');
            }

            const footer = document.querySelector('footer');
            if (footer) {
                footer.style.backgroundColor = '#FFFFFF';
                footer.style.borderTop = '1px solid #E5E5E5';
            }

            return () => {
                // Cleanup styles on unmount or when cart is not empty
                document.body.style.background = '';
                document.body.style.backgroundAttachment = '';

                if (app) {
                    app.style.backgroundColor = '';
                    app.classList.add('bg-gray-100');
                }
                if (footer) {
                    footer.style.backgroundColor = '#FFFFFF';
                    footer.style.borderTop = '1px solid #E5E5E5';
                }
            };
        }
    }, [cart.length]);

    if (cart.length === 0) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                width: '100%',
                background: 'linear-gradient(135deg, #7DB3E9 0%, #A3C7EE 50%, #D9D8D2 100%)',
                marginTop: '-160px',
                paddingTop: '160px'
            }}>
                <div style={{
                    backgroundColor: 'white',
                    borderRadius: '12px',
                    padding: '4rem 3rem',
                    maxWidth: '600px',
                    width: '100%',
                    textAlign: 'center',
                    boxShadow: '0 20px 60px rgba(0,0,0,0.15)'
                }}>
                    {/* Empty Bag Icon */}
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        marginBottom: '2rem'
                    }}>
                        <FaShoppingBag style={{
                            fontSize: '4rem',
                            color: '#D1D5DB',
                            strokeWidth: '1px',
                            stroke: '#9CA3AF'
                        }} />
                    </div>

                    <h2 style={{
                        fontSize: '1.75rem',
                        fontWeight: '700',
                        marginBottom: '1rem',
                        color: '#1F2937',
                        letterSpacing: '0.025em'
                    }}>YOUR SOULSTYLE BAG IS EMPTY!</h2>

                    <p style={{
                        fontSize: '0.9375rem',
                        color: '#6B7280',
                        marginBottom: '0.5rem',
                        lineHeight: '1.6'
                    }}>Looks like you haven't added anything to your cart yet.</p>
                    <p style={{
                        fontSize: '0.9375rem',
                        color: '#6B7280',
                        marginBottom: '2.5rem',
                        lineHeight: '1.6'
                    }}>Let's find some amazing pieces for you!</p>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link
                            to="/products"
                            style={{
                                padding: '0.875rem 2rem',
                                backgroundColor: '#000',
                                color: 'white',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                transition: 'all 0.3s',
                                border: 'none',
                                letterSpacing: '0.025em'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#333';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#000';
                            }}
                        >
                            Start Shopping Now
                        </Link>
                        <Link
                            to="/products"
                            style={{
                                padding: '0.875rem 2rem',
                                backgroundColor: 'white',
                                color: '#000',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '600',
                                border: '1px solid #000',
                                transition: 'all 0.3s',
                                letterSpacing: '0.025em'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#F9FAFB';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = 'white';
                            }}
                        >
                            Browse New Arrivals
                        </Link>
                    </div>

                    <p style={{
                        fontSize: '0.8125rem',
                        color: '#9CA3AF',
                        marginTop: '2.5rem',
                        marginBottom: '0'
                    }}>Perhaps something you've seen caught to eye?</p>
                </div>
            </div>
        );
    }

    const subtotal = getCartTotal();
    const shipping = 0; // Free shipping
    const total = subtotal + shipping;

    return (
        <div className="cart-container" style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #7DB3E9 0%, #A3C7EE 50%, #D9D8D2 100%)',
            padding: '4rem 2rem 3rem',
            marginTop: '-160px',
            paddingTop: 'calc(160px + 4rem)'
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .cart-container {
                        padding: 3rem 1rem 2rem !important;
                        padding-top: calc(100px + 3rem) !important;
                        margin-top: -100px !important;
                    }
                }
                @media (max-width: 480px) {
                    .cart-container {
                        padding: 2rem 0.75rem 1.5rem !important;
                        padding-top: calc(80px + 2rem) !important;
                        margin-top: -80px !important;
                    }
                }
            `}</style>
            <div style={{
                maxWidth: '1100px',
                margin: '0 auto'
            }}>
                {/* Header */}
                <h1 style={{
                    fontSize: '2rem',
                    fontWeight: '300',
                    marginBottom: '2.5rem',
                    color: '#000',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}>Shopping Cart</h1>

                <div className="cart-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 400px',
                    gap: '2rem'
                }}>
                    <style>{`
                        @media (max-width: 1024px) {
                            .cart-grid {
                                grid-template-columns: 1fr 350px !important;
                                gap: 1.5rem !important;
                            }
                        }
                        @media (max-width: 768px) {
                            .cart-grid {
                                grid-template-columns: 1fr !important;
                                gap: 2rem !important;
                            }
                        }
                        @media (max-width: 640px) {
                            .cart-item-grid {
                                grid-template-columns: 80px 1fr !important;
                                gap: 1rem !important;
                            }
                            .cart-item-price {
                                grid-column: 2 / -1 !important;
                                text-align: left !important;
                                margin-top: 0.5rem;
                                padding-top: 0.5rem;
                                border-top: 1px solid #E5E5E5;
                            }
                        }
                    `}</style>
                    {/* Cart Items */}
                    <div style={{
                        backgroundColor: 'white',
                        borderRadius: '4px',
                        padding: '2rem',
                        boxShadow: '0 1px 3px rgba(0,0,0,0.1)'
                    }}>
                        {cart.map((item, index) => (
                            <div key={item.id}>
                                <div className="cart-item-grid" style={{
                                    display: 'grid',
                                    gridTemplateColumns: '120px 1fr auto',
                                    gap: '1.5rem',
                                    alignItems: 'center',
                                    padding: '1.5rem 0'
                                }}>
                                    {/* Product Image */}
                                    <div style={{
                                        width: '120px',
                                        height: '120px',
                                        backgroundColor: '#F9FAFB',
                                        borderRadius: '4px',
                                        overflow: 'hidden',
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

                                    {/* Product Details */}
                                    <div>
                                        <h3 style={{
                                            fontSize: '1.0625rem',
                                            fontWeight: '500',
                                            marginBottom: '0.375rem',
                                            color: '#000'
                                        }}>{item.name}</h3>
                                        <p style={{
                                            fontSize: '0.875rem',
                                            color: '#666',
                                            marginBottom: '1rem'
                                        }}>{item.brand}</p>
                                        <div style={{
                                            display: 'flex',
                                            alignItems: 'center',
                                            gap: '0.75rem'
                                        }}>
                                            <button
                                                onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: '1px solid #E5E5E5',
                                                    backgroundColor: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '1.125rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '300',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#000';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#E5E5E5';
                                                }}
                                            >−</button>
                                            <span style={{
                                                padding: '0 1rem',
                                                fontSize: '0.9375rem',
                                                fontWeight: '500',
                                                minWidth: '40px',
                                                textAlign: 'center'
                                            }}>{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                style={{
                                                    width: '32px',
                                                    height: '32px',
                                                    border: '1px solid #E5E5E5',
                                                    backgroundColor: 'white',
                                                    cursor: 'pointer',
                                                    fontSize: '1.125rem',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    fontWeight: '300',
                                                    transition: 'all 0.2s'
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.borderColor = '#000';
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.borderColor = '#E5E5E5';
                                                }}
                                            >+</button>
                                        </div>
                                    </div>

                                    {/* Price and Remove */}
                                    <div className="cart-item-price" style={{
                                        textAlign: 'right',
                                        display: 'flex',
                                        flexDirection: 'column',
                                        alignItems: 'flex-end',
                                        gap: '1rem'
                                    }}>
                                        <span style={{
                                            fontSize: '1.0625rem',
                                            fontWeight: '600',
                                            color: '#000'
                                        }}>${(item.price * item.quantity).toFixed(2)}</span>
                                        <button
                                            onClick={() => removeFromCart(item.id)}
                                            style={{
                                                fontSize: '0.8125rem',
                                                color: '#EF4444',
                                                textDecoration: 'underline',
                                                background: 'none',
                                                border: 'none',
                                                cursor: 'pointer',
                                                padding: 0,
                                                fontWeight: '500'
                                            }}
                                        >Remove</button>
                                    </div>
                                </div>
                                {index < cart.length - 1 && (
                                    <div style={{
                                        height: '1px',
                                        backgroundColor: '#E5E5E5'
                                    }}></div>
                                )}
                            </div>
                        ))}
                    </div>

                    {/* Order Summary Sidebar */}
                    <div>
                        <div className="cart-summary-sticky" style={{
                            backgroundColor: 'white',
                            borderRadius: '4px',
                            padding: '2rem',
                            boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                            position: 'sticky',
                            top: '100px'
                        }}>
                            <style>{`
                                @media (max-width: 768px) {
                                    .cart-summary-sticky {
                                        position: static !important;
                                    }
                                }
                            `}</style>
                            <h2 style={{
                                fontSize: '1.125rem',
                                fontWeight: '500',
                                marginBottom: '1.5rem',
                                color: '#000',
                                letterSpacing: '0.025em'
                            }}>Order Summary</h2>

                            {/* Discount Code */}
                            <div style={{
                                marginBottom: '1.5rem',
                                paddingBottom: '1.5rem',
                                borderBottom: '1px solid #E5E5E5'
                            }}>
                                <label style={{
                                    display: 'block',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    marginBottom: '0.5rem',
                                    color: '#000'
                                }}>Discount Code</label>
                                <div style={{ display: 'flex', gap: '0.5rem' }}>
                                    <input
                                        type="text"
                                        value={discountCode}
                                        onChange={(e) => setDiscountCode(e.target.value)}
                                        placeholder="Enter code"
                                        style={{
                                            flex: 1,
                                            padding: '0.75rem',
                                            border: '1px solid #E5E5E5',
                                            fontSize: '0.875rem',
                                            outline: 'none'
                                        }}
                                        onFocus={(e) => e.target.style.borderColor = '#000'}
                                        onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                                    />
                                    <button style={{
                                        padding: '0.75rem 1.25rem',
                                        backgroundColor: '#000',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s'
                                    }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#333';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = '#000';
                                        }}
                                    >Apply</button>
                                </div>
                            </div>

                            {/* Totals */}
                            <div style={{ marginBottom: '1.5rem' }}>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '0.75rem',
                                    fontSize: '0.9375rem'
                                }}>
                                    <span style={{ color: '#666' }}>Subtotal</span>
                                    <span style={{ color: '#000', fontWeight: '500' }}>${subtotal.toFixed(2)}</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    marginBottom: '1.5rem',
                                    fontSize: '0.9375rem'
                                }}>
                                    <span style={{ color: '#666' }}>Shipping</span>
                                    <span style={{ color: '#10B981', fontWeight: '600' }}>Free</span>
                                </div>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    paddingTop: '1.5rem',
                                    borderTop: '1px solid #E5E5E5',
                                    fontSize: '1.125rem',
                                    fontWeight: '700'
                                }}>
                                    <span style={{ color: '#000' }}>Total</span>
                                    <span style={{ color: '#000' }}>${total.toFixed(2)}</span>
                                </div>
                            </div>

                            {/* Checkout Button */}
                            <Link
                                to="/checkout"
                                style={{
                                    display: 'block',
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: '#000',
                                    color: 'white',
                                    textAlign: 'center',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    border: 'none',
                                    cursor: 'pointer',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = '#333';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#000';
                                }}
                            >
                                Proceed to Checkout
                            </Link>

                            <p style={{
                                fontSize: '0.75rem',
                                color: '#999',
                                textAlign: 'center',
                                marginTop: '1rem',
                                lineHeight: '1.5'
                            }}>
                                Taxes calculated at checkout
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Cart;
