import React, { useState, useContext } from 'react';
import { useNavigate, Link, useLocation } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import toast from 'react-hot-toast';

const Login = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const { login } = useContext(AuthContext);
    const navigate = useNavigate();
    const location = useLocation();

    // Get role from query params
    const searchParams = new URLSearchParams(location.search);
    const role = searchParams.get('role');

    const handleSubmit = async (e) => {
        e.preventDefault();
        const result = await login(email, password);
        if (result.success) {
            toast.success('Logged in successfully');
            // Redirect based on role if needed, or just home
            if (result.user.role === 'admin') {
                navigate('/admin/dashboard');
            } else {
                navigate('/');
            }
        } else {
            toast.error(result.message);
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
                }}>{role === 'admin' ? 'ADMIN LOGIN' : 'USER LOGIN'}</h2>

                <p style={{
                    textAlign: 'center',
                    color: '#666',
                    marginBottom: '2rem',
                    fontSize: '0.875rem'
                }}>Welcome back</p>

                <form onSubmit={handleSubmit}>
                    <div style={{ marginBottom: '1.5rem' }}>
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

                    <div style={{ marginBottom: '2rem' }}>
                        <input
                            type="password"
                            placeholder="Password"
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
                        />
                    </div>

                    <div style={{
                        display: 'flex',
                        justifyContent: 'flex-end',
                        marginBottom: '1.5rem',
                        marginTop: '-1rem'
                    }}>
                        <Link
                            to="/forgot-password"
                            style={{
                                fontSize: '0.75rem',
                                color: '#666',
                                textDecoration: 'none',
                                transition: 'color 0.3s'
                            }}
                            onMouseEnter={(e) => e.target.style.color = '#000'}
                            onMouseLeave={(e) => e.target.style.color = '#666'}
                        >
                            Forgot Password?
                        </Link>
                    </div>

                    <button
                        type="submit"
                        style={{
                            width: '100%',
                            padding: '1rem',
                            backgroundColor: '#000',
                            color: 'white',
                            border: '1px solid #000',
                            fontSize: '0.875rem',
                            fontWeight: '400',
                            cursor: 'pointer',
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
                        Login
                    </button>
                </form>

                <p style={{ textAlign: 'center', fontSize: '0.875rem', color: '#666' }}>
                    Don't have an account?{' '}
                    <Link to="/register" style={{ color: '#000', textDecoration: 'underline' }}>
                        Register
                    </Link>
                </p>
            </div>
        </div>
    );
};

export default Login;
