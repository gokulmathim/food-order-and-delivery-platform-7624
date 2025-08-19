import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import './App.css';
import { AuthProvider, useAuth } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import Header from './components/Header';
import Sidebar from './components/Sidebar';
import CartPanel from './components/CartPanel';
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import OrdersPage from './pages/OrdersPage';
import RestaurantPage from './pages/RestaurantPage';

// PUBLIC_INTERFACE
function App() {
  /** Root of the application: provides Auth and Cart contexts and registers routes. */
  return (
    <AuthProvider>
      <CartProvider>
        <BrowserRouter>
          <div className="app-container">
            <Header />
            <div className="content-layout">
              <Sidebar />
              <main className="main-content">
                <Routes>
                  <Route path="/" element={<HomePage />} />
                  <Route path="/login" element={<LoginPage />} />
                  <Route path="/register" element={<RegisterPage />} />
                  <Route
                    path="/orders"
                    element={
                      <RequireAuth>
                        <OrdersPage />
                      </RequireAuth>
                    }
                  />
                  <Route path="/restaurant/:id" element={<RestaurantPage />} />
                  <Route path="*" element={<Navigate to="/" replace />} />
                </Routes>
              </main>
              <CartPanel />
            </div>
          </div>
        </BrowserRouter>
      </CartProvider>
    </AuthProvider>
  );
}

function RequireAuth({ children }) {
  const { isAuthenticated } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return children;
}

export default App;
