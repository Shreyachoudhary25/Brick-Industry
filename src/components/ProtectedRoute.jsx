import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  const { admin } = useAuth();
  
  const token = 
    admin?.token || 
    localStorage.getItem('token') || 
    localStorage.getItem('adminToken');

  if (!token) {
    return <Navigate to="/admin/login" replace />;
  }

  return children;
};

export default ProtectedRoute;