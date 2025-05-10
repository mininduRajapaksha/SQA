import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Header({ isLoggedIn, currentUser }) {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    if (isLoggedIn && currentUser) {
      fetchCartCount();
    }
  }, [isLoggedIn, currentUser]);

  const fetchCartCount = async () => {
    try {
      const userId = currentUser._id || currentUser.id;
      const response = await axios.get(`http://localhost:5000/cart/${userId}`);
      const itemCount = response.data.items.reduce((total, item) => total + item.quantity, 0);
      setCartCount(itemCount);
    } catch (error) {
      console.error('Error fetching cart count:', error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('user');
    navigate('/');
  };

  const getUserName = () => {
    if (!currentUser) return 'User';
    // Check for name in different possible properties
    return currentUser.name || 
           currentUser.username || 
           currentUser.email?.split('@')[0] || 
           'User';
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-dark bg-primary mb-4">
      <div className="container">
        <Link className="navbar-brand" to="/">SQA Shopping</Link>
        
        <button 
          className="navbar-toggler" 
          type="button" 
          data-bs-toggle="collapse" 
          data-bs-target="#navbarNav"
        >
          <span className="navbar-toggler-icon"></span>
        </button>
        
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav me-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            {isLoggedIn && (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/dashboard">Dashboard</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/items">My Items</Link>
                </li>
              </>
            )}
          </ul>
          
          <div className="d-flex align-items-center">
            {isLoggedIn ? (
              <>
                <Link to="/cart" className="btn btn-outline-light me-3 position-relative">
                  <i className="bi bi-cart3"></i>
                  {cartCount > 0 && (
                    <span className="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                      {cartCount}
                    </span>
                  )}
                </Link>
                <Link to="/profile" className="text-light text-decoration-none me-3">
                  <span className="d-flex align-items-center">
                    <i className="bi bi-person-circle me-2"></i>
                    {currentUser?.name || currentUser?.email?.split('@')[0] || 'User'}
                  </span>
                </Link>
                <button 
                  className="btn btn-outline-light"
                  onClick={handleLogout}
                >
                  Logout
                </button>
              </>
            ) : (
              <Link to="/" className="btn btn-outline-light">
                Login
              </Link>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
}