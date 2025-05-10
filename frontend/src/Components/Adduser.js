import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthHeader from './AuthHeader';

export default function Adduser() {
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        homeAddress: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: ''
    });

    const [alert, setAlert] = useState({
        show: false,
        type: '',
        message: ''
    });

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post('http://localhost:5000/user/add', formData);
            setAlert({
                show: true,
                type: 'success',
                 message: response.data.message || 'User registered successfully!'
            });
            setFormData({
                firstName: '',
                lastName: '',
                homeAddress: '',
                email: '',
                phoneNumber: '',
                role: '',
                password: ''
            });
        } catch (error) {
            if (error.response?.data?.includes('E11000 duplicate key error')) {
                if (error.response.data.includes('email_1 dup key')) {
                    setAlert({
                        show: true,
                        type: 'danger',
                        message: 'This email is already registered!'
                    });
                } else if (error.response.data.includes('phoneNumber_1 dup key')) {
                    setAlert({
                        show: true,
                        type: 'danger',
                        message: 'This phone number is already registered!'
                    });
                }
            } else {
                setAlert({
                    show: true,
                    type: 'danger',
                    message: error.response?.data?.message || 'Error creating user.'
                });
            }
        }
    };

    return (
        <>
            <AuthHeader />
            <div className="container mt-5">
                {alert.show && (
                    <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
                        {alert.message}
                        <button type="button" className="btn-close" onClick={() => setAlert({ ...alert, show: false })} aria-label="Close"></button>
                    </div>
                )}
                <div className="row justify-content-center">
                    <div className="card shadow-sm">
                        <div className="card-body">
                            <h3 className="card-title mb-4 text-center">User Registration</h3>
                            <form onSubmit={handleSubmit}>
                                <div className="row g-3">
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="firstName"
                                                name="firstName"
                                                placeholder="First Name"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="firstName">First Name</label>
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className="form-control"
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Last Name"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="lastName">Last Name</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className="form-control"
                                                id="email"
                                                name="email"
                                                placeholder="name@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="email">Email Address</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="tel"
                                                className="form-control"
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                placeholder="Phone Number"
                                                pattern="[0-9]{10}"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea
                                                className="form-control"
                                                id="homeAddress"
                                                name="homeAddress"
                                                placeholder="Address"
                                                value={formData.homeAddress}
                                                onChange={handleChange}
                                                style={{ height: '100px' }}
                                                required
                                            />
                                            <label htmlFor="homeAddress">Home Address</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <select
                                                className="form-select"
                                                id="role"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                                required
                                            >
                                                <option value="">Select Role</option>
                                                <option value="customer">Customer</option>
                                                <option value="businessman">Businessman</option>
                                            </select>
                                            <label htmlFor="role">Role</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className="form-control"
                                                id="password"
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleChange}
                                                required
                                            />
                                            <label htmlFor="password">Password</label>
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <button type="submit" className="btn btn-primary w-100">
                                            Register
                                        </button>
                                    </div>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            </div>
        </>
    );
}