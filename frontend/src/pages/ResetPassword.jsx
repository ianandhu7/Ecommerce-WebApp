import React, { useState } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import axios from 'axios';

const ResetPassword = () => {
    const [searchParams] = useSearchParams();
    const token = searchParams.get('token');
    const navigate = useNavigate();

    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false);

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (password !== confirmPassword) {
            toast.error('Passwords do not match');
            return;
        }

        setLoading(true);
        try {
            await axios.post('http://localhost:5002/api/auth/reset-password', {
                token,
                password
            });
            toast.success('Password reset successfully');
            navigate('/login');
        } catch (error) {
            console.error('Reset password error:', error);
            toast.error(error.response?.data?.message || 'Error resetting password');
        } finally {
            setLoading(false);
        }
    };

    if (!token) {
        return (
            <div style={{
                minHeight: '100vh',
                display: 'flex',
                justifyContent: 'center',
                alignItems: 'center',
                backgroundColor: '#F5F5F5',
                padding: '2rem'
            }}>
                <div style={{ textAlign: 'center', color: '#666' }}>
                    Invalid or missing reset token.
                </div>
            </div>
        );
    }

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
                    marginBottom: '2rem',
                    color: '#000',
                    letterSpacing: '0.1em',
                    textTransform: 'uppercase'
                }}>New Password</h2>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
                        <input
                            type="password"
                            placeholder="New Password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
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
                            minLength={6}
                        />
                    </div>

                    <div style={{ marginBottom: '2rem' }}>
                        <input
                            type="password"
                            placeholder="Confirm New Password"
                            value={confirmPassword}
                            onChange={(e) => setConfirmPassword(e.target.value)}
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
                            letterSpacing: '0.1em',
                            textTransform: 'uppercase',
                            transition: 'all 0.3s'
                        }}
                        onMouseEnter={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = 'transparent';
                                e.currentTarget.style.color = '#000';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!loading) {
                                e.currentTarget.style.backgroundColor = '#000';
                                e.currentTarget.style.color = 'white';
                            }
                        }}
                    >
                        {loading ? 'Resetting...' : 'Reset Password'}
                    </button>
                </form>
            </div>
        </div>
    );
};

export default ResetPassword;
