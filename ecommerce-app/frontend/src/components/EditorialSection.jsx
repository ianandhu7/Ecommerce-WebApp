import React from 'react';
import { Link } from 'react-router-dom';
import newCollection1 from '../assets/newcollection1.png';
import newCollection2 from '../assets/newcollection2.jpg';

const EditorialSection = () => {
    return (
        <section style={{
            padding: '6rem 0',
            backgroundColor: '#FFFFFF'
        }}>
            <div style={{
                maxWidth: '1200px',
                margin: '0 auto',
                padding: '0 2rem'
            }}>
                <div className="editorial-grid" style={{
                    display: 'grid',
                    gridTemplateColumns: '1fr 1fr',
                    gap: '3rem',
                    alignItems: 'stretch'
                }}>
                    {/* Left Column - Full Height Image */}
                    <div style={{
                        position: 'relative',
                        overflow: 'hidden',
                        height: '100%',
                        minHeight: '700px'
                    }}>
                        <img
                            src={newCollection1}
                            alt="Women's Black Outfit"
                            style={{
                                width: '100%',
                                height: '100%',
                                objectFit: 'cover',
                                display: 'block'
                            }}
                        />
                    </div>

                    {/* Right Column - Text + Image */}
                    <div style={{
                        display: 'flex',
                        flexDirection: 'column',
                        gap: '3rem'
                    }}>
                        {/* Text Content */}
                        <div style={{
                            padding: '2rem 0'
                        }}>
                            <h2 style={{
                                fontSize: '2.5rem',
                                fontWeight: '300',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                marginBottom: '2rem',
                                color: '#000',
                                lineHeight: '1.2'
                            }}>
                                New Collections
                            </h2>

                            <p style={{
                                fontSize: '1rem',
                                fontWeight: '300',
                                lineHeight: '1.8',
                                color: '#666',
                                letterSpacing: '0.02em',
                                marginBottom: '2.5rem'
                            }}>
                                A special selection. You must see it. Black asymmetric dresses blazing effortlessly with the light. Oversized hybrids of hoods and padded outerwear, leather jackets with a new twist from Balenciaga's new impression-derived leather craftsmanship. The bags are made with boots.
                            </p>

                            {/* Category Buttons */}
                            <div style={{
                                display: 'flex',
                                gap: '1rem',
                                flexWrap: 'wrap'
                            }}>
                                <Link
                                    to="/products?gender=Women"
                                    style={{
                                        display: 'inline-block',
                                        padding: '1rem 2.5rem',
                                        backgroundColor: '#000',
                                        color: '#fff',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #000'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#fff';
                                        e.currentTarget.style.color = '#000';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#000';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                >
                                    Women's
                                </Link>
                                <Link
                                    to="/products?gender=Men"
                                    style={{
                                        display: 'inline-block',
                                        padding: '1rem 2.5rem',
                                        backgroundColor: '#fff',
                                        color: '#000',
                                        textDecoration: 'none',
                                        fontSize: '0.875rem',
                                        fontWeight: '500',
                                        letterSpacing: '0.1em',
                                        textTransform: 'uppercase',
                                        transition: 'all 0.3s ease',
                                        border: '1px solid #000'
                                    }}
                                    onMouseEnter={(e) => {
                                        e.currentTarget.style.backgroundColor = '#000';
                                        e.currentTarget.style.color = '#fff';
                                    }}
                                    onMouseLeave={(e) => {
                                        e.currentTarget.style.backgroundColor = '#fff';
                                        e.currentTarget.style.color = '#000';
                                    }}
                                >
                                    Men's
                                </Link>
                            </div>
                        </div>

                        {/* Second Image */}
                        <div style={{
                            position: 'relative',
                            overflow: 'hidden',
                            flex: '1',
                            minHeight: '400px'
                        }}>
                            <img
                                src={newCollection2}
                                alt="Men's Black Outfit"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover',
                                    display: 'block'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>

            {/* Responsive Styles */}
            <style>{`
                @media (max-width: 768px) {
                    .editorial-grid {
                        grid-template-columns: 1fr !important;
                        gap: 2rem !important;
                    }
                    
                    .editorial-grid > div:first-child {
                        min-height: 500px !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default EditorialSection;
