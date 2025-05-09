import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import Header from './Header';

export default function Cart() {
    const navigate = useNavigate();
    const [cart, setCart] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [currentUser, setCurrentUser] = useState(null);
    const [alert, setAlert] = useState({ show: false, type: '', message: '' });
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const userJson = localStorage.getItem('user');
        if (!userJson) {
            navigate('/login');
            return;
        }

        const user = JSON.parse(userJson);
        // Check for either id or _id
        if (!user.id && !user._id) {
            console.error('Invalid user data:', user);
            navigate('/login');
            return;
        }

        // Normalize the user object to always use _id
        const normalizedUser = {
            ...user,
            _id: user._id || user.id // Use _id if exists, otherwise use id
        };

        setCurrentUser(normalizedUser);
        setIsLoggedIn(true);
        fetchCart(normalizedUser._id); // Use normalized _id
    }, [navigate]);

    const fetchCart = async (userId) => {
        try {
            const response = await axios.get(`http://localhost:5000/cart/${userId}`);
            setCart(response.data);
            setIsLoading(false);
        } catch (error) {
            setAlert({
                show: true,
                type: 'danger',
                message: 'Error fetching cart'
            });
            setIsLoading(false);
        }
    };

    const handleQuantityChange = async (itemId, newQuantity) => {
        try {
            if (!currentUser?._id) {
                throw new Error('User ID not found');
            }
            
            await axios.put(`http://localhost:5000/cart/update/${currentUser._id}/${itemId}`, {
                quantity: newQuantity
            });
            fetchCart(currentUser._id);
        } catch (error) {
            setAlert({
                show: true,
                type: 'danger',
                message: error.response?.data?.message || 'Error updating quantity'
            });
        }
    };

    const handleRemoveItem = async (itemId) => {
        try {
            if (!currentUser?._id) {
                throw new Error('User ID not found');
            }

            await axios.delete(`http://localhost:5000/cart/remove/${currentUser._id}/${itemId}`);
            fetchCart(currentUser._id);
        } catch (error) {
            setAlert({
                show: true,
                type: 'danger',
                message: 'Error removing item'
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

                <h2 className="mb-4">Shopping Cart</h2>

                {cart && cart.items.length > 0 ? (
                    <>
                        <div className="card">
                            <div className="card-body">
                                {cart.items.map(item => (
                                    <div key={item.itemId._id} className="row mb-4 align-items-center">
                                        <div className="col-md-2">
                                            <img 
                                                src={item.itemId.imageUrl} 
                                                alt={item.itemId.name}
                                                className="img-fluid rounded"
                                                onError={(e) => {
                                                    e.target.src = 'https://via.placeholder.com/100x100?text=No+Image';
                                                }}
                                            />
                                        </div>
                                        <div className="col-md-4">
                                            <h5>{item.itemId.name}</h5>
                                            <p className="text-muted mb-0">Rs. {item.itemId.price}</p>
                                        </div>
                                        <div className="col-md-3">
                                            <div className="input-group" style={{ maxWidth: '150px' }}>
                                                <button 
                                                    className="btn btn-outline-secondary" 
                                                    type="button"
                                                    onClick={() => handleQuantityChange(item.itemId._id, item.quantity - 1)}
                                                    disabled={item.quantity <= 1}
                                                >
                                                    -
                                                </button>
                                                <input
                                                    type="number"
                                                    className="form-control text-center"
                                                    value={item.quantity}
                                                    readOnly
                                                />
                                                <button 
                                                    className="btn btn-outline-secondary" 
                                                    type="button"
                                                    onClick={() => handleQuantityChange(item.itemId._id, item.quantity + 1)}
                                                    disabled={item.quantity >= item.itemId.stockQuantity}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        </div>
                                        <div className="col-md-2">
                                            <h6>Rs. {item.itemId.price * item.quantity}</h6>
                                        </div>
                                        <div className="col-md-1">
                                            <button 
                                                className="btn btn-danger btn-sm"
                                                onClick={() => handleRemoveItem(item.itemId._id)}
                                            >
                                                <i className="bi bi-trash"></i>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="card-footer">
                                <div className="d-flex justify-content-between align-items-center">
                                    <h4 className="mb-0">Total: Rs. {cart.total}</h4>
                                    <button className="btn btn-primary">
                                        Proceed to Checkout
                                    </button>
                                </div>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="text-center">
                        <p>Your cart is empty</p>
                        <button 
                            className="btn btn-primary"
                            onClick={() => navigate('/customer-dashboard')}
                        >
                            Continue Shopping
                        </button>
                    </div>
                )}
            </div>
        </>
    );
}