import React, { useState } from 'react';
import axios from 'axios';

export default function Adduser() {
  // Error states
  const [firstNameError, setFirstNameError] = useState('');
  const [lastNameError, setLastNameError] = useState('');
  const [homeAddressError, setHomeAddressError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [phoneNumberError, setPhoneNumberError] = useState('');
  const [roleError, setRoleError] = useState('');
  const [passwordError, setPasswordError] = useState('');

  // Form data
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    homeAddress: '',
    email: '',
    phoneNumber: '',
    role: '',
    password: '',
  });

  // Alert state
  const [alert, setAlert] = useState({
    show: false,
    type: '',
    message: '',
  });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((f) => ({ ...f, [name]: value }));
  };

  // Validation functions
  const validateFirstName = (val) => {
    if (!val.trim()) {
      setFirstNameError('First Name is required.');
      return false;
    }
    setFirstNameError('');
    return true;
  };

  const validateLastName = (val) => {
    if (!val.trim()) {
      setLastNameError('Last Name is required.');
      return false;
    }
    setLastNameError('');
    return true;
  };

  const validateHomeAddress = (val) => {
    if (!val.trim()) {
      setHomeAddressError('Home Address is required.');
      return false;
    }
    setHomeAddressError('');
    return true;
  };

  const validateEmail = (val) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!val.trim()) {
      setEmailError('Email is required.');
      return false;
    } else if (!re.test(val)) {
      setEmailError('Please enter a valid email address.');
      return false;
    }
    setEmailError('');
    return true;
  };

  const validatePhoneNumber = (val) => {
    const re = /^[0-9]{10}$/;
    if (!val.trim()) {
      setPhoneNumberError('Mobile Number is required.');
      return false;
    } else if (!re.test(val)) {
      setPhoneNumberError('Mobile Number must be a 10-digit number.');
      return false;
    }
    setPhoneNumberError('');
    return true;
  };

  const validateRole = (val) => {
    if (!val) {
      setRoleError('Please select your role.');
      return false;
    }
    setRoleError('');
    return true;
  };

  const validatePassword = (val) => {
    if (!val) {
      setPasswordError('Password is required.');
      return false;
    } else if (val.length < 6) {
      setPasswordError('Password must be at least 6 characters.');
      return false;
    }
    setPasswordError('');
    return true;
  };

  // Submit handler
  const handleSubmit = async (e) => {
    e.preventDefault();

    // Run all validations
    const valid =
      validateFirstName(formData.firstName) &&
      validateLastName(formData.lastName) &&
      validateHomeAddress(formData.homeAddress) &&
      validateEmail(formData.email) &&
      validatePhoneNumber(formData.phoneNumber) &&
      validateRole(formData.role) &&
      validatePassword(formData.password);

    if (!valid) return;

    try {
      await axios.post(
        'http://localhost:5000/user/add',
        formData,
        { headers: { 'Content-Type': 'application/json' } }
      );

      setAlert({
        show: true,
        type: 'success',
        message: 'User registered successfully!',
      });

      // Clear form
      setFormData({
        firstName: '',
        lastName: '',
        homeAddress: '',
        email: '',
        phoneNumber: '',
        role: '',
        password: '',
      });
    } catch (error) {
      const errData = error.response?.data || '';
      if (typeof errData === 'string' && errData.includes('E11000')) {
        if (errData.includes('email_1') && errData.includes('phoneNumber_1')) {
          setAlert({
            show: true,
            type: 'danger',
            message: 'Both email and phone number are already registered!',
          });
        } else if (errData.includes('email_1')) {
          setAlert({
            show: true,
            type: 'danger',
            message: 'This email is already registered!',
          });
        } else if (errData.includes('phoneNumber_1')) {
          setAlert({
            show: true,
            type: 'danger',
            message: 'This phone number is already registered!',
          });
        }
      } else {
        setAlert({
          show: true,
          type: 'danger',
          message:
            (typeof errData === 'string' && errData) ||
            error.response?.data?.message ||
            'Error creating user. Please try again.',
        });
      }
    }
  };

  return (
    <div className="container mt-5">
      {alert.show && (
        <div
          className={`alert alert-${alert.type} alert-dismissible fade show`}
          role="alert"
        >
          {alert.message}
          <button
            type="button"
            className="btn-close"
            onClick={() => setAlert((a) => ({ ...a, show: false }))}
            aria-label="Close"
          />
        </div>
      )}

      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">User Registration</h3>
          <form noValidate onSubmit={handleSubmit}>
            <div className="row g-3">
              {/* First Name */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    id="firstName"
                    name="firstName"
                    type="text"
                    className="form-control"
                    placeholder="First name"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <label htmlFor="firstName">First Name</label>
                  {firstNameError && (
                    <div className="text-danger mt-1">{firstNameError}</div>
                  )}
                </div>
              </div>

              {/* Last Name */}
              <div className="col-md-6">
                <div className="form-floating">
                  <input
                    id="lastName"
                    name="lastName"
                    type="text"
                    className="form-control"
                    placeholder="Last name"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                  <label htmlFor="lastName">Last Name</label>
                  {lastNameError && (
                    <div className="text-danger mt-1">{lastNameError}</div>
                  )}
                </div>
              </div>

              {/* Home Address */}
              <div className="col-12">
                <div className="form-floating">
                  <input
                    id="homeAddress"
                    name="homeAddress"
                    type="text"
                    className="form-control"
                    placeholder="Home Address"
                    value={formData.homeAddress}
                    onChange={handleChange}
                  />
                  <label htmlFor="homeAddress">Home Address</label>
                  {homeAddressError && (
                    <div className="text-danger mt-1">{homeAddressError}</div>
                  )}
                </div>
              </div>

              {/* Email */}
              <div className="col-12">
                <div className="form-floating">
                  <input
                    id="email"
                    name="email"
                    type="email"
                    className="form-control"
                    placeholder="name@example.com"
                    value={formData.email}
                    onChange={handleChange}
                  />
                  <label htmlFor="email">Email address</label>
                  {emailError && (
                    <div className="text-danger mt-1">{emailError}</div>
                  )}
                </div>
              </div>

              {/* Phone Number */}
              <div className="col-12">
                <div className="form-floating">
                  <input
                    id="phoneNumber"
                    name="phoneNumber"
                    type="tel"
                    className="form-control"
                    placeholder="0712345678"
                    value={formData.phoneNumber}
                    onChange={handleChange}
                  />
                  <label htmlFor="phoneNumber">Mobile Number</label>
                  {phoneNumberError && (
                    <div className="text-danger mt-1">{phoneNumberError}</div>
                  )}
                </div>
              </div>

              {/* Role */}
              <div className="col-12">
                <div className="form-floating">
                  <select
                    id="role"
                    name="role"
                    className="form-select"
                    value={formData.role}
                    onChange={handleChange}
                  >
                    <option value="" disabled>
                      Select Your Role
                    </option>
                    <option value="customer">Customer</option>
                    <option value="businessman">Businessman</option>
                  </select>
                  <label htmlFor="role">Role</label>
                  {roleError && (
                    <div className="text-danger mt-1">{roleError}</div>
                  )}
                </div>
              </div>

              {/* Password */}
              <div className="col-12">
                <div className="form-floating">
                  <input
                    id="password"
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Password"
                    value={formData.password}
                    onChange={handleChange}
                  />
                  <label htmlFor="password">Create Password</label>
                  {passwordError && (
                    <div className="text-danger mt-1">{passwordError}</div>
                  )}
                </div>
              </div>

              {/* Submit */}
              <div className="col-12 text-center">
                <button type="submit" className="btn btn-primary px-5">
                  Submit
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
