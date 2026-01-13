import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import EditorialSection from '../components/EditorialSection';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';

const New = () => {
    const [newProducts, setNewProducts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchNewProducts = async () => {
            try {
                const res = await axios.get('http://localhost:5002/api/products');
                // Get the latest 8 products (or you can modify this logic)
                const latestProducts = res.data.slice(0, 8);
                setNewProducts(latestProducts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching new products:', error);
                setLoading(false);
            }
        };

        fetchNewProducts();
    }, []);

    return (
        <div style={{
            backgroundColor: '#FFFFFF',
            paddingTop: '80px',
            minHeight: '100vh'
        }}>
            {/* Hero Banner - New Collections */}
            <section style={{
                backgroundColor: '#000',
                color: '#fff',
                padding: '6rem 2rem',
                textAlign: 'center'
            }}>
                <div style={{
                    maxWidth: '800px',
                    margin: '0 auto'
                }}>
                    <p style={{
                        fontSize: '0.875rem',
                        fontWeight: '500',
                        letterSpacing: '0.2em',
                        textTransform: 'uppercase',
                        marginBottom: '1rem',
                        color: '#999'
                    }}>
                        Just Arrived
                    </p>
                    <h1 style={{
                        fontSize: '3.5rem',
                        fontWeight: '300',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                        lineHeight: '1.2'
                    }}>
                        New Collections
                    </h1>
                    <p style={{
                        fontSize: '1.125rem',
                        fontWeight: '300',
                        lineHeight: '1.8',
                        color: '#ccc',
                        letterSpacing: '0.02em',
                        maxWidth: '600px',
                        margin: '0 auto 2.5rem'
                    }}>
                        Discover our latest arrivals. Premium footwear crafted for those who appreciate timeless design and exceptional quality.
                    </p>
                    <Link
                        to="/products"
                        style={{
                            display: 'inline-block',
                            padding: '1rem 3rem',
                            backgroundColor: '#fff',
                            color: '#000',
                            textDecoration: 'none',
                            fontSize: '0.875rem',
                            fontWeight: '500',
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s ease',
                            border: '1px solid #fff'
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
                        Shop All Products
                    </Link>
                </div>
            </section>

            {/* Editorial Section */}
            <EditorialSection />

            {/* Latest Products */}
            <section style={{ padding: '6rem 0' }}>
                <div style={{
                    maxWidth: '1400px',
                    margin: '0 auto',
                    padding: '0 2rem'
                }}>
                    <SectionHeader
                        title="Latest Arrivals"
                        linkText="View all products"
                        linkTo="/products"
                    />

                    {loading ? (
                        <div style={{
                            textAlign: 'center',
                            padding: '4rem 0',
                            fontSize: '0.875rem',
                            letterSpacing: '0.05em',
                            textTransform: 'uppercase',
                            color: '#666'
                        }}>
                            Loading products...
                        </div>
                    ) : (
                        <div style={{
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                            gap: '2rem'
                        }}>
                            {newProducts.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    image={product.image}
                                    name={product.name}
                                    brand={product.brand}
                                    price={product.price}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </section>

            {/* Call to Action */}
            <section style={{
                backgroundColor: '#F3F4F6',
                padding: '4rem 2rem',
                textAlign: 'center'
            }}>
                <div style={{
                    maxWidth: '600px',
                    margin: '0 auto'
                }}>
                    <h2 style={{
                        fontSize: '2rem',
                        fontWeight: '300',
                        letterSpacing: '0.1em',
                        textTransform: 'uppercase',
                        marginBottom: '1.5rem',
                        color: '#000'
                    }}>
                        Looking for something specific?
                    </h2>
                    <p style={{
                        fontSize: '1rem',
                        fontWeight: '300',
                        lineHeight: '1.8',
                        color: '#666',
                        marginBottom: '2rem'
                    }}>
                        Browse our complete collection of premium footwear for men and women.
                    </p>
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        flexWrap: 'wrap'
                    }}>
                        <Link
                            to="/products?gender=Women"
                            style={{
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
                            Shop Women's
                        </Link>
                        <Link
                            to="/products?gender=Men"
                            style={{
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
                            Shop Men's
                        </Link>
                    </div>
                </div>
            </section>
        </div>
    );
};

export default New;
