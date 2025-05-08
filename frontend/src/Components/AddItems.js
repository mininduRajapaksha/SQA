import React, { useState } from 'react';
import axios from 'axios';

export default function AddItems() {
  // Form state
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: '',
  });

  // Error states
  const [errors, setErrors] = useState({});
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });

  // Handle input changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  // Validation
  const validateForm = () => {
    const newErrors = {};
    
    if (!formData.name.trim()) {
      newErrors.name = 'Product name is required';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    
    if (!formData.price || formData.price <= 0) {
      newErrors.price = 'Please enter a valid price';
    }
    
    if (!formData.category.trim()) {
      newErrors.category = 'Category is required';
    }
    
    if (!formData.imageUrl.trim()) {
      newErrors.imageUrl = 'Image URL is required';
    }
    
    if (!formData.stockQuantity || formData.stockQuantity < 0) {
      newErrors.stockQuantity = 'Please enter a valid stock quantity';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    try {
      const response = await axios.post('http://localhost:5000/items/add', formData);
      
      setAlert({
        show: true,
        type: 'success',
        message: 'Item added successfully!'
      });

      // Clear form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        imageUrl: '',
        stockQuantity: ''
      });
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: error.response?.data?.message || 'Error adding item'
      });
    }
  };

  return (
    <div className="container mt-5">
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

      <div className="card shadow-sm">
        <div className="card-body">
          <h3 className="card-title mb-4 text-center">Add New Item</h3>
          
          <form onSubmit={handleSubmit}>
            <div className="mb-3">
              <label htmlFor="name" className="form-label">Product Name</label>
              <input
                type="text"
                className={`form-control ${errors.name ? 'is-invalid' : ''}`}
                id="name"
                name="name"
                value={formData.name}
                onChange={handleChange}
              />
              {errors.name && <div className="invalid-feedback">{errors.name}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="description" className="form-label">Description</label>
              <textarea
                className={`form-control ${errors.description ? 'is-invalid' : ''}`}
                id="description"
                name="description"
                rows="3"
                value={formData.description}
                onChange={handleChange}
              />
              {errors.description && <div className="invalid-feedback">{errors.description}</div>}
            </div>

            <div className="row mb-3">
              <div className="col-md-6">
                <label htmlFor="price" className="form-label">Price (Rs.)</label>
                <input
                  type="number"
                  className={`form-control ${errors.price ? 'is-invalid' : ''}`}
                  id="price"
                  name="price"
                  value={formData.price}
                  onChange={handleChange}
                  min="0"
                  step="0.01"
                />
                {errors.price && <div className="invalid-feedback">{errors.price}</div>}
              </div>

              <div className="col-md-6">
                <label htmlFor="stockQuantity" className="form-label">Stock Quantity</label>
                <input
                  type="number"
                  className={`form-control ${errors.stockQuantity ? 'is-invalid' : ''}`}
                  id="stockQuantity"
                  name="stockQuantity"
                  value={formData.stockQuantity}
                  onChange={handleChange}
                  min="0"
                />
                {errors.stockQuantity && <div className="invalid-feedback">{errors.stockQuantity}</div>}
              </div>
            </div>

            <div className="mb-3">
              <label htmlFor="category" className="form-label">Category</label>
              <select
                className={`form-select ${errors.category ? 'is-invalid' : ''}`}
                id="category"
                name="category"
                value={formData.category}
                onChange={handleChange}
              >
                <option value="">Select a category</option>
                <option value="Electronics">Electronics</option>
                <option value="Clothing">Clothing</option>
                <option value="Books">Books</option>
                <option value="Home & Garden">Home & Garden</option>
                <option value="Sports">Sports</option>
                <option value="Other">Other</option>
              </select>
              {errors.category && <div className="invalid-feedback">{errors.category}</div>}
            </div>

            <div className="mb-3">
              <label htmlFor="imageUrl" className="form-label">Image URL</label>
              <input
                type="url"
                className={`form-control ${errors.imageUrl ? 'is-invalid' : ''}`}
                id="imageUrl"
                name="imageUrl"
                value={formData.imageUrl}
                onChange={handleChange}
              />
              {errors.imageUrl && <div className="invalid-feedback">{errors.imageUrl}</div>}
            </div>

            <button type="submit" className="btn btn-primary w-100">
              Add Item
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}