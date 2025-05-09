import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function AddItems({onError}) {

  
  // Form state
  const [selectedFile, setSelectedFile] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [currentUser, setCurrentUser] = useState(null);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    imageUrl: '',
    stockQuantity: '',
  });

  useEffect(() => {
    const userJson = localStorage.getItem('user');
    if (!userJson) {
      navigate('/');
      return;
    }
    setCurrentUser(JSON.parse(userJson));
  }, [navigate]);

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

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      // Create preview
      const reader = new FileReader();
      reader.onload = () => {
        setPreviewUrl(reader.result);
      };
      reader.readAsDataURL(file);
      setSelectedFile(file);
      
      // Clear any existing image errors
      if (errors.image) {
        setErrors(prev => ({ ...prev, image: '' }));
      }
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
  
  if (!formData.stockQuantity || formData.stockQuantity < 0) {
    newErrors.stockQuantity = 'Please enter a valid stock quantity';
  }

  // File validation
  if (!selectedFile) {
    newErrors.image = 'Product image is required';
  } else {
    // Validate file size (5MB max)
    if (selectedFile.size > 5 * 1024 * 1024) {
      newErrors.image = 'Image size should be less than 5MB';
    }
    
    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg'];
    if (!allowedTypes.includes(selectedFile.type)) {
      newErrors.image = 'Only JPG, JPEG and PNG images are allowed';
    }
  }

  setErrors(newErrors);
  return Object.keys(newErrors).length === 0;
};

// Update the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  if (!validateForm()) return;

  if (!currentUser?._id) {
    onError?.('Please login to add items'); // Make onError optional with ?. operator
    setAlert({
      show: true,
      type: 'warning',
      message: 'Please login to add items'
    });
    return;
  }

  try {
    const formDataToSend = new FormData();
    // Convert values to proper types before sending
    formDataToSend.append('name', formData.name.trim());
    formDataToSend.append('description', formData.description.trim());
    formDataToSend.append('price', Number(formData.price).toString());
    formDataToSend.append('category', formData.category.trim());
    formDataToSend.append('stockQuantity', Number(formData.stockQuantity).toString());
    formDataToSend.append('sellerId', currentUser._id); // Add seller ID
    
    // Ensure file is properly appended
    if (selectedFile) {
      formDataToSend.append('image', selectedFile, selectedFile.name);
    }

    const response = await axios.post('http://localhost:5000/items/add', formDataToSend, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
    
    if (response.status === 201 || response.status === 200) {
      setAlert({
        show: true,
        type: 'success',
        message: response.data.message || 'Item added successfully!'
      });

      // Clear form
      setFormData({
        name: '',
        description: '',
        category: '',
        price: '',
        stockQuantity: ''
      });
      setSelectedFile(null);
      setPreviewUrl('');
      setErrors({});

      // Reset file input
      const fileInput = document.getElementById('image');
      if (fileInput) fileInput.value = '';
    }
  } catch (error) {
    console.error('Error details:', error.response?.data);
    setAlert({
      show: true,
      type: 'danger',
      message: error.response?.data?.message || 'Error adding item. Please try again.'
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
          
          <form onSubmit={handleSubmit} encType="multipart/form-data">
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
      <label htmlFor="image" className="form-label">Product Image</label>
      <div className="d-flex gap-3 align-items-start">
        <div className="flex-grow-1">
          <input
            type="file"
            className={`form-control ${errors.image ? 'is-invalid' : ''}`}
            id="image"
            accept="image/*"
            onChange={handleFileChange}
          />
          {errors.image && <div className="invalid-feedback">{errors.image}</div>}
          <small className="text-muted d-block mt-1">
            Accepted formats: JPG, PNG, JPEG. Max size: 5MB
          </small>
        </div>
        {previewUrl && (
          <div style={{ width: '100px', height: '100px' }} className="border rounded">
            <img
              src={previewUrl}
              alt="Preview"
              style={{
                width: '100%',
                height: '100%',
                objectFit: 'cover'
              }}
            />
          </div>
        )}
      </div>
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