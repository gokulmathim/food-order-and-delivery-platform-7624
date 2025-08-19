import React from 'react';
import './CartPanel.css';

// PUBLIC_INTERFACE
export default function CartPanel({ cart, onRemove, onClear, onCheckout }) {
  /** Shows cart line items and totals with actions. */
  const items = cart?.items || cart || [];
  const total = cart?.total ?? items.reduce((sum, it) => {
    const price = it.price ?? it.amount ?? (it.item?.price ?? 0);
    const qty = it.qty ?? it.quantity ?? 1;
    return sum + price * qty;
  }, 0);

  return (
    <aside className="cart-panel">
      <h3>Cart</h3>
      <div className="cart-body">
        {(!items || items.length === 0) ? (
          <div className="empty">Your cart is empty.</div>
        ) : (
          <ul>
            {items.map((it) => {
              const id = it.itemId || it.id || it._id || it.item?._id;
              const name = it.name || it.item?.name || 'Item';
              const price = it.price ?? it.item?.price ?? 0;
              const qty = it.qty ?? it.quantity ?? 1;
              return (
                <li key={id}>
                  <div className="line">
                    <div className="name">{name}</div>
                    <div className="meta">
                      <span>x{qty}</span>
                      <span>${(price * qty).toFixed(2)}</span>
                    </div>
                  </div>
                  <button className="link danger" onClick={() => onRemove(id)}>Remove</button>
                </li>
              );
            })}
          </ul>
        )}
      </div>
      <div className="cart-footer">
        <div className="total">Total: <strong>${Number(total || 0).toFixed(2)}</strong></div>
        <div className="actions">
          <button className="btn outline" onClick={onClear} disabled={!items || items.length === 0}>Clear</button>
          <button className="btn" onClick={onCheckout} disabled={!items || items.length === 0}>Checkout</button>
        </div>
      </div>
    </aside>
  );
}
