import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const ForgotPassword = () => {
    const [email, setEmail] = useState('');
    const [submitted, setSubmitted] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            await axios.post('http://localhost:5002/api/auth/forgot-password', { email });
            setSubmitted(true);
            toast.success('Password reset link sent to your email');
        } catch (error) {
            console.error('Forgot password error:', error);
            toast.error(error.response?.data?.message || 'Error sending reset link');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div style={{
            minHeight: '100vh',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            backgroundColor: '#F5F5F5',
            padding: '2rem'
        }}>
            <div style={{
                backgroundColor: 'white',
                padding: '3rem',
                maxWidth: '420px',
                width: '100%',
                border: '1px solid #E5E5E5'
            }}>
                <h2 style={{
                    fontSize: '1.75rem',
                    fontWeight: '300',
                    textAlign: 'center',
                    marginBottom: '0.5rem',
                    color: '#000',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}>Reset Password</h2>

                {!submitted ? (
                    <>
                        <p style={{
                            textAlign: 'center',
                            color: '#666',
                            marginBottom: '2rem',
                            fontSize: '0.875rem'
                        }}>Enter your email to receive a reset link</p>

                        <form onSubmit={handleSubmit}>
                            <div style={{ marginBottom: '2rem' }}>
                                <input
                                    type="email"
                                    placeholder="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    style={{
                                        width: '100%',
                                        padding: '1rem',
                                        border: '1px solid #E5E5E5',
                                        fontSize: '0.875rem',
                                        outline: 'none',
                                        boxSizing: 'border-box',
                                        transition: 'border-color 0.3s'
                                    }}
                                    onFocus={(e) => e.currentTarget.style.borderColor = '#000'}
                                    onBlur={(e) => e.currentTarget.style.borderColor = '#E5E5E5'}
                                    required
                                />
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                style={{
                                    width: '100%',
                                    padding: '1rem',
                                    backgroundColor: loading ? '#ccc' : '#000',
                                    color: 'white',
                                    border: '1px solid #000',
                                    fontSize: '0.875rem',
                                    fontWeight: '400',
                                    cursor: loading ? 'not-allowed' : 'pointer',
                                    marginBottom: '1.5rem',
                                    letterSpacing: '0.1em',
                                    textTransform: 'uppercase',
                                    transition: 'all 0.3s'
                                }}
                                onMouseEnter={(e) => {
                                    e.currentTarget.style.backgroundColor = 'transparent';
                                    e.currentTarget.style.color = '#000';
                                }}
                                onMouseLeave={(e) => {
                                    e.currentTarget.style.backgroundColor = '#000';
                                    e.currentTarget.style.color = 'white';
                                }}
                            >
                                {loading ? 'Sending...' : 'Send Reset Link'}
                            </button>
                        </form>
                    </>
                ) : (
                    <div style={{ textAlign: 'center' }}>
                        <div style={{
                            fontSize: '3rem',
                            marginBottom: '1rem',
                            color: '#4CAF50'
                        }}>
                            ✓
                        </div>
                        <p style={{
                            color: '#666',
                            marginBottom: '2rem',
                            fontSize: '0.875rem',
                            lineHeight: '1.6'
                        }}>
                            If an account exists for <strong>{email}</strong>, you will receive password reset instructions shortly.
                        </p>
                    </div>
                )}

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
                    Remember your password?{' '}
                    <Link to="/login" style={{ color: '#000', textDecoration: 'underline' }}>
                        Login
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default ForgotPassword;
