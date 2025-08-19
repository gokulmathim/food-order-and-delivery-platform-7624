import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { register, login } from '../api/auth';
import { useAuth } from '../context/AuthContext';
import './Auth.css';

// PUBLIC_INTERFACE
export default function Register() {
  /** Registration form followed by auto-login. */
  const navigate = useNavigate();
  const { loginWithToken } = useAuth();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  async function onSubmit(e) {
    e.preventDefault();
    setError('');
    setSubmitting(true);
    try {
      await register({ name, email, password });
      const res = await login({ email, password });
      const token = res?.token || res?.accessToken || res?.jwt;
      if (!token) {
        throw new Error('Invalid server response: missing token');
      }
      loginWithToken(token);
      navigate('/restaurants', { replace: true });
    } catch (err) {
      setError(err.message || 'Registration failed');
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <div className="auth-wrapper">
      <form className="auth-form" onSubmit={onSubmit}>
        <h2>Create account</h2>
        <p className="muted">Join and start ordering</p>
        {error ? <div className="error">{error}</div> : null}
        <label>Name</label>
        <input type="text" required value={name} onChange={(e)=>setName(e.target.value)} placeholder="Jane Doe" />
        <label>Email</label>
        <input type="email" required value={email} onChange={(e)=>setEmail(e.target.value)} placeholder="you@example.com" />
        <label>Password</label>
        <input type="password" required value={password} onChange={(e)=>setPassword(e.target.value)} placeholder="••••••••" />
        <button className="btn" disabled={submitting}>{submitting ? 'Creating...' : 'Create account'}</button>
        <p className="muted">Have an account? <Link to="/login">Sign in</Link></p>
      </form>
    </div>
  );
}
