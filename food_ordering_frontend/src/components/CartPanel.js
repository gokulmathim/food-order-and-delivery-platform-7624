import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useCart } from "../context/CartContext";
import { api } from "../services/api";

/**
 * Cart panel shows items, totals, and allows placing an order with a mock payment flow.
 */
export default function CartPanel() {
  const { isAuthenticated, token } = useAuth();
  const { cart, totals, updateItem, removeItem, clear } = useCart();
  const [address, setAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [notice, setNotice] = useState("");

  const onQty = async (item, delta) => {
    const next = (item.quantity || 1) + delta;
    const id = item.id || item.item_id;
    if (next <= 0) return removeItem(id);
    await updateItem(id, next, item.notes || "");
  };

  const checkout = async () => {
    if (!isAuthenticated) {
      setNotice("Please login to place an order.");
      return;
    }
    if (!cart?.items?.length) {
      setNotice("Your cart is empty.");
      return;
    }
    setPlacing(true);
    setNotice("");
    try {
      const order = await api.placeOrder(token, address ? { delivery_address: address } : {});
      const orderId = order.id || order.order_id;
      const intent = await api.createPaymentIntent(token, { order_id: orderId });
      await api.confirmPayment(token, { order_id: orderId, client_secret: intent.client_secret || "mock_secret" });
      setNotice("✅ Order placed successfully! You can track it in Orders.");
      await clear();
    } catch (e) {
      setNotice(`❌ Failed to place order: ${e.message}`);
    } finally {
      setPlacing(false);
    }
  };

  return (
    <aside className="cart-panel panel">
      <div className="section-title">
        <div style={{ fontWeight: 800 }}>Your Cart</div>
        <div style={{ color: "var(--muted)", fontSize: 12 }}>{totals.count} items</div>
      </div>
      <div style={{ display: "grid", gap: 8 }}>
        {(cart?.items || []).map((it) => (
          <div key={it.id || it.item_id} className="cart-item">
            <div>
              <div style={{ fontWeight: 700 }}>{it.name || it.menu_item_name || "Item"}</div>
              <div style={{ fontSize: 12, color: "var(--muted)" }}>
                ${((it.price || it.menu_item_price || 0) * (it.quantity || 1)).toFixed(2)}
              </div>
            </div>
            <div className="qty-control">
              <button className="qty-btn" onClick={() => onQty(it, -1)} aria-label="Decrease">-</button>
              <div>{it.quantity || 1}</div>
              <button className="qty-btn" onClick={() => onQty(it, 1)} aria-label="Increase">+</button>
            </div>
          </div>
        ))}
      </div>

      <div style={{ marginTop: 10, display: "grid", gap: 6 }}>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="muted">Subtotal</span>
          <strong>${totals.subtotal.toFixed(2)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between" }}>
          <span className="muted">Fees</span>
          <strong>${totals.fees.toFixed(2)}</strong>
        </div>
        <div style={{ display: "flex", justifyContent: "space-between", fontSize: 18 }}>
          <span>Total</span>
          <strong>${totals.total.toFixed(2)}</strong>
        </div>
      </div>

      <div style={{ marginTop: 10 }}>
        <input
          className="input"
          placeholder="Delivery address (optional)"
          value={address}
          onChange={(e) => setAddress(e.target.value)}
        />
        <button className="checkout-btn" onClick={checkout} disabled={placing} aria-busy={placing}>
          {placing ? "Placing order..." : "Place Order"}
        </button>
      </div>

      {notice && <div className="notice" style={{ marginTop: 10 }}>{notice}</div>}
    </aside>
  );
}
