import { Navigate } from 'react-router-dom';
import React from 'react';
import { useAuth } from '../context/AuthContext';

const PrivateRoute = ({ children }: { children: React.ReactNode }) => {
  const { session } = useAuth();
  
  if (!session) {
    return <Navigate to="/login" replace />;
  }

  return children as React.ReactElement;
};

export default PrivateRoute;