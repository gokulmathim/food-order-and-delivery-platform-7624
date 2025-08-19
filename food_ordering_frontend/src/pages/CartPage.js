import React, { useEffect, useState } from 'react';
import { clearCart, getCart, removeFromCart } from '../api/cart';
import CartPanel from '../components/CartPanel';
import Modal from '../components/Modal';
import { placeOrder } from '../api/orders';

// PUBLIC_INTERFACE
export default function CartPage() {
  /** Standalone cart page (especially for mobile). */
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [loading, setLoading] = useState(true);
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [placing, setPlacing] = useState(false);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const c = await getCart();
        if (mounted) setCart(c || { items: [] });
      } finally {
        if (mounted) setLoading(false);
      }
    })();
    return () => { mounted = false; };
  }, []);

  async function onRemove(id) {
    await removeFromCart(id);
    const c = await getCart();
    setCart(c);
  }
  async function onClear() {
    await clearCart();
    const c = await getCart();
    setCart(c);
  }
  function onCheckout() {
    setPaymentOpen(true);
  }
  async function onPlace() {
    setPlacing(true);
    try {
      await placeOrder();
      setPaymentOpen(false);
      const c = await getCart();
      setCart(c);
      alert('Order placed!');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div style={{ padding: 12 }}>
      {loading ? <div>Loading...</div> : null}
      <CartPanel cart={cart} onRemove={onRemove} onClear={onClear} onCheckout={onCheckout} />
      <Modal
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        title="Checkout"
        footer={
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 8 }}>
            <button className="btn outline" onClick={() => setPaymentOpen(false)}>Cancel</button>
            <button className="btn" onClick={onPlace} disabled={placing}>{placing ? 'Placing...' : 'Place order'}</button>
          </div>
        }
      >
        <p>Confirm your order and proceed to payment.</p>
      </Modal>
    </div>
  );
}
