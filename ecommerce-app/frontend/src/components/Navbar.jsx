import React, { useContext, useState, useEffect, useRef } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import { CartContext } from '../context/CartContext';
import { FaShoppingCart, FaUser, FaShoppingBag, FaBars, FaTimes, FaHeart, FaSearch } from 'react-icons/fa';
import axios from 'axios';

const Navbar = () => {
    const { user, logout } = useContext(AuthContext);
    const { cart } = useContext(CartContext);
    const navigate = useNavigate();
    const location = useLocation();
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestions, setSuggestions] = useState([]);
    const [showSuggestions, setShowSuggestions] = useState(false);
    const [selectedIndex, setSelectedIndex] = useState(-1);
    const searchRef = useRef(null);
    const debounceTimerRef = useRef(null);

    const handleLogout = () => {
        logout();
        navigate('/login');
        setMobileMenuOpen(false);
    };

    // Fetch suggestions from API
    const fetchSuggestions = async (query) => {
        if (query.trim().length < 2) {
            setSuggestions([]);
            setShowSuggestions(false);
            return;
        }

        try {
            const response = await axios.get(`http://localhost:5002/api/products/suggestions?query=${encodeURIComponent(query)}`);
            setSuggestions(response.data);
            setShowSuggestions(response.data.length > 0);
        } catch (error) {
            console.error('Error fetching suggestions:', error);
            setSuggestions([]);
        }
    };

    // Debounced search input handler
    const handleSearchInput = (e) => {
        const value = e.target.value;
        setSearchQuery(value);
        setSelectedIndex(-1);

        // Clear existing timer
        if (debounceTimerRef.current) {
            clearTimeout(debounceTimerRef.current);
        }

        // Set new timer for debounced API call
        debounceTimerRef.current = setTimeout(() => {
            fetchSuggestions(value);
        }, 300);
    };

    const handleSearch = (e) => {
        e.preventDefault();
        if (searchQuery.trim()) {
            navigate(`/products?search=${encodeURIComponent(searchQuery.trim())}`);
            setSearchQuery('');
            setSuggestions([]);
            setShowSuggestions(false);
        }
    };

    // Handle suggestion click
    const handleSuggestionClick = (productId) => {
        navigate(`/products/${productId}`);
        setSearchQuery('');
        setSuggestions([]);
        setShowSuggestions(false);
    };

    // Handle keyboard navigation
    const handleKeyDown = (e) => {
        if (!showSuggestions) return;

        switch (e.key) {
            case 'ArrowDown':
                e.preventDefault();
                setSelectedIndex(prev =>
                    prev < suggestions.length - 1 ? prev + 1 : prev
                );
                break;
            case 'ArrowUp':
                e.preventDefault();
                setSelectedIndex(prev => prev > 0 ? prev - 1 : -1);
                break;
            case 'Enter':
                e.preventDefault();
                if (selectedIndex >= 0 && selectedIndex < suggestions.length) {
                    handleSuggestionClick(suggestions[selectedIndex].id);
                } else {
                    handleSearch(e);
                }
                break;
            case 'Escape':
                setShowSuggestions(false);
                setSelectedIndex(-1);
                break;
            default:
                break;
        }
    };

    // Click outside handler
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (searchRef.current && !searchRef.current.contains(event.target)) {
                setShowSuggestions(false);
                setSelectedIndex(-1);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
            if (debounceTimerRef.current) {
                clearTimeout(debounceTimerRef.current);
            }
        };
    }, []);


    const cartItemCount = cart.reduce((acc, item) => acc + item.quantity, 0);
    const closeMobileMenu = () => setMobileMenuOpen(false);

    const isActive = (path) => {
        return location.pathname === path;
    };

    return (
        <nav style={{
            backgroundColor: '#FFFFFF',
            borderBottom: '1px solid #E5E5E5',
            position: 'fixed',
            top: 0,
            left: 0,
            right: 0,
            zIndex: 50,
            transition: 'all 0.3s ease'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                {/* Desktop Navigation */}
                <div className="desktop-nav" style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    height: '80px'
                }}>
                    {/* Left: Logo + Links */}
                    <div style={{ display: 'flex', alignItems: 'center', gap: '3rem' }}>
                        {/* Logo */}
                        <Link
                            to="/"
                            style={{
                                textDecoration: 'none',
                                display: 'flex',
                                alignItems: 'center',
                                gap: '0.5rem'
                            }}
                        >
                            {/* Shopping Bag SVG Icon */}
                            <svg
                                width="32"
                                height="32"
                                viewBox="0 0 24 24"
                                fill="none"
                                xmlns="http://www.w3.org/2000/svg"
                            >
                                <path
                                    d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                                    stroke="#95BF47"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M3 6H21"
                                    stroke="#95BF47"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                                <path
                                    d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                                    stroke="#95BF47"
                                    strokeWidth="2"
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                />
                            </svg>
                            <span style={{
                                fontSize: '1.5rem',
                                fontWeight: '700',
                                letterSpacing: '0.05em',
                                color: '#000',
                                textTransform: 'uppercase'
                            }}>
                                SOULSTYLE
                            </span>
                        </Link>

                        {/* Links */}
                        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
                            <Link
                                to="/products"
                                style={{
                                    color: '#000',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    transition: 'opacity 0.3s',
                                    borderBottom: isActive('/products') ? '2px solid #000' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                SHOP
                            </Link>
                            <Link
                                to="/new"
                                style={{
                                    color: '#000',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    transition: 'opacity 0.3s',
                                    borderBottom: isActive('/new') ? '2px solid #000' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                NEW
                            </Link>
                            <Link
                                to="/orders"
                                style={{
                                    color: '#000',
                                    textDecoration: 'none',
                                    fontSize: '0.875rem',
                                    fontWeight: '500',
                                    letterSpacing: '0.05em',
                                    textTransform: 'uppercase',
                                    transition: 'opacity 0.3s',
                                    borderBottom: isActive('/orders') ? '2px solid #000' : 'none',
                                    paddingBottom: '4px'
                                }}
                            >
                                ORDERS
                            </Link>
                        </div>
                    </div>

                    {/* Right: Search + Icons */}
                    <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center' }}>
                        {/* Search Bar with Auto-Suggestions */}
                        <div
                            ref={searchRef}
                            style={{ position: 'relative' }}
                        >
                            <form
                                className="navbar-search"
                                onSubmit={handleSearch}
                                style={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    backgroundColor: '#F3F4F6',
                                    padding: '0.5rem 1rem',
                                    borderRadius: '9999px',
                                    width: '300px'
                                }}
                            >
                                <style>{`
                                    @media (max-width: 900px) {
                                        .navbar-search {
                                            display: none !important;
                                        }
                                    }
                                `}</style>
                                <FaSearch size={14} color="#9CA3AF" style={{ marginRight: '0.75rem' }} />
                                <input
                                    type="text"
                                    value={searchQuery}
                                    onChange={handleSearchInput}
                                    onKeyDown={handleKeyDown}
                                    onFocus={() => {
                                        if (suggestions.length > 0) {
                                            setShowSuggestions(true);
                                        }
                                    }}
                                    placeholder="Search products..."
                                    style={{
                                        border: 'none',
                                        outline: 'none',
                                        backgroundColor: 'transparent',
                                        fontSize: '0.875rem',
                                        width: '100%',
                                        color: '#1F2937'
                                    }}
                                />
                            </form>

                            {/* Suggestions Dropdown */}
                            {showSuggestions && suggestions.length > 0 && (
                                <div style={{
                                    position: 'absolute',
                                    top: 'calc(100% + 8px)',
                                    left: 0,
                                    right: 0,
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #E5E5E5',
                                    borderRadius: '12px',
                                    boxShadow: '0 10px 40px rgba(0, 0, 0, 0.1)',
                                    maxHeight: '400px',
                                    overflowY: 'auto',
                                    zIndex: 1000,
                                    width: '380px'
                                }}>
                                    {suggestions.map((product, index) => (
                                        <div
                                            key={product.id}
                                            onClick={() => handleSuggestionClick(product.id)}
                                            style={{
                                                display: 'flex',
                                                gap: '12px',
                                                padding: '12px 16px',
                                                cursor: 'pointer',
                                                backgroundColor: selectedIndex === index ? '#F9FAFB' : 'transparent',
                                                borderBottom: index < suggestions.length - 1 ? '1px solid #F3F4F6' : 'none',
                                                transition: 'background-color 0.2s'
                                            }}
                                            onMouseEnter={(e) => {
                                                if (selectedIndex !== index) {
                                                    e.currentTarget.style.backgroundColor = '#F9FAFB';
                                                }
                                            }}
                                            onMouseLeave={(e) => {
                                                if (selectedIndex !== index) {
                                                    e.currentTarget.style.backgroundColor = 'transparent';
                                                }
                                            }}
                                        >
                                            {/* Product Image */}
                                            <img
                                                src={product.image}
                                                alt={product.name}
                                                style={{
                                                    width: '50px',
                                                    height: '50px',
                                                    objectFit: 'cover',
                                                    borderRadius: '8px',
                                                    flexShrink: 0
                                                }}
                                            />
                                            {/* Product Info */}
                                            <div style={{ flex: 1, minWidth: 0 }}>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '500',
                                                    color: '#1F2937',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis',
                                                    whiteSpace: 'nowrap'
                                                }}>
                                                    {product.name}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.75rem',
                                                    color: '#6B7280',
                                                    marginTop: '2px'
                                                }}>
                                                    {product.brand} • {product.category}
                                                </div>
                                                <div style={{
                                                    fontSize: '0.875rem',
                                                    fontWeight: '600',
                                                    color: '#000',
                                                    marginTop: '4px'
                                                }}>
                                                    ${product.price.toFixed(2)}
                                                </div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </div>

                        <Link to="/wishlist" style={{ padding: '0.5rem' }}>
                            <FaHeart size={20} color="#000" />
                        </Link>

                        <Link to="/cart" style={{ position: 'relative', padding: '0.5rem' }}>
                            <FaShoppingBag size={20} color="#000" />
                            {cartItemCount > 0 && (
                                <span style={{
                                    position: 'absolute',
                                    top: '0',
                                    right: '0',
                                    backgroundColor: '#000',
                                    color: 'white',
                                    fontSize: '0.625rem',
                                    fontWeight: '600',
                                    borderRadius: '50%',
                                    height: '16px',
                                    width: '16px',
                                    display: 'flex',
                                    alignItems: 'center',
                                    justifyContent: 'center'
                                }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>

                        {user ? (
                            <>
                                {user?.role === 'admin' && (
                                    <Link
                                        to="/admin/dashboard"
                                        style={{
                                            color: '#000',
                                            textDecoration: 'none',
                                            fontSize: '0.875rem',
                                            fontWeight: '600',
                                            letterSpacing: '0.05em',
                                            textTransform: 'uppercase',
                                            marginLeft: '1rem',
                                            border: '1px solid #000',
                                            padding: '0.25rem 0.75rem',
                                            borderRadius: '4px',
                                            backgroundColor: 'transparent',
                                            transition: 'all 0.3s ease'
                                        }}
                                        onMouseEnter={(e) => {
                                            e.currentTarget.style.backgroundColor = '#000';
                                            e.currentTarget.style.color = '#fff';
                                        }}
                                        onMouseLeave={(e) => {
                                            e.currentTarget.style.backgroundColor = 'transparent';
                                            e.currentTarget.style.color = '#000';
                                        }}
                                    >
                                        ADMIN
                                    </Link>
                                )}
                                <button
                                    onClick={handleLogout}
                                    style={{
                                        color: '#000',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        marginLeft: '1rem',
                                        border: '1px solid #000',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px',
                                        backgroundColor: 'transparent',
                                        cursor: 'pointer',
                                        transition: 'all 0.3s ease'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#000';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = 'transparent';
                                        e.currentTarget.style.color = '#000';
                                    }}
                                >
                                    LOGOUT
                                </button>
                            </>
                        ) : (
                            <>
                                <Link
                                    to="/login?role=user"
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        color: '#000',
                                        textDecoration: 'none',
                                        marginLeft: '1rem',
                                        border: '1px solid #000',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px'
                                    }}
                                >
                                    USER
                                </Link>
                                <Link
                                    to="/login?role=admin"
                                    style={{
                                        fontSize: '0.875rem',
                                        fontWeight: '600',
                                        letterSpacing: '0.05em',
                                        textTransform: 'uppercase',
                                        color: '#000',
                                        textDecoration: 'none',
                                        marginLeft: '1rem',
                                        border: '1px solid #000',
                                        padding: '0.25rem 0.75rem',
                                        borderRadius: '4px'
                                    }}
                                >
                                    ADMIN
                                </Link>
                            </>
                        )}
                    </div>
                </div>

                {/* Mobile Navigation */}
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', height: '60px' }} className="mobile-menu-btn">
                    <Link to="/" style={{
                        textDecoration: 'none',
                        display: 'flex',
                        alignItems: 'center',
                        gap: '0.4rem'
                    }}>
                        {/* Shopping Bag SVG Icon - Mobile */}
                        <svg
                            width="24"
                            height="24"
                            viewBox="0 0 24 24"
                            fill="none"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path
                                d="M6 2L3 6V20C3 20.5304 3.21071 21.0391 3.58579 21.4142C3.96086 21.7893 4.46957 22 5 22H19C19.5304 22 20.0391 21.7893 20.4142 21.4142C20.7893 21.0391 21 20.5304 21 20V6L18 2H6Z"
                                stroke="#95BF47"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M3 6H21"
                                stroke="#95BF47"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                            <path
                                d="M16 10C16 11.0609 15.5786 12.0783 14.8284 12.8284C14.0783 13.5786 13.0609 14 12 14C10.9391 14 9.92172 13.5786 9.17157 12.8284C8.42143 12.0783 8 11.0609 8 10"
                                stroke="#95BF47"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                            />
                        </svg>
                        <span style={{
                            fontSize: '1.25rem',
                            fontWeight: '700',
                            letterSpacing: '0.05em',
                            color: '#000',
                            textTransform: 'uppercase'
                        }}>
                            SOULSTYLE
                        </span>
                    </Link>

                    <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                        <Link to="/cart" style={{ position: 'relative' }}>
                            <FaShoppingCart size={20} color="#000" />
                            {cartItemCount > 0 && (
                                <span style={{ position: 'absolute', top: '-8px', right: '-8px', backgroundColor: '#000', color: 'white', fontSize: '0.625rem', fontWeight: '600', borderRadius: '50%', height: '16px', width: '16px', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                                    {cartItemCount}
                                </span>
                            )}
                        </Link>
                        <button onClick={() => setMobileMenuOpen(!mobileMenuOpen)} style={{ background: 'none', border: 'none', cursor: 'pointer' }}>
                            {mobileMenuOpen ? <FaTimes size={24} color="#000" /> : <FaBars size={24} color="#000" />}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Menu */}
            {mobileMenuOpen && (
                <div className="mobile-menu" style={{
                    backgroundColor: '#FFFFFF',
                    borderTop: '1px solid #E5E5E5',
                    padding: '2rem'
                }}>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
                        <Link to="/products" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            SHOP
                        </Link>
                        <Link to="/new" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            NEW
                        </Link>
                        <Link to="/orders" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            ORDERS
                        </Link>
                        {user?.role === 'admin' && (
                            <Link to="/admin/dashboard" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                ADMIN DASHBOARD
                            </Link>
                        )}
                        <Link to="/wishlist" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            WISHLIST
                        </Link>
                        <Link to="/track" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                            TRACK ORDER
                        </Link>
                        {user ? (
                            <button onClick={handleLogout} style={{ background: 'none', border: 'none', cursor: 'pointer', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase', color: '#000', textAlign: 'left', padding: 0 }}>
                                LOGOUT
                            </button>
                        ) : (
                            <>
                                <Link to="/login?role=user" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    USER
                                </Link>
                                <Link to="/login?role=admin" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '600', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    ADMIN
                                </Link>
                                <Link to="/register" onClick={closeMobileMenu} style={{ color: '#000', textDecoration: 'none', fontSize: '1rem', fontWeight: '500', letterSpacing: '0.05em', textTransform: 'uppercase' }}>
                                    REGISTER
                                </Link>
                            </>
                        )}
                    </div>
                </div>
            )}
        </nav>
    );
};

export default Navbar;
