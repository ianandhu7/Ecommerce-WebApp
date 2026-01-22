import React, { useContext } from 'react';
import { Link } from 'react-router-dom';
import { CartContext } from '../context/CartContext';
import { WishlistContext } from '../context/WishlistContext';
import toast from 'react-hot-toast';

const ProductCard = ({ id, image, name, brand, price }) => {
    const { addToCart } = useContext(CartContext);
    const wishlistContext = useContext(WishlistContext);

    const addToWishlist = wishlistContext?.addToWishlist;
    const removeFromWishlist = wishlistContext?.removeFromWishlist;
    const isInWishlist = wishlistContext?.isInWishlist || (() => false);
    const inWishlist = isInWishlist(id);

    const handleAddToCart = (e) => {
        e.preventDefault();
        addToCart({ id, image, name, brand, price });
        toast.success('Added to cart!');
    };

    const handleWishlistToggle = (e) => {
        e.preventDefault();
        e.stopPropagation();

        if (!addToWishlist || !removeFromWishlist) {
            console.error('Wishlist context not available');
            toast.error('Wishlist feature unavailable');
            return;
        }

        if (inWishlist) {
            removeFromWishlist(id);
            toast.success('Removed from wishlist');
        } else {
            addToWishlist(id);
            toast.success('Added to wishlist ❤️');
        }
    };

    return (
        <Link
            to={`/products/${id}`}
            style={{
                textDecoration: 'none',
                color: 'inherit',
                display: 'block',
                transition: 'transform 0.3s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-4px)'}
            onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
            <div style={{
                backgroundColor: '#FFFFFF',
                overflow: 'hidden'
            }}>
                {/* Image Section */}
                <div
                    className="product-image-container"
                    style={{
                        position: 'relative',
                        backgroundColor: '#F5F5F5',
                        paddingTop: '100%',
                        overflow: 'hidden'
                    }}
                >
                    <img
                        src={image}
                        alt={name}
                        onError={(e) => {
                            e.target.style.display = 'none';
                            e.target.nextSibling.style.display = 'flex';
                        }}
                        style={{
                            position: 'absolute',
                            top: 0,
                            left: 0,
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                    <div style={{
                        position: 'absolute',
                        top: 0,
                        left: 0,
                        width: '100%',
                        height: '100%',
                        display: 'none',
                        alignItems: 'center',
                        justifyContent: 'center',
                        backgroundColor: '#F5F5F5',
                        color: '#999',
                        fontSize: '0.75rem',
                        textTransform: 'uppercase',
                        letterSpacing: '0.05em'
                    }}>
                        {name}
                    </div>

                    {/* Wishlist Icon */}
                    <button
                        onClick={handleWishlistToggle}
                        className="wishlist-icon-btn"
                        style={{
                            position: 'absolute',
                            top: '12px',
                            right: '12px',
                            width: '40px',
                            height: '40px',
                            borderRadius: '50%',
                            border: 'none',
                            backgroundColor: 'rgba(255, 255, 255, 0.95)',
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            opacity: 0,
                            transform: 'scale(0.8)',
                            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                            zIndex: 10
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.transform = 'scale(1.1)';
                            e.currentTarget.style.boxShadow = '0 4px 12px rgba(0, 0, 0, 0.15)';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.transform = 'scale(1)';
                            e.currentTarget.style.boxShadow = '0 2px 8px rgba(0, 0, 0, 0.1)';
                        }}
                    >
                        <svg
                            width="20"
                            height="20"
                            viewBox="0 0 24 24"
                            fill={inWishlist ? '#E53E3E' : 'none'}
                            stroke={inWishlist ? '#E53E3E' : '#000'}
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            style={{ transition: 'all 0.3s ease' }}
                        >
                            <path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"></path>
                        </svg>
                    </button>
                </div>

                {/* Product Info */}
                <div style={{ padding: '1.5rem 0' }}>
                    <h3 style={{
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase',
                        marginBottom: '0.5rem',
                        color: '#000'
                    }}>
                        {name}
                    </h3>

                    <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '400',
                        color: '#666',
                        marginBottom: '0.75rem'
                    }}>
                        {brand}
                    </p>

                    <p style={{
                        fontSize: '1rem',
                        fontWeight: '400',
                        color: '#000'
                    }}>
                        ${price}
                    </p>
                </div>
            </div>
        </Link>
    );
};

export default ProductCard;
