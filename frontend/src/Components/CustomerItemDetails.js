import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

export default function CustomerItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/');
      return;
    }

    const user = JSON.parse(userJson);
    // Check for either id or _id
    if (!user.id && !user._id) {
      console.error('Invalid user data:', user);
      navigate('/');
      return;
    }

    // Normalize the user object to always use _id
    const normalizedUser = {
      ...user,
      _id: user._id || user.id // Use _id if exists, otherwise use id
    };

    setCurrentUser(normalizedUser);
    setIsLoggedIn(true);
    fetchItemDetails();
  }, [id, navigate]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/items/${id}`);
      setItem(response.data);
      setIsLoading(false);
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error fetching item details'
      });
      setIsLoading(false);
    }
  };

  const handleQuantityChange = (e) => {
    const value = parseInt(e.target.value);
    if (value > 0 && value <= item.stockQuantity) {
      setQuantity(value);
    }
  };

  const handleAddToCart = async () => {
    try {
      const cartItem = {
        itemId: item._id,
        quantity: quantity,
        userId: currentUser._id // This will now always exist
      };

      console.log('Adding to cart:', cartItem);

      const response = await axios.post('http://localhost:5000/cart/add', cartItem);

      if (response.status === 200 || response.status === 201) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Item added to cart successfully!'
        });
      }
    } catch (error) {
      console.error('Cart error:', error.response?.data);
      setAlert({
        show: true,
        type: 'danger',
        message: error.response?.data?.message || 'Error adding item to cart'
      });
    }
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

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

        {item && (
          <div className="row">
            <div className="col-md-6">
              <img 
                src={item.imageUrl} 
                alt={item.name}
                className="img-fluid rounded"
                style={{ maxHeight: '400px', width: '100%', objectFit: 'cover' }}
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
              />
            </div>
            <div className="col-md-6">
              <h2>{item.name}</h2>
              <p className="text-muted">{item.description}</p>
              <h4 className="mb-3">Rs. {item.price}</h4>
              <p>Category: {item.category}</p>
              <p>Stock Available: {item.stockQuantity}</p>
              
              <div className="mb-3">
                <label htmlFor="quantity" className="form-label">Quantity:</label>
                <div className="input-group" style={{ maxWidth: '200px' }}>
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => quantity > 1 && setQuantity(q => q - 1)}
                  >
                    -
                  </button>
                  <input
                    type="number"
                    className="form-control text-center"
                    id="quantity"
                    value={quantity}
                    onChange={handleQuantityChange}
                    min="1"
                    max={item.stockQuantity}
                  />
                  <button 
                    className="btn btn-outline-secondary" 
                    type="button"
                    onClick={() => quantity < item.stockQuantity && setQuantity(q => q + 1)}
                  >
                    +
                  </button>
                </div>
              </div>

              <div className="d-flex gap-2 mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={handleAddToCart}
                  disabled={item.stockQuantity === 0}
                >
                  {item.stockQuantity === 0 ? 'Out of Stock' : 'Add to Cart'}
                </button>
                <button 
                  className="btn btn-secondary"
                  onClick={() => navigate('/customer-dashboard')}
                >
                  Back to Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}