import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';

export default function Login() {
  const [credentials, setCredentials] = useState({ email: '', password: '' });
  const [alert, setAlert] = useState({ show: false, type: '', message: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    setCredentials(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setAlert({ show: false, type: '', message: '' });

    try {
      const response = await axios.post('http://localhost:5000/user/login', credentials, {
        headers: { 'Content-Type': 'application/json' }
      });
      const { token, user } = response.data;

      // Store token
      localStorage.setItem('authToken', token);

      // Navigate based on role
      if (user.role === 'customer') {
        navigate('/customer-dashboard');
      } else if (user.role === 'businessman') {
        navigate('/business-dashboard');
      } else {
        setAlert({ show: true, type: 'warning', message: 'Unknown user role.' });
      }
    } catch (error) {
      console.error('Login error:', error.response || error);
      const msg = error.response?.data?.message || 'Login failed. Please check credentials.';
      setAlert({ show: true, type: 'danger', message: msg });
    } finally {
      setLoading(false);
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
          <h3 className="card-title mb-4 text-center">Login</h3>

          <form onSubmit={handleSubmit}>
            <div className="form-floating mb-3">
              <input
                type="email"
                className="form-control"
                id="email"
                name="email"
                placeholder="name@example.com"
                value={credentials.email}
                onChange={handleChange}
                required
              />
              <label htmlFor="email">Email address</label>
            </div>

            <div className="form-floating mb-3">
              <input
                type="password"
                className="form-control"
                id="password"
                name="password"
                placeholder="Password"
                value={credentials.password}
                onChange={handleChange}
                required
              />
              <label htmlFor="password">Password</label>
            </div>

            <button type="submit" className="btn btn-primary w-100" disabled={loading}>
              {loading ? 'Logging in…' : 'Login'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
