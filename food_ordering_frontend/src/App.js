import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import Header from './components/Header';
import Restaurants from './pages/Restaurants';
import Orders from './pages/Orders';
import Login from './pages/Login';
import Register from './pages/Register';
import ProtectedRoute from './components/ProtectedRoute';
import CartPage from './pages/CartPage';
import { AuthProvider } from './context/AuthContext';

// PUBLIC_INTERFACE
function App() {
  /** Application root - routing, theme handling, and global providers. */
  const [theme, setTheme] = useState('light');
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  return (
    <BrowserRouter>
      <AuthProvider>
        <Header onToggleTheme={() => setTheme(t => t === 'light' ? 'dark' : 'light')} />
        <Routes>
          <Route path="/" element={<Navigate to="/restaurants" replace />} />
          <Route path="/restaurants" element={<Restaurants />} />
          <Route path="/cart" element={
            <ProtectedRoute>
              <CartPage />
            </ProtectedRoute>
          } />
          <Route path="/orders" element={
            <ProtectedRoute>
              <Orders />
            </ProtectedRoute>
          } />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="*" element={<div style={{ padding: 24 }}>Page not found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
