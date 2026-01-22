import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
    return (
        <footer style={{
            backgroundColor: '#000000',
            borderTop: '1px solid #333',
            padding: '4rem 0 2rem'
        }}>
            <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                <div className="footer-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
                    gap: '3rem',
                    marginBottom: '3rem'
                }}>
                    <style>{`
                        @media (max-width: 768px) {
                            .footer-grid {
                                grid-template-columns: repeat(2, 1fr) !important;
                                gap: 2rem !important;
                            }
                        }
                        @media (max-width: 480px) {
                            .footer-grid {
                                grid-template-columns: 1fr !important;
                                gap: 2rem !important;
                                text-align: center;
                            }
                            .footer-grid h2,
                            .footer-grid h3 {
                                margin-bottom: 1rem !important;
                            }
                            .footer-grid ul {
                                align-items: center;
                            }
                        }
                    `}</style>
                    {/* Brand */}
                    <div>
                        <h2 style={{
                            fontSize: '1.25rem',
                            fontWeight: '300',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            color: '#FFF',
                            marginBottom: '1rem'
                        }}>
                            SoulStyle
                        </h2>
                        <p style={{
                            color: '#999',
                            fontSize: '0.875rem',
                            lineHeight: '1.6'
                        }}>
                            Premium footwear for every occasion.
                        </p>
                    </div>

                    {/* Customer Service */}
                    <div>
                        <h3 style={{
                            fontWeight: '400',
                            marginBottom: '1rem',
                            color: '#FFF',
                            fontSize: '0.875rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}>
                            Customer Service
                        </h3>
                        <ul style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            fontSize: '0.875rem',
                            listStyle: 'none',
                            padding: 0
                        }}>
                            <li>
                                <Link
                                    to="#"
                                    style={{
                                        color: '#999',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                                >
                                    Contact
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    FAQ
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    Shipping & Returns
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* About */}
                    <div>
                        <h3 style={{
                            fontWeight: '400',
                            marginBottom: '1rem',
                            color: '#FFF',
                            fontSize: '0.875rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}>
                            About
                        </h3>
                        <ul style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            fontSize: '0.875rem',
                            listStyle: 'none',
                            padding: 0
                        }}>
                            <li>
                                <Link
                                    to="#"
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    Our Story
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    Careers
                                </Link>
                            </li>
                            <li>
                                <Link
                                    to="#"
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    Privacy Policy
                                </Link>
                            </li>
                        </ul>
                    </div>

                    {/* Social */}
                    <div>
                        <h3 style={{
                            fontWeight: '400',
                            marginBottom: '1rem',
                            color: '#FFF',
                            fontSize: '0.875rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase'
                        }}>
                            Follow Us
                        </h3>
                        <ul style={{
                            display: 'flex',
                            flexDirection: 'column',
                            gap: '0.75rem',
                            fontSize: '0.875rem',
                            listStyle: 'none',
                            padding: 0
                        }}>
                            <li>
                                <a
                                    href="#"
                                    style={{
                                        color: '#999',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#FFF'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#999'}
                                >
                                    Instagram
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    Facebook
                                </a>
                            </li>
                            <li>
                                <a
                                    href="#"
                                    style={{
                                        color: '#666',
                                        textDecoration: 'none',
                                        transition: 'color 0.3s'
                                    }}
                                    onMouseEnter={(e) => e.currentTarget.style.color = '#000'}
                                    onMouseLeave={(e) => e.currentTarget.style.color = '#666'}
                                >
                                    Twitter
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                {/* Copyright */}
                <div style={{
                    borderTop: '1px solid #333',
                    paddingTop: '2rem',
                    textAlign: 'center'
                }}>
                    <p style={{
                        color: '#666',
                        fontSize: '0.75rem',
                        letterSpacing: '0.05em',
                        textTransform: 'uppercase'
                    }}>
                        © 2025 SoulStyle. All rights reserved.
                    </p>
                </div>
            </div>
        </footer >
    );
};

export default Footer;
