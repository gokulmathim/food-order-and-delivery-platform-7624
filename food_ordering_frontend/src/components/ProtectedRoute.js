import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

// PUBLIC_INTERFACE
export default function ProtectedRoute({ children }) {
  /** Protects routes by redirecting to /login if not authenticated. */
  const { token, loading } = useAuth();
  const location = useLocation();
  if (loading) {
    return <div style={{ padding: 24 }}>Loading...</div>;
  }
  if (!token) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }
  return children;
}
