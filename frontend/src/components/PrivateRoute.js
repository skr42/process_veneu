import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PrivateRoute = ({ children }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) {
    return <div className="loading">Loading...</div>; // you can replace with spinner
  }

  return user 
    ? children 
    : <Navigate to="/login" state={{ from: location }} replace />;
};

export default PrivateRoute;
