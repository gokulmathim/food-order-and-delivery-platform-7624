import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";

/**
 * Header with brand, navigation, and user profile dropdown.
 */
export default function Header() {
  const [open, setOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { totals } = useCart();
  const navigate = useNavigate();

  return (
    <header className="header">
      <Link to="/" className="brand" aria-label="Home">
        <div className="brand-mark" />
        <div>
          <div style={{ fontSize: 16 }}>Foodly</div>
          <div style={{ fontSize: 12, color: "var(--muted)" }}>Order & Deliver</div>
        </div>
      </Link>

      <div className="header-actions">
        <Link to="/orders" className="icon-btn" aria-label="Orders">📦 Orders</Link>
        <div className="icon-btn" title="Cart">
          🛒 Cart ({totals.count})
        </div>
        <div className={`profile ${open ? "open" : ""}`}>
          <button
            className="icon-btn"
            onClick={() => setOpen((v) => !v)}
            aria-haspopup="menu"
            aria-expanded={open}
          >
            {isAuthenticated ? `👤 ${user?.full_name || user?.name || "Account"}` : "👤 Sign in"}
          </button>
          <div className="profile-menu" role="menu">
            {!isAuthenticated ? (
              <>
                <div className="menu-item" role="menuitem" onClick={() => { setOpen(false); navigate("/login"); }}>Login</div>
                <div className="menu-item" role="menuitem" onClick={() => { setOpen(false); navigate("/register"); }}>Register</div>
              </>
            ) : (
              <>
                <div className="menu-item" role="menuitem">Email: {user?.email}</div>
                <div className="menu-item" role="menuitem" onClick={() => { setOpen(false); navigate("/orders"); }}>My Orders</div>
                <div className="menu-item" role="menuitem" onClick={() => { logout(); setOpen(false); navigate("/"); }}>Logout</div>
              </>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}
