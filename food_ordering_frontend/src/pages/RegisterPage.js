import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate, Link } from "react-router-dom";

export default function RegisterPage() {
  const { register } = useAuth();
  const navigate = useNavigate();
  const [payload, setPayload] = useState({ email: "", password: "", full_name: "", phone: "" });
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setBusy(true);
    setErr("");
    try {
      await register(payload);
      navigate("/");
    } catch (e2) {
      setErr(e2.message);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="panel" style={{ maxWidth: 480 }}>
      <div className="section-title">
        <div style={{ fontWeight: 800, fontSize: 18 }}>Create Account</div>
      </div>
      <form onSubmit={onSubmit} style={{ display: "grid", gap: 10 }}>
        <label>
          <div>Full Name</div>
          <input
            className="input"
            value={payload.full_name}
            onChange={(e) => setPayload({ ...payload, full_name: e.target.value })}
            required
          />
        </label>
        <label>
          <div>Phone</div>
          <input
            className="input"
            value={payload.phone}
            onChange={(e) => setPayload({ ...payload, phone: e.target.value })}
          />
        </label>
        <label>
          <div>Email</div>
          <input
            className="input"
            type="email"
            value={payload.email}
            onChange={(e) => setPayload({ ...payload, email: e.target.value })}
            required
          />
        </label>
        <label>
          <div>Password</div>
          <input
            className="input"
            type="password"
            value={payload.password}
            onChange={(e) => setPayload({ ...payload, password: e.target.value })}
            required
          />
        </label>
        <button className="checkout-btn" type="submit" disabled={busy} aria-busy={busy}>
          {busy ? "Creating account..." : "Register"}
        </button>
        {err && <div className="notice">Error: {err}</div>}
        <div style={{ fontSize: 12 }}>
          Already have an account? <Link to="/login">Login</Link>
        </div>
      </form>
    </div>
  );
}
