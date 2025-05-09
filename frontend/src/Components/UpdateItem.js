import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

export default function UpdateItem() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [previewUrl, setPreviewUrl] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [formData, setFormData] = useState({
    name: '',
    description: '',
    price: '',
    category: '',
    stockQuantity: ''
  });

  useEffect(() => {
    // Check authentication
    const userJson = localStorage.getItem('user');
    if (userJson) {
      setCurrentUser(JSON.parse(userJson));
      setIsLoggedIn(true);
      fetchItemDetails();
    } else {
      navigate('/login');
    }
  }, [id, navigate]);

  const fetchItemDetails = async () => {
    try {
      const response = await axios.get(`http://localhost:5000/items/${id}`);
      const item = response.data;
      setFormData({
        name: item.name,
        description: item.description,
        price: item.price,
        category: item.category,
        stockQuantity: item.stockQuantity
      });
      setPreviewUrl(item.imageUrl);
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: 'Error fetching item details'
      });
    }
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setAlert({
          show: true,
          type: 'danger',
          message: 'File size should be less than 5MB'
        });
        return;
      }

      if (!file.type.startsWith('image/')) {
        setAlert({
          show: true,
          type: 'danger',
          message: 'Please upload an image file'
        });
        return;
      }

      setSelectedFile(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewUrl(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const formDataToSend = new FormData();
      formDataToSend.append('name', formData.name.trim());
      formDataToSend.append('description', formData.description.trim());
      formDataToSend.append('price', Number(formData.price));
      formDataToSend.append('category', formData.category.trim());
      formDataToSend.append('stockQuantity', Number(formData.stockQuantity));

      if (selectedFile) {
        formDataToSend.append('image', selectedFile);
      }

      const response = await axios.put(
        `http://localhost:5000/items/update/${id}`,
        formDataToSend,
        {
          headers: {
            'Content-Type': 'multipart/form-data'
          }
        }
      );

      if (response.status === 200) {
        setAlert({
          show: true,
          type: 'success',
          message: 'Item updated successfully!'
        });
        setTimeout(() => navigate('/business-dashboard'), 1500);
      }
    } catch (error) {
      setAlert({
        show: true,
        type: 'danger',
        message: error.response?.data?.message || 'Error updating item'
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

        <h2 className="mb-4">Update Item</h2>
        
        <form onSubmit={handleSubmit}>
          <div className="row">
            <div className="col-md-6">
            <div className="mb-3 row">
                <label htmlFor="name" className="col-sm-4 col-form-label text-start">Item Name</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="name"
                    name="name"
                    value={formData.name}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="description" className="col-sm-4 col-form-label text-start">Description</label>
                <div className="col-sm-9">
                  <textarea
                    className="form-control"
                    id="description"
                    name="description"
                    value={formData.description}
                    onChange={handleInputChange}
                    rows="3"
                    required
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="price" className="col-sm-4 col-form-label text-start">Price</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    id="price"
                    name="price"
                    value={formData.price}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="category" className="col-sm-4 col-form-label text-start">Category</label>
                <div className="col-sm-9">
                  <input
                    type="text"
                    className="form-control"
                    id="category"
                    name="category"
                    value={formData.category}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="mb-3 row">
                <label htmlFor="stockQuantity" className="col-sm-4 col-form-label text-start">Stock Quantity</label>
                <div className="col-sm-9">
                  <input
                    type="number"
                    className="form-control"
                    id="stockQuantity"
                    name="stockQuantity"
                    value={formData.stockQuantity}
                    onChange={handleInputChange}
                    min="0"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="col-md-6">
              <div className="mb-3 row">
                <label htmlFor="image" className="col-sm-4 col-form-label text-start">Item Image</label>
                <div className="col-sm-9">
                  <input
                    type="file"
                    className="form-control"
                    id="image"
                    onChange={handleFileChange}
                    accept="image/*"
                  />
                  {previewUrl && (
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="mt-3 img-thumbnail"
                      style={{ maxHeight: '300px' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <div className="mb-3">
            <button type="submit" className="btn btn-primary me-2">
              Update Item
            </button>
            <button 
              type="button" 
              className="btn btn-secondary"
              onClick={() => navigate(-1)}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </>
  );
}