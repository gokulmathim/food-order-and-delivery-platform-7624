import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import './Header.css';

// PUBLIC_INTERFACE
export default function Header({ onToggleTheme }) {
  /** App header with navigation and user actions. */
  const { user, logout, token } = useAuth();
  const navigate = useNavigate();

  const onLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <header className="app-header">
      <div className="brand">
        <Link to="/">🍽️ Foodie</Link>
      </div>
      <nav className="nav">
        <Link to="/restaurants">Restaurants</Link>
        {token ? <Link to="/orders">Orders</Link> : null}
      </nav>
      <div className="actions">
        <button className="icon-btn" onClick={onToggleTheme} title="Toggle theme">🌓</button>
        <Link className="btn secondary" to="/cart">Cart</Link>
        {token ? (
          <div className="user">
            <span className="user-greet">Hi{user?.name ? `, ${user.name.split(' ')[0]}` : ''}</span>
            <button className="btn" onClick={onLogout}>Logout</button>
          </div>
        ) : (
          <div className="user">
            <Link className="btn" to="/login">Login</Link>
            <Link className="btn outline" to="/register">Sign Up</Link>
          </div>
        )}
      </div>
    </header>
  );
}
