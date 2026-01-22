import React from 'react';
import Hero from '../components/Hero';
import ProductList from './ProductList';
import Newsletter from '../components/Newsletter';

const Home = () => {
    return (
        <div>
            <Hero />
            <ProductList />
            <Newsletter />
        </div>
    );
};

export default Home;
