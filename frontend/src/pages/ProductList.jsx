import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import axios from 'axios';
import ProductCard from '../components/ProductCard';
import SectionHeader from '../components/SectionHeader';
import EditorialSection from '../components/EditorialSection';

const ProductList = () => {
    const [products, setProducts] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchParams] = useSearchParams();
    const gender = searchParams.get('gender');
    const searchQuery = searchParams.get('search');

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                let url = 'http://localhost:5002/api/products';
                if (gender) {
                    url += `?gender=${gender}`;
                }

                const res = await axios.get(url);
                let filteredProducts = res.data;

                // Filter by search query if present
                if (searchQuery) {
                    const query = searchQuery.toLowerCase();
                    filteredProducts = filteredProducts.filter(product =>
                        product.name.toLowerCase().includes(query) ||
                        product.brand.toLowerCase().includes(query) ||
                        (product.category && product.category.toLowerCase().includes(query))
                    );
                }

                setProducts(filteredProducts);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching products:', error);
                setLoading(false);
            }
        };

        fetchProducts();
    }, [gender, searchQuery]);

    if (loading) {
        return (
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
        );
    }

    // Determine section title based on gender filter or search
    const getSectionTitle = () => {
        if (searchQuery) return `Search Results for "${searchQuery}"`;
        if (gender === 'Men') return "Men's Collection";
        if (gender === 'Women') return "Women's Collection";
        return 'All Products';
    };

    return (
        <div className="product-list-container" style={{
            backgroundColor: '#FFFFFF',
            paddingTop: '80px',
            minHeight: 'auto',
            height: 'auto'
        }}>
            <style>{`
                @media (max-width: 768px) {
                    .product-list-container {
                        padding-top: 60px !important;
                    }
                    .product-list-section {
                        padding: 2rem 0 !important;
                    }
                    .product-container {
                        padding: 0 1rem !important;
                    }
                }
                @media (max-width: 480px) {
                    .product-list-container {
                        padding-top: 60px !important;
                    }
                    .product-list-section {
                        padding: 1.5rem 0 !important;
                    }
                    .product-container {
                        padding: 0 0.75rem !important;
                    }
                }
            `}</style>
            {/* Products Section */}
            <section className="product-list-section" style={{ padding: '4rem 0' }}>
                <div className="product-container" style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 2rem' }}>
                    <SectionHeader title={getSectionTitle()} />

                    {/* Filter Buttons */}
                    <div style={{
                        display: 'flex',
                        gap: '1rem',
                        justifyContent: 'center',
                        marginTop: '2rem',
                        marginBottom: '3rem',
                        flexWrap: 'wrap'
                    }}>
                        <Link
                            to="/products"
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: !gender ? '#000' : '#fff',
                                color: !gender ? '#fff' : '#000',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                border: '1px solid #000',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            All Products
                        </Link>
                        <Link
                            to="/products?gender=Women"
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: gender === 'Women' ? '#000' : '#fff',
                                color: gender === 'Women' ? '#fff' : '#000',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                border: '1px solid #000',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Women's
                        </Link>
                        <Link
                            to="/products?gender=Men"
                            style={{
                                padding: '0.75rem 2rem',
                                backgroundColor: gender === 'Men' ? '#000' : '#fff',
                                color: gender === 'Men' ? '#fff' : '#000',
                                textDecoration: 'none',
                                fontSize: '0.875rem',
                                fontWeight: '500',
                                letterSpacing: '0.1em',
                                textTransform: 'uppercase',
                                border: '1px solid #000',
                                transition: 'all 0.3s ease'
                            }}
                        >
                            Men's
                        </Link>
                    </div>

                    <div style={{
                        display: 'grid',
                        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
                        gap: '2rem',
                        height: 'auto',
                        minHeight: 'auto',
                        overflow: 'visible'
                    }}>
                        {products.length > 0 ? (
                            products.map((product) => (
                                <ProductCard
                                    key={product.id}
                                    id={product.id}
                                    image={product.image}
                                    name={product.name}
                                    brand={product.brand}
                                    price={product.price}
                                />
                            ))
                        ) : (
                            <div style={{
                                gridColumn: '1 / -1',
                                textAlign: 'center',
                                padding: '4rem 0',
                                color: '#666',
                                fontSize: '0.875rem',
                                letterSpacing: '0.05em',
                                textTransform: 'uppercase'
                            }}>
                                No products found
                            </div>
                        )}
                    </div>
                </div>
            </section>

            {/* Editorial Section - Only show when viewing all products */}
            {!gender && <EditorialSection />}
        </div>
    );
};

export default ProductList;
