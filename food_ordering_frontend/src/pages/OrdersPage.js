import React, { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { api } from "../services/api";

export default function OrdersPage() {
  const { token } = useAuth();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    let mounted = true;
    setLoading(true);
    api
      .listOrders(token, { limit: 50, offset: 0 })
      .then((data) => {
        if (!mounted) return;
        const list = Array.isArray(data) ? data : data?.orders || [];
        setOrders(list);
        setErr("");
      })
      .catch((e) => setErr(e.message))
      .finally(() => setLoading(false));
    return () => {
      mounted = false;
    };
  }, [token]);

  return (
    <div className="panel">
      <div className="section-title">
        <div style={{ fontWeight: 800, fontSize: 18 }}>My Orders</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>
          Track your recent orders and statuses.
        </div>
      </div>

      {loading && <div>Loading orders...</div>}
      {err && <div className="notice">Error: {err}</div>}

      <div style={{ display: "grid", gap: 10 }}>
        {orders.map((o) => (
          <div key={o.id || o.order_id} className="cart-item">
            <div>
              <div style={{ fontWeight: 700 }}>Order #{o.id || o.order_id}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                {new Date(o.created_at || o.created || Date.now()).toLocaleString()}
              </div>
            </div>
            <div style={{ textAlign: "right" }}>
              <div>
                <strong>
                  $
                  {typeof (o.total || o.amount) === "number"
                    ? (o.total || o.amount).toFixed(2)
                    : o.total || o.amount || 0}
                </strong>
              </div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>{o.status || "pending"}</div>
            </div>
          </div>
        ))}
        {!loading && orders.length === 0 && <div>No orders yet.</div>}
      </div>
    </div>
  );
}
