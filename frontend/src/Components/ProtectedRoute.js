import React from 'react';
import { Navigate } from 'react-router-dom';

export default function ProtectedRoute({ children }) {
  const userJson = localStorage.getItem('user');
  
  if (!userJson) {
    return <Navigate to="/" />;
  }

  const user = JSON.parse(userJson);
  return children({ user });
}