import React, { useState, useEffect } from 'react';
import axios from 'axios';

export default function RatingComponent({ itemId, currentUser, onRatingUpdate }) {
  const [ratings, setRatings] = useState([]);
  const [userRating, setUserRating] = useState({ rating: 5, feedback: '' });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [isEditing, setIsEditing] = useState(false);
  const [editingRatingId, setEditingRatingId] = useState(null);

  const calculateAverageRating = (ratings) => {
    if (!ratings.length) return 0;
    const sum = ratings.reduce((acc, curr) => acc + curr.rating, 0);
    return (sum / ratings.length).toFixed(1);
  };

  const fetchRatingsData = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/ratings/item/${itemId}`);
      setRatings(response.data);
      if (onRatingUpdate) {
        onRatingUpdate({
          average: calculateAverageRating(response.data),
          count: response.data.length
        });
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error fetching ratings'
      });
    }
  };

  useEffect(() => {
    fetchRatingsData();
  }, [itemId]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (isEditing) {
        await axios.put(`http://localhost:5000/ratings/update/${editingRatingId}`, {
          rating: userRating.rating,
          feedback: userRating.feedback
        });
      } else {
        await axios.post('http://localhost:5000/ratings/add', {
          userId: currentUser._id,
          itemId,
          rating: userRating.rating,
          feedback: userRating.feedback
        });
      }
      
      setUserRating({ rating: 5, feedback: '' });
      setIsEditing(false);
      setEditingRatingId(null);
      fetchRatingsData(); // Updated to use the new function name
      setAlert({
        show: true,
        type: 'success',
        message: isEditing ? 'Rating updated successfully!' : 'Rating added successfully!'
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: error.response?.data?.message || 'Error submitting rating'
      });
    }
  };

  const handleEdit = (rating) => {
    setUserRating({
      rating: rating.rating,
      feedback: rating.feedback
    });
    setIsEditing(true);
    setEditingRatingId(rating._id);
  };

  const handleDelete = async (ratingId) => {
    if (window.confirm('Are you sure you want to delete this rating?')) {
      try {
        await axios.delete(`http://localhost:5000/ratings/delete/${ratingId}`);
        fetchRatingsData(); // Updated to use the new function name
        setAlert({
          show: true,
          type: 'success',
          message: 'Rating deleted successfully!'
        });
      } catch (error) {
        setAlert({
          show: true,
          type: 'danger',
          message: 'Error deleting rating'
        });
      }
    }
  };

  return (
    <div className="mt-4">
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

      {currentUser?.role === 'customer' && (
        <form onSubmit={handleSubmit} className="mb-4">
          <div className="mb-3">
            <label className="form-label">Rating</label>
            <select
              className="form-select"
              value={userRating.rating}
              onChange={(e) => setUserRating(prev => ({ ...prev, rating: Number(e.target.value) }))}
            >
              {[5, 4, 3, 2, 1].map(num => (
                <option key={num} value={num}>{num} Stars</option>
              ))}
            </select>
          </div>
          <div className="mb-3">
            <label className="form-label">Feedback</label>
            <textarea
              className="form-control"
              value={userRating.feedback}
              onChange={(e) => setUserRating(prev => ({ ...prev, feedback: e.target.value }))}
              required
            />
          </div>
          <button type="submit" className="btn btn-primary">
            {isEditing ? 'Update Rating' : 'Submit Rating'}
          </button>
          {isEditing && (
            <button 
              type="button" 
              className="btn btn-secondary ms-2"
              onClick={() => {
                setIsEditing(false);
                setEditingRatingId(null);
                setUserRating({ rating: 5, feedback: '' });
              }}
            >
              Cancel
            </button>
          )}
        </form>
      )}

      <h4>Customer Reviews</h4>
      {ratings.length > 0 ? (
        <div className="list-group">
          {ratings.map(rating => (
            <div key={rating._id} className="list-group-item">
              <div className="d-flex justify-content-between align-items-center">
                <h6 className="mb-1">{rating.userId.firstName} {rating.userId.lastName}</h6>
                <div>
                  {[...Array(5)].map((_, index) => (
                    <i
                      key={index}
                      className={`bi bi-star${index < rating.rating ? '-fill' : ''} text-warning`}
                    />
                  ))}
                </div>
              </div>
              <p className="mb-1">{rating.feedback}</p>
              <small className="text-muted">
                {new Date(rating.createdAt).toLocaleDateString()}
              </small>
              {currentUser?.role === 'customer' && currentUser?._id === rating.userId._id && (
                <div className="mt-2">
                  <button
                    className="btn btn-sm btn-outline-primary me-2"
                    onClick={() => handleEdit(rating)}
                  >
                    Edit
                  </button>
                  <button
                    className="btn btn-sm btn-outline-danger"
                    onClick={() => handleDelete(rating._id)}
                  >
                    Delete
                  </button>
                </div>
              )}
            </div>
          ))}
        </div>
      ) : (
        <p>No ratings yet.</p>
      )}
    </div>
  );
}