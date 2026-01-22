import React, { useContext, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import { CartContext } from '../context/CartContext';
import toast from 'react-hot-toast';

const Product = () => {
    const { id } = useParams();
    const { addToCart } = useContext(CartContext);
    const [product, setProduct] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                const res = await axios.get(`http://localhost:5002/api/products/${id}`);
                setProduct(res.data);
                setLoading(false);
            } catch (error) {
                console.error('Error fetching product:', error);
                setLoading(false);
            }
        };

        fetchProduct();
    }, [id]);

    if (loading) {
        return <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>Loading...</div>;
    }

    if (!product) {
        return (
            <div style={{ padding: '4rem 1rem', textAlign: 'center' }}>
                <h2>Product not found</h2>
            </div>
        );
    }

    const handleAddToCart = () => {
        addToCart(product);
        toast.success(`${product.name} added to cart!`);
    };

    return (
        <div className="container" style={{ padding: '4rem 1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '3rem', maxWidth: '1000px', margin: '0 auto' }}>
                {/* Product Image */}
                <div style={{
                    backgroundColor: '#e5e7eb',
                    borderRadius: '0.5rem',
                    overflow: 'hidden',
                    aspectRatio: '1 / 1',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center'
                }}>
                    <img
                        src={product.image}
                        alt={product.name}
                        style={{ width: '100%', height: '100%', objectFit: 'cover', mixBlendMode: 'multiply', transform: 'scale(1.5)' }}
                        onError={(e) => { e.target.src = 'https://via.placeholder.com/300'; }}
                    />
                </div>

                {/* Product Details */}
                <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.5rem', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
                        {product.category}
                    </p>
                    <h1 style={{ fontSize: '2.5rem', fontWeight: '800', marginBottom: '0.5rem', color: '#111827' }}>
                        {product.name}
                    </h1>
                    <p style={{ fontSize: '1.25rem', color: '#6b7280', marginBottom: '1.5rem' }}>
                        {product.brand}
                    </p>
                    <p style={{ fontSize: '2rem', fontWeight: '700', color: '#2563eb', marginBottom: '2rem' }}>
                        ${product.price}
                    </p>

                    {product.description && (
                        <p style={{ fontSize: '1rem', color: '#4b5563', marginBottom: '2rem', lineHeight: '1.6' }}>
                            {product.description}
                        </p>
                    )}

                    <button
                        onClick={handleAddToCart}
                        className="btn btn-primary"
                        style={{
                            padding: '1rem 2rem',
                            fontSize: '1.125rem',
                            fontWeight: '600',
                            width: '100%',
                            maxWidth: '300px',
                            backgroundColor: '#2563eb',
                            color: 'white',
                            border: 'none',
                            borderRadius: '0.5rem',
                            cursor: 'pointer'
                        }}
                    >
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Product;
