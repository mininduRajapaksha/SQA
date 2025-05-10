import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';
import RatingComponent from './RatingComponent';

export default function ItemDetails() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [item, setItem] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isLoading, setIsLoading] = useState(true);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [overallRating, setOverallRating] = useState({ average: 0, count: 0 });

  useEffect(() => {
    // Check authentication status
    const userJson = localStorage.getItem('user');
    if (userJson) {
      const user = JSON.parse(userJson);
      setCurrentUser(user);
      setIsLoggedIn(true);
    } else {
      navigate('/');
    }
    
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

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this item?')) {
        try {
            const response = await axios.delete(`http://localhost:5000/items/delete/${id}`);
            
            if (response.status === 200) {
                setAlert({
                    show: true,
                    type: 'success',
                    message: 'Item deleted successfully'
                });
                
                setTimeout(() => {
                    navigate('/business-dashboard');
                }, 1500);
            }
        } catch (error) {
            const errorMessage = error.response?.data?.message || 
                               error.response?.data?.error || 
                               'Error deleting item';
            
            setAlert({
                show: true,
                type: 'danger',
                message: errorMessage
            });
            
            // Log full error for debugging
            console.error('Delete error details:', {
                message: error.message,
                response: error.response?.data,
                status: error.response?.status
            });
        }
    }
};

  const handleRatingUpdate = (ratingData) => {
    setOverallRating(ratingData);
  };

  if (isLoading) {
    return <div className="text-center mt-5">Loading...</div>;
  }

  return (
    <>
      <Header isLoggedIn={isLoggedIn} currentUser={currentUser}/>
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
                onError={(e) => {
                  e.target.src = 'https://via.placeholder.com/400x400?text=No+Image';
                }}
              />
            </div>
            <div className="col-md-6">
              <h2>{item.name}</h2>
              
              <div className="mb-3">
                <div className="d-flex align-items-center gap-2">
                  <div className="h4 mb-0">{overallRating.average}</div>
                  <div>
                    {[1, 2, 3, 4, 5].map((star) => (
                      <i
                        key={star}
                        className={`bi bi-star${
                          star <= Math.round(overallRating.average) ? '-fill' : ''
                        } text-warning`}
                      />
                    ))}
                  </div>
                  <div className="text-muted">
                    ({overallRating.count} {overallRating.count === 1 ? 'review' : 'reviews'})
                  </div>
                </div>
              </div>

              <p className="text-muted">{item.description}</p>
              <h4 className="mb-3">Rs. {item.price}</h4>
              <p>Category: {item.category}</p>
              <p>Stock Available: {item.stockQuantity}</p>
              
              <div className="d-flex gap-2 mt-4">
                <button 
                  className="btn btn-primary"
                  onClick={() => navigate(`/item/edit/${id}`)}
                >
                  Update Item
                </button>
                <button 
                  className="btn btn-danger"
                  onClick={handleDelete}
                >
                  Delete Item
                </button>
              </div>
            </div>
          </div>
        )}
        
        <RatingComponent 
          itemId={id} 
          currentUser={currentUser}
          onRatingUpdate={handleRatingUpdate}
        />
      </div>
    </>
  );
}