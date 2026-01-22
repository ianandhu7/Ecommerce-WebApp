import React from 'react';
import { Link } from 'react-router-dom';

const NewCollections = () => {
    return (
        <section style={{
            padding: '3rem 2rem',
            backgroundColor: '#FFF'
        }}>
            <div style={{
                maxWidth: '1400px',
                margin: '0 auto',
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
                gap: '3rem',
                alignItems: 'center'
            }}>
                {/* Left Image */}
                <div style={{
                    width: '100%',
                    height: '600px',
                    backgroundColor: '#E5E5E5',
                    overflow: 'hidden'
                }}>
                    <img
                        src="/api/placeholder/600/600"
                        alt="Collection Model"
                        style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover'
                        }}
                    />
                </div>

                {/* Right Content */}
                <div>
                    <h2 style={{
                        fontSize: 'clamp(2rem, 4vw, 3rem)',
                        fontWeight: '400',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                        color: '#000'
                    }}>
                        New Collections
                    </h2>

                    <p style={{
                        fontSize: '1rem',
                        color: '#666',
                        lineHeight: '1.8',
                        marginBottom: '2rem',
                        maxWidth: '500px'
                    }}>
                        A special selection. You must see it. Black asymmetric dresses blazing effortlessly with the light. Oversized hybrids of hoods and padded outerwear, leather jackets with a new twist from Balenciaga's new impression-derived leather craftsmanship. The bags are made with boots.
                    </p>

                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        flexWrap: 'wrap'
                    }}>
                        <Link
                            to="/products"
                            style={{
                                padding: '1rem 2.5rem',
                                backgroundColor: '#000',
                                color: '#FFF',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'background-color 0.3s'
                            }}
                            onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                            onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                        >
                            Women's
                        </Link>

                        <Link
                            to="/products"
                            style={{
                                padding: '1rem 2.5rem',
                                backgroundColor: '#FFF',
                                color: '#000',
                                border: '1px solid #000',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                transition: 'all 0.3s'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.backgroundColor = '#000';
                                e.currentTarget.style.color = '#FFF';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.backgroundColor = '#FFF';
                                e.currentTarget.style.color = '#000';
                            }}
                        >
                            Men's
                        </Link>
                    </div>

                    {/* Bottom Image Grid */}
                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(2, 1fr)',
                        gap: '1rem',
                        marginTop: '2rem',
                        maxWidth: '500px'
                    }}>
                        <div style={{
                            height: '250px',
                            backgroundColor: '#E5E5E5',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="/api/placeholder/300/300"
                                alt="Collection 1"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                        <div style={{
                            height: '250px',
                            backgroundColor: '#E5E5E5',
                            overflow: 'hidden'
                        }}>
                            <img
                                src="/api/placeholder/300/300"
                                alt="Collection 2"
                                style={{
                                    width: '100%',
                                    height: '100%',
                                    objectFit: 'cover'
                                }}
                            />
                        </div>
                    </div>
                </div>
            </div>
        </section>
    );
};

export default NewCollections;
