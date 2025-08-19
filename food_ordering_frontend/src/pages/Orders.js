import React, { useEffect, useState } from 'react';
import { getOrders, getOrder } from '../api/orders';
import './Orders.css';

// PUBLIC_INTERFACE
export default function Orders() {
  /** Displays order history and allows viewing details. */
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState(null);
  const [details, setDetails] = useState(null);
  const [error, setError] = useState('');

  useEffect(() => {
    let mounted = true;
    async function load() {
      try {
        const list = await getOrders();
        if (mounted) setOrders(list || []);
      } catch (e) {
        setError(e.message || 'Failed to load orders');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    load();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadDetails() {
      if (!selected) { setDetails(null); return; }
      try {
        const d = await getOrder(selected);
        if (mounted) setDetails(d);
      } catch (e) {
        setError(e.message || 'Failed to load order');
      }
    }
    loadDetails();
    return () => { mounted = false; };
  }, [selected]);

  return (
    <div className="orders-page">
      {error ? <div className="banner error">{error}</div> : null}
      <div className="orders-layout">
        <aside className="orders-list">
          <h3>Order history</h3>
          {loading ? <div>Loading...</div> : null}
          <ul>
            {orders?.map(o => (
              <li key={o.id || o._id} className={selected === (o.id || o._id) ? 'active' : ''}>
                <button onClick={() => setSelected(o.id || o._id)}>
                  <div className="top">
                    <span className="id">#{String(o.id || o._id).slice(-6)}</span>
                    <span className={`status ${o.status || 'created'}`}>{o.status || 'created'}</span>
                  </div>
                  <div className="meta">
                    <span>{new Date(o.createdAt || o.date || Date.now()).toLocaleString()}</span>
                    <span>${Number(o.total ?? o.amount ?? 0).toFixed(2)}</span>
                  </div>
                </button>
              </li>
            ))}
          </ul>
        </aside>
        <main className="order-details">
          {!selected ? <div>Select an order to view details</div> : null}
          {details ? (
            <div className="card">
              <h2>Order #{String(details.id || details._id).slice(-6)}</h2>
              <p>Status: <strong>{details.status || 'created'}</strong></p>
              <h3>Items</h3>
              <ul className="items">
                {(details.items || []).map((it, idx) => {
                  const name = it.name || it.item?.name || 'Item';
                  const qty = it.qty ?? it.quantity ?? 1;
                  const price = it.price ?? it.item?.price ?? 0;
                  return (
                    <li key={idx}>
                      <span>{name}</span>
                      <span>x{qty}</span>
                      <span>${(price * qty).toFixed(2)}</span>
                    </li>
                  );
                })}
              </ul>
              <div className="total">Total: <strong>${Number(details.total ?? 0).toFixed(2)}</strong></div>
            </div>
          ) : null}
        </main>
      </div>
    </div>
  );
}
