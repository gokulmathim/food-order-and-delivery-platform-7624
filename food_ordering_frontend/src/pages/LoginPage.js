import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function LoginPage() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await login(email, password);
      navigate("/");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 420 }}>
      <div className="section-title">
        <div style={{ fontWeight: 800, fontSize: 18 }}>Login</div>
      </div>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          <div>Email</div>
          <input className="input" type="email" required value={email} onChange={(e) => setEmail(e.target.value)} />
        </label>
        <label>
          <div>Password</div>
          <input className="input" type="password" required value={password} onChange={(e) => setPassword(e.target.value)} />
        </label>
        <button className="checkout-btn" type="submit" disabled={busy} aria-busy={busy}>
          {busy ? "Signing in..." : "Sign In"}
        </button>
        {err && <div className="notice">Error: {err}</div>}
        <div style={{ fontSize: 12 }}>
          No account? <Link to="/register">Register</Link>
        </div>
      </form>
    </div>
  );
}
