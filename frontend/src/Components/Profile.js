import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

export default function Profile() {
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isEditing, setIsEditing] = useState(false);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    homeAddress: '',
    password: '',
    confirmPassword: ''
  });

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/');
      return;
    }

    try {
      const user = JSON.parse(userJson);
      const userId = user._id || user.id;
      if (!userId) {
        navigate('/');
        return;
      }

      // Fetch user details from backend
      const fetchUserDetails = async () => {
        try {
          const response = await axios.get(`http://localhost:5000/user/${userId}`);
          const userDetails = response.data;
          
          setCurrentUser(userDetails);
          setIsLoggedIn(true);
          setFormData({
            firstName: userDetails.firstName || '',
            lastName: userDetails.lastName || '',
            email: userDetails.email || '',
            phoneNumber: userDetails.phoneNumber || '',
            homeAddress: userDetails.homeAddress || '',
            password: '',
            confirmPassword: ''
          });
        } catch (error) {
          console.error('Error fetching user details:', error);
          setAlert({
            show: true,
            type: 'danger',
            message: 'Error loading profile data'
          });
        }
      };

      fetchUserDetails();
    } catch (error) {
      console.error('Error parsing user data:', error);
      navigate('/');
    }
  }, [navigate]);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    
    if (formData.password && formData.password !== formData.confirmPassword) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Passwords do not match'
      });
      return;
    }

    try {
      const userId = currentUser._id || currentUser.id;
      const updateData = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        phoneNumber: formData.phoneNumber,
        homeAddress: formData.homeAddress
      };

      if (formData.password) {
        updateData.password = formData.password;
      }

      const response = await axios.put(`http://localhost:5000/user/update/${userId}`, updateData);

      if (response.status === 200) {
        const updatedUser = response.data;
        localStorage.setItem('user', JSON.stringify(updatedUser));
        setCurrentUser(updatedUser);
        setIsEditing(false);
        setAlert({
          show: true,
          type: 'success',
          message: 'Profile updated successfully!'
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: error.response?.data?.message || 'Error updating profile'
      });
    }
  };

  // Function to handle account deletion
  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      try {
        const userId = currentUser._id || currentUser.id;
        const response = await axios.delete(`http://localhost:5000/user/delete/${userId}`);

        if (response.status === 200) {
          localStorage.removeItem('user');
          setIsLoggedIn(false);
          setCurrentUser(null);
          navigate('/');
          setAlert({
            show: true,
            type: 'success',
            message: 'Account deleted successfully'
          });
        }
      } catch (error) {
        setAlert({
          show: true,
          type: 'danger',
          message: error.response?.data?.message || 'Error deleting account'
        });
      }
    }
  };

  return (
    <>
      <Header isLoggedIn={isLoggedIn} currentUser={currentUser} />
      <div className="container mt-4">
        {alert.show && (
          <div className={`alert alert-${alert.type} alert-dismissible fade show`} role="alert">
            {alert.message}
            <button 
              type="button" 
              className="btn-close" 
              onClick={() => setAlert(prev => ({ ...prev, show: false }))}
              aria-label="Close"
            />
          </div>
        )}

        <div className="row justify-content-center">
          <div className="col-md-8">
            <div className="card shadow-sm">
              <div className="card-header d-flex justify-content-between align-items-center">
                <h4 className="mb-0">Profile</h4>
                {!isEditing && (
                  <button 
                    className="btn btn-primary"
                    onClick={() => setIsEditing(true)}
                  >
                    Edit Profile
                  </button>
                )}
              </div>
              <div className="card-body">
                {isEditing ? (
                  <form onSubmit={handleUpdate}>
                    <div className="row g-3">
                      <div className="col-md-6">
                        <div className="form-floating">
                          <input
                            type="text"
                            className="form-control"
                            id="firstName"
                            name="firstName"
                            value={formData.firstName}
                            onChange={handleInputChange}
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
                            value={formData.lastName}
                            onChange={handleInputChange}
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
                            value={formData.email}
                            onChange={handleInputChange}
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
                            pattern="[0-9]{10}"
                            value={formData.phoneNumber}
                            onChange={handleInputChange}
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
                            value={formData.homeAddress}
                            onChange={handleInputChange}
                            style={{ height: '100px' }}
                            required
                          />
                          <label htmlFor="homeAddress">Home Address</label>
                        </div>
                      </div>
                      <div className="col-12">
                        <div className="form-floating">
                          <input
                            type="password"
                            className="form-control"
                            id="password"
                            name="password"
                            value={formData.password}
                            onChange={handleInputChange}
                          />
                          <label htmlFor="password">New Password (optional)</label>
                        </div>
                      </div>
                      {formData.password && (
                        <div className="col-12">
                          <div className="form-floating">
                            <input
                              type="password"
                              className="form-control"
                              id="confirmPassword"
                              name="confirmPassword"
                              value={formData.confirmPassword}
                              onChange={handleInputChange}
                            />
                            <label htmlFor="confirmPassword">Confirm Password</label>
                          </div>
                        </div>
                      )}
                      <div className="col-12">
                        <div className="d-flex gap-2">
                          <button type="submit" className="btn btn-primary flex-grow-1">
                            Save Changes
                          </button>
                          <button 
                            type="button" 
                            className="btn btn-secondary"
                            onClick={() => setIsEditing(false)}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    </div>
                  </form>
                ) : (
                  <div className="row">
                    <div className="col-12">
                      <p><strong>Name:</strong> {currentUser?.firstName} {currentUser?.lastName}</p>
                      <p><strong>Email:</strong> {currentUser?.email}</p>
                      <p><strong>Phone No:</strong> {currentUser?.phoneNumber}</p>
                      <p><strong>Address:</strong> {currentUser?.homeAddress}</p>
                      <p><strong>Role:</strong> {currentUser?.role}</p>
                    </div>
                    <div className="col-12 mt-3">
                      <button 
                        className="btn btn-danger"
                        onClick={handleDelete}
                      >
                        Delete Account
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}