import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthHeader from './AuthHeader';

export default function Login() {
    const [credentials, setCredentials] = useState({
        email: '',
        password: ''
    });
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const navigate = useNavigate();

    const handleChange = (e) => {
        const { name, value } = e.target;
        setCredentials(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/user/login', credentials);
            const { token, user } = response.data;
            
            localStorage.setItem('authToken', token);
            
            if (user.role === 'customer') {
                navigate('/customer-dashboard');
            } else if (user.role === 'businessman') {
                navigate('/business-dashboard');
            }
            localStorage.setItem('user', JSON.stringify(response.data.user));
        } catch (error) {
            setAlert({
                show: true,
                type: 'danger',
                message: error.response?.data?.message || 'Invalid email or password.'
            });
        }
    };

    return (
        <>
            <AuthHeader />
            <div className="container mt-5">
                {alert.show && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                        {alert.message}
                        <button 
                            type="button" 
                            className="btn-close" 
                            onClick={() => setAlert({ ...alert, show: false })}
                            aria-label="Close">
                        </button>
                    </div>
                )}
                
                <div className="row justify-content-center">
                    <div className="col-md-6">
                        <div className="card shadow-sm">
                            <div className="card-body">
                                <h3 className="card-title text-center mb-4">Login</h3>
                                <form onSubmit={handleSubmit}>
                                    <div className="mb-3">
                                        <label htmlFor="email" className="form-label">Email address</label>
                                        <input
                                            type="email"
                                            className="form-control"
                                            id="email"
                                            name="email"
                                            value={credentials.email}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <div className="mb-3">
                                        <label htmlFor="password" className="form-label">Password</label>
                                        <input
                                            type="password"
                                            className="form-control"
                                            id="password"
                                            name="password"
                                            value={credentials.password}
                                            onChange={handleChange}
                                            required
                                        />
                                    </div>
                                    <button type="submit" className="btn btn-primary w-100 mb-3">
                                        Login
                                    </button>
                                </form>
                                <div className="text-center">
                                    <p className="mb-0">Don't have an account?</p>
                                    <Link to="/adduser" className="btn btn-link">
                                        Create Account
                                    </Link>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}