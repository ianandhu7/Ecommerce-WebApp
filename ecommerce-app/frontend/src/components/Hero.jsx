import React from 'react';
import { Link } from 'react-router-dom';
import heroModel from '../assets/download.jpg';

const Hero = () => {
    return (
        <section style={{
            position: 'relative',
            minHeight: '100vh',
            display: 'flex',
            alignItems: 'center',
            marginTop: '-80px',
            paddingTop: '80px'
        }}>
            {/* Background with Blue Gradient */}
            <div style={{
                position: 'absolute',
                top: 0,
                left: 0,
                right: 0,
                bottom: 0,
                background: 'linear-gradient(to bottom, #7DB3E9 0%, #A3C7EE 50%, #E8D5C4 100%)'
            }} />

            {/* Container */}
            <div style={{
                position: 'relative',
                zIndex: 10,
                maxWidth: '1600px',
                width: '100%',
                margin: '0 auto',
                padding: '0 3rem',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                gap: '2rem'
            }}>
                {/* Left Content */}
                <div style={{ flex: '0 0 45%', maxWidth: '600px' }}>
                    <div style={{
                        display: 'inline-block',
                        backgroundColor: 'white',
                        padding: '0.5rem 1.5rem',
                        marginBottom: '2rem',
                        fontSize: '0.7rem',
                        fontWeight: '400',
                        letterSpacing: '0.15em',
                        textTransform: 'uppercase'
                    }}>
                        New Collection
                    </div>

                    <h1 style={{
                        fontSize: 'clamp(3rem, 7vw, 6rem)',
                        fontWeight: '300',
                        letterSpacing: '0.02em',
                        lineHeight: '1',
                        marginBottom: '1.5rem',
                        color: 'white',
                        textTransform: 'uppercase'
                    }}>
                        New<br />Collection
                    </h1>

                    <p style={{
                        fontSize: 'clamp(0.9rem, 1.5vw, 1.1rem)',
                        fontWeight: '300',
                        letterSpacing: '0.1em',
                        marginBottom: '3rem',
                        color: 'white',
                        textTransform: 'uppercase',
                        lineHeight: '1.6'
                    }}>
                        22/23 Autumn-Winter<br />
                        Coats and Jackets
                    </p>

                    <Link
                        to="/products"
                        style={{
                            display: 'inline-block',
                            padding: '1rem 2.5rem',
                            backgroundColor: '#000',
                            color: 'white',
                            textDecoration: 'none',
                            fontSize: '0.75rem',
                            fontWeight: '500',
                            letterSpacing: '0.15em',
                            textTransform: 'uppercase',
                            border: 'none',
                            transition: 'all 0.3s ease'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.backgroundColor = 'white';
                            e.currentTarget.style.color = '#000';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.backgroundColor = '#000';
                            e.currentTarget.style.color = 'white';
                        }}
                    >
                        Shop now
                    </Link>
                </div>

                {/* Right Image */}
                <div style={{
                    flex: '1',
                    height: '100vh',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'flex-end',
                    position: 'relative'
                }}>
                    <img
                        src={heroModel}
                        alt="Fashion Model"
                        style={{
                            height: '100%',
                            width: 'auto',
                            maxWidth: '100%',
                            objectFit: 'cover',
                            objectPosition: 'center'
                        }}
                    />
                </div>
            </div>

            {/* Responsive Styles */}
            <style>{`
                @media (max-width: 968px) {
                    section > div {
                        flex-direction: column !important;
                        padding: 2rem !important;
                    }
                    section > div > div:first-child {
                        flex: 1 !important;
                        max-width: 100% !important;
                        text-align: center;
                    }
                    section > div > div:last-child {
                        height: 50vh !important;
                        width: 100%;
                        justify-content: center !important;
                    }
                }
            `}</style>
        </section>
    );
};

export default Hero;
