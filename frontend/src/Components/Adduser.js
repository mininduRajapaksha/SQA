import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthHeader from './AuthHeader';

export default function Adduser() {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        firstName: '',
        lastName: '',
        homeAddress: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: ''
    });

    const [errors, setErrors] = useState({});
    const [alert, setAlert] = useState({
        show: false,
        type: '',
        message: ''
    });

    const validateForm = () => {
        const newErrors = {};
        
        // First Name validation
        if (!formData.firstName.trim()) {
            newErrors.firstName = 'First name is required';
        }
        
        // Last Name validation
        if (!formData.lastName.trim()) {
            newErrors.lastName = 'Last name is required';
        }
        
        // Email validation
        if (!formData.email.trim()) {
            newErrors.email = 'Email is required';
        } else if (!/^[^\s@]+@gmail\.com$/.test(formData.email.trim())) {
            newErrors.email = 'Email should be example@gmail.com';
        }
        
        // Phone Number validation
        if (!formData.phoneNumber.trim()) {
            newErrors.phoneNumber = 'Phone number is required';
        } else if (!/^[0-9]{10}$/.test(formData.phoneNumber.trim())) {
            newErrors.phoneNumber = 'Phone number must be 10 digits';
        }
        
        // Address validation
        if (!formData.homeAddress.trim()) {
            newErrors.homeAddress = 'Home address is required';
        }
        
        // Role validation
        if (!formData.role) {
            newErrors.role = 'Please select a role';
        }
        
        // Password validation
        if (!formData.password) {
            newErrors.password = 'Password is required';
        } else if (formData.password.length < 6) {
            newErrors.password = 'Password must be at least 6 characters long';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));
        // Clear error when user starts typing
        if (errors[name]) {
            setErrors(prev => ({
                ...prev,
                [name]: ''
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validateForm()) {
            setAlert({
                show: true,
                type: 'danger',
                message: 'Please fill in all required fields'
            });
            return;
        }

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
                                                className={`form-control ${errors.firstName ? 'is-invalid' : ''}`}
                                                id="firstName"
                                                name="firstName"
                                                placeholder="First Name"
                                                value={formData.firstName}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="firstName">First Name</label>
                                            {errors.firstName && <div className="invalid-feedback">{errors.firstName}</div>}
                                        </div>
                                    </div>
                                    <div className="col-md-6">
                                        <div className="form-floating">
                                            <input
                                                type="text"
                                                className={`form-control ${errors.lastName ? 'is-invalid' : formData.firstName.trim() ? 'is-valid' : ''}`}
                                                id="lastName"
                                                name="lastName"
                                                placeholder="Last Name"
                                                value={formData.lastName}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="lastName">Last Name</label>
                                            {errors.lastName && <div className="invalid-feedback">{errors.lastName}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="email"
                                                className={`form-control ${errors.email ? 'is-invalid' : ''}`}
                                                id="email"
                                                name="email"
                                                placeholder="name@example.com"
                                                value={formData.email}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="email">Email Address</label>
                                            {errors.email && <div className="invalid-feedback">{errors.email}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="tel"
                                                className={`form-control ${errors.phoneNumber ? 'is-invalid' : ''}`}
                                                id="phoneNumber"
                                                name="phoneNumber"
                                                placeholder="Phone Number"
                                                pattern="[0-9]{10}"
                                                value={formData.phoneNumber}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="phoneNumber">Phone Number</label>
                                            {errors.phoneNumber && <div className="invalid-feedback">{errors.phoneNumber}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <textarea
                                                className={`form-control ${errors.homeAddress ? 'is-invalid' : ''}`}
                                                id="homeAddress"
                                                name="homeAddress"
                                                placeholder="Address"
                                                value={formData.homeAddress}
                                                onChange={handleChange}
                                                style={{ height: '100px' }}
                                            />
                                            <label htmlFor="homeAddress">Home Address</label>
                                            {errors.homeAddress && <div className="invalid-feedback">{errors.homeAddress}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <select
                                                className={`form-select ${errors.role ? 'is-invalid' : ''}`}
                                                id="role"
                                                name="role"
                                                value={formData.role}
                                                onChange={handleChange}
                                            >
                                                <option value="">Select Role</option>
                                                <option value="customer">Customer</option>
                                                <option value="businessman">Businessman</option>
                                            </select>
                                            <label htmlFor="role">Role</label>
                                            {errors.role && <div className="invalid-feedback">{errors.role}</div>}
                                        </div>
                                    </div>
                                    <div className="col-12">
                                        <div className="form-floating">
                                            <input
                                                type="password"
                                                className={`form-control ${errors.password ? 'is-invalid' : ''}`}
                                                id="password"
                                                name="password"
                                                placeholder="Password"
                                                value={formData.password}
                                                onChange={handleChange}
                                            />
                                            <label htmlFor="password">Password</label>
                                            {errors.password && <div className="invalid-feedback">{errors.password}</div>}
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