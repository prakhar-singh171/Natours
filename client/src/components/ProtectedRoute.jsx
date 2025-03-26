import React, { useContext } from 'react';
import { Navigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';

const ProtectedRoute = ({ children }) => {
  // Check if a token exists in localStorage
  const {token} = useContext(AuthContext);


  // If no token, redirect to login
  if (!token) {
    return <Navigate to="/login" replace />;
  }

  // Render children if token is present
  return children;
};

export default ProtectedRoute;
