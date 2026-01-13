import React, { useState } from 'react';

const Newsletter = () => {
    const [email, setEmail] = useState('');

    const handleSubscribe = (e) => {
        e.preventDefault();
        // Handle subscription logic here
        console.log('Subscribed with email:', email);
        setEmail('');
    };

    return (
        <section style={{
            backgroundColor: '#F5F5F5',
            padding: '3rem 2rem',
            textAlign: 'center'
        }}>
            <div style={{
                maxWidth: '800px',
                margin: '0 auto'
            }}>
                <h2 style={{
                    fontSize: 'clamp(2rem, 4vw, 3rem)',
                    fontWeight: '700',
                    marginBottom: '1rem',
                    color: '#000',
                    letterSpacing: '0.02em'
                }}>
                    Join the Stylelist
                </h2>

                <p style={{
                    fontSize: 'clamp(1rem, 2vw, 1.125rem)',
                    color: '#666',
                    marginBottom: '2.5rem',
                    lineHeight: '1.6'
                }}>
                    Subscribe for exclusive offers, original stories, events and more.
                </p>

                <form onSubmit={handleSubscribe} style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    maxWidth: '600px',
                    margin: '0 auto',
                    flexWrap: 'wrap'
                }}>
                    <input
                        type="email"
                        placeholder="Enter your email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                        style={{
                            flex: '1',
                            minWidth: '280px',
                            padding: '1rem 1.5rem',
                            fontSize: '1rem',
                            border: '1px solid #E5E5E5',
                            backgroundColor: '#FFF',
                            outline: 'none',
                            transition: 'border-color 0.3s'
                        }}
                        onFocus={(e) => e.target.style.borderColor = '#000'}
                        onBlur={(e) => e.target.style.borderColor = '#E5E5E5'}
                    />

                    <button
                        type="submit"
                        style={{
                            padding: '1rem 2.5rem',
                            backgroundColor: '#000',
                            color: '#FFF',
                            border: 'none',
                            fontSize: '1rem',
                            fontWeight: '600',
                            cursor: 'pointer',
                            transition: 'background-color 0.3s',
                            letterSpacing: '0.05em'
                        }}
                        onMouseEnter={(e) => e.currentTarget.style.backgroundColor = '#333'}
                        onMouseLeave={(e) => e.currentTarget.style.backgroundColor = '#000'}
                    >
                        Subscribe
                    </button>
                </form>
            </div>
        </section>
    );
};

export default Newsletter;
