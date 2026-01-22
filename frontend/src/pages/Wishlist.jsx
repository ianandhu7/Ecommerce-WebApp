import React, { useContext, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { WishlistContext } from '../context/WishlistContext';
import { CartContext } from '../context/CartContext';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';
import { FaHeart } from 'react-icons/fa';

const Wishlist = () => {
    const { user } = useContext(AuthContext);
    const { wishlist, removeFromWishlist, loading } = useContext(WishlistContext);
    const { addToCart } = useContext(CartContext);
    const navigate = useNavigate();

    useEffect(() => {
        if (!user) {
            toast.error('Please login to view wishlist');
            navigate('/login');
        }
    }, [user, navigate]);

    const handleAddToCart = (product) => {
        addToCart(product);
        toast.success('Added to cart');
    };

    const handleRemove = (productId) => {
        removeFromWishlist(productId);
        toast.success('Removed from wishlist');
    };

    const handleAddAllToCart = () => {
        if (wishlist.length === 0) return;

        wishlist.forEach(item => {
            addToCart(item.Product);
        });
        toast.success(`Added ${wishlist.length} items to cart!`);
    };

    if (loading) {
        return (
            <div style={{
                minHeight: '60vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center'
            }}>
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-gray-900"></div>
            </div>
        );
    }

    // Empty State matching Cart design
    if (wishlist.length === 0) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                padding: '2rem',
                width: '100%',
                background: 'linear-gradient(135deg, #7DB3E9 0%, #A3C7EE 50%, #D9D8D2 100%)', // Match Blue Background
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
                    <div style={{
                        display: 'inline-flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        width: '100px',
                        height: '100px',
                        marginBottom: '2rem'
                    }}>
                        <FaHeart style={{
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
                    }}>YOUR WISHLIST IS EMPTY!</h2>

                    <p style={{
                        fontSize: '0.9375rem',
                        color: '#6B7280',
                        marginBottom: '0.5rem',
                        lineHeight: '1.6'
                    }}>Looks like you haven't saved anything yet.</p>
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
                        >
                            Start Shopping Now
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // Main Wishlist Content matching Cart styling but with Blue Background
    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(135deg, #7DB3E9 0%, #A3C7EE 50%, #D9D8D2 100%)',
            padding: '4rem 2rem 3rem',
            marginTop: '-160px',
            paddingTop: 'calc(160px + 4rem)'
        }}>
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
                }}>My Wishlist</h1>

                {/* Product Grid */}
                <div style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                    gap: '2rem',
                    marginBottom: '3rem'
                }}>
                    {wishlist.map((item) => (
                        <div
                            key={item.id}
                            style={{
                                backgroundColor: 'white',
                                borderRadius: '4px',
                                overflow: 'hidden',
                                boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
                                transition: 'transform 0.3s ease, box-shadow 0.3s ease'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 10px 25px rgba(0, 0, 0, 0.08)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}
                        >
                            {/* Product Image */}
                            <div
                                onClick={() => navigate(`/products/${item.productId}`)}
                                style={{
                                    height: '300px',
                                    backgroundColor: '#F9FAFB',
                                    position: 'relative',
                                    cursor: 'pointer',
                                    overflow: 'hidden'
                                }}
                            >
                                <img
                                    src={item.Product.image}
                                    alt={item.Product.name}
                                    style={{
                                        width: '100%',
                                        height: '100%',
                                        objectFit: 'cover'
                                    }}
                                />
                                {/* Remove Button */}
                                <button
                                    onClick={(e) => {
                                        e.stopPropagation();
                                        handleRemove(item.productId);
                                    }}
                                    style={{
                                        position: 'absolute',
                                        top: '12px',
                                        right: '12px',
                                        width: '32px',
                                        height: '32px',
                                        borderRadius: '50%',
                                        backgroundColor: 'white',
                                        border: 'none',
                                        display: 'flex',
                                        alignItems: 'center',
                                        justifyContent: 'center',
                                        cursor: 'pointer',
                                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)'
                                    }}
                                >
                                    <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="#666" strokeWidth="2">
                                        <line x1="18" y1="6" x2="6" y2="18"></line>
                                        <line x1="6" y1="6" x2="18" y2="18"></line>
                                    </svg>
                                </button>
                            </div>

                            {/* Product Info */}
                            <div style={{ padding: '1.5rem' }}>
                                <h3
                                    onClick={() => navigate(`/products/${item.productId}`)}
                                    style={{
                                        fontSize: '1rem',
                                        fontWeight: '500',
                                        color: '#000',
                                        marginBottom: '0.5rem',
                                        cursor: 'pointer'
                                    }}
                                >
                                    {item.Product.name}
                                </h3>
                                <p style={{
                                    fontSize: '0.875rem',
                                    color: '#666',
                                    marginBottom: '1rem'
                                }}>
                                    {item.Product.brand}
                                </p>
                                <div style={{
                                    display: 'flex',
                                    justifyContent: 'space-between',
                                    alignItems: 'center',
                                    marginBottom: '1.5rem'
                                }}>
                                    <span style={{
                                        fontSize: '1.125rem',
                                        fontWeight: '600',
                                        color: '#000'
                                    }}>${item.Product.price}</span>
                                </div>

                                <button
                                    onClick={() => handleAddToCart(item.Product)}
                                    style={{
                                        width: '100%',
                                        padding: '0.875rem',
                                        backgroundColor: '#000',
                                        color: 'white',
                                        border: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        textTransform: 'uppercase',
                                        letterSpacing: '0.05em',
                                        cursor: 'pointer',
                                        transition: 'background-color 0.2s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                                    onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                                >
                                    Add to Cart
                                </button>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Bottom Actions */}
                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    paddingTop: '2rem',
                    borderTop: '1px solid #E5E5E5'
                }}>
                    <button
                        onClick={handleAddAllToCart}
                        style={{
                            padding: '1rem 3rem',
                            backgroundColor: 'white',
                            color: '#000',
                            border: '1px solid #000',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            textTransform: 'uppercase',
                            letterSpacing: '0.05em',
                            cursor: 'pointer',
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
                        Add All to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Wishlist;
