import React, { useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import { login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// PUBLIC_INTERFACE
export default function Login() {
  /** Login form and flow saving token and redirecting back. */
  const navigate = useNavigate();
  const location = useLocation();
  const { loginWithToken } = useAuth();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      const res = await login({ email, password });
      // Backend may return { token } or similar.
      const token = res?.token || res?.accessToken || res?.jwt;
      if (!token) {
        throw new Error('Invalid server response: missing token');
      }
      loginWithToken(token);
      const redirectTo = location.state?.from?.pathname || '/restaurants';
      navigate(redirectTo, { replace: true });
    } catch (err) {
      setError(err.message || 'Login failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Welcome back</h2>
        <p className="muted">Log in to continue</p>
        {error ? <div className="error">{error}</div> : null}
        <label>Email</label>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        <button className="btn" disabled={submitting}>{submitting ? 'Signing in...' : 'Sign in'}</button>
        <p className="muted">No account? <Link to="/register">Create one</Link></p>
      </form>
    </div>
  );
}
