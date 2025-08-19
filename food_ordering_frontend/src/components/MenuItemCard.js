import React, { useState } from 'react';
import './MenuItemCard.css';

// PUBLIC_INTERFACE
export default function MenuItemCard({ item, onAdd }) {
  /** Presents a menu item and allows adding qty to cart. */
  const [qty, setQty] = useState(1);
  const price = item.price ?? item.amount ?? 0;

  return (
    <div className="menu-item-card">
      <div className="info">
        <div className="title">{item.name}</div>
        {item.description ? <div className="desc">{item.description}</div> : null}
        <div className="price">${Number(price).toFixed(2)}</div>
      </div>
      <div className="actions">
        <div className="qty">
          <button onClick={() => setQty(q => Math.max(1, q - 1))}>-</button>
          <input type="number" min={1} value={qty} onChange={e => setQty(Math.max(1, Number(e.target.value) || 1))} />
          <button onClick={() => setQty(q => q + 1)}>+</button>
        </div>
        <button className="btn" onClick={() => onAdd(item, qty)}>Add</button>
      </div>
    </div>
  );
}
