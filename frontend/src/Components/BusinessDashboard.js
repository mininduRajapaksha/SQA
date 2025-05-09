import React, { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import Header from "./Header";

export default function BusinessDashboard() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [alert, setAlert] = useState({ show: false, type: 'warning', message: '' });
  const navigate = useNavigate();

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      setAlert({
        show: true,
        type: 'warning',
        message: 'Please login to view dashboard'
      });
      setTimeout(() => {
        navigate('/login');
      }, 2000);
    } else {
      try {
        const user = JSON.parse(userJson);
        setCurrentUser(user);
        setIsLoggedIn(true);
        // Fetch user's items
        fetchUserItems(user._id);
      } catch (error) {
        console.error('Error parsing user data:', error);
      }
    }
  }, [navigate]);

  const fetchUserItems = async (userId) => {
    try {
      const response = await axios.get(`http://localhost:5000/items/seller/${userId}`);
      setUserItems(response.data);
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error fetching your items'
      });
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

        <div className="d-flex justify-content-between align-items-center mb-4">
          <h1>Business Dashboard</h1>
          <Link to="/add-item" className="btn btn-primary">
            <i className="bi bi-plus-lg"></i> Add New Item
          </Link>
        </div>

        {isLoggedIn && currentUser ? (
          <div className="row">
            {userItems.length > 0 ? (
              userItems.map(item => (
                <div key={item._id} className="col-md-4 mb-4">
                  <div className="card h-100">
                    <img 
                      src={item.imageUrl} 
                      className="card-img-top" 
                      alt={item.name}
                      style={{ height: '200px', objectFit: 'cover' }}
                    />
                    <div className="card-body">
                      <h5 className="card-title">{item.name}</h5>
                      <p className="card-text">{item.description}</p>
                      <div className="d-flex justify-content-between align-items-center">
                        <span className="h5 mb-0">Rs. {item.price}</span>
                        <span className="badge bg-secondary">Stock: {item.stockQuantity}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center">
                <p>You haven't added any items yet.</p>
                <Link to="/add-item" className="btn btn-primary">
                  Add Your First Item
                </Link>
              </div>
            )}
          </div>
        ) : (
          <div className="text-center">
            <p>You need to be logged in to access the dashboard.</p>
          </div>
        )}
      </div>
    </>
  );
}