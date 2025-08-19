import React, { useEffect, useMemo, useState } from 'react';
import { getRestaurants, getMenuByRestaurant } from '../api/menu';
import { addToCart, getCart, removeFromCart, clearCart } from '../api/cart';
import RestaurantList from '../components/RestaurantList';
import MenuItemCard from '../components/MenuItemCard';
import CartPanel from '../components/CartPanel';
import Modal from '../components/Modal';
import { useAuth } from '../context/AuthContext';
import { placeOrder } from '../api/orders';
import './Restaurants.css';

// PUBLIC_INTERFACE
export default function Restaurants() {
  /** Main page for browsing restaurants, menus, and interacting with cart/checkout. */
  const { token } = useAuth();
  const [restaurants, setRestaurants] = useState([]);
  const [selected, setSelected] = useState(null);
  const [menu, setMenu] = useState([]);
  const [loading, setLoading] = useState(true);
  const [menuLoading, setMenuLoading] = useState(false);
  const [cart, setCart] = useState({ items: [], total: 0 });
  const [error, setError] = useState('');
  const [paymentOpen, setPaymentOpen] = useState(false);
  const [placing, setPlacing] = useState(false);
  const [paymentMethod, setPaymentMethod] = useState('card');

  useEffect(() => {
    let mounted = true;
    async function init() {
      try {
        const rest = await getRestaurants();
        if (!mounted) return;
        setRestaurants(rest || []);
        if (rest && rest.length) {
          const firstId = rest[0].id || rest[0]._id;
          setSelected(firstId);
        }
      } catch (e) {
        setError(e.message || 'Failed to load restaurants');
      } finally {
        if (mounted) setLoading(false);
      }
    }
    init();
    return () => { mounted = false; };
  }, []);

  useEffect(() => {
    let mounted = true;
    async function loadMenu() {
      if (!selected) return;
      setMenuLoading(true);
      try {
        const items = await getMenuByRestaurant(selected);
        if (mounted) setMenu(items || []);
      } catch (e) {
        setError(e.message || 'Failed to load menu');
      } finally {
        if (mounted) setMenuLoading(false);
      }
    }
    loadMenu();
    return () => { mounted = false; };
  }, [selected]);

  useEffect(() => {
    let mounted = true;
    async function loadCart() {
      if (!token) return;
      try {
        const c = await getCart();
        if (mounted) setCart(c || { items: [] });
      } catch (e) {
        // ignore
      }
    }
    loadCart();
    return () => { mounted = false; };
  }, [token]);

  async function handleAdd(item, qty) {
    if (!token) {
      setError('Please login to add items to cart.');
      return;
    }
    try {
      await addToCart(item.id || item._id, qty);
      const updated = await getCart();
      setCart(updated);
    } catch (e) {
      setError(e.message || 'Failed to add to cart');
    }
  }

  async function handleRemove(id) {
    try {
      await removeFromCart(id);
      const updated = await getCart();
      setCart(updated);
    } catch (e) {
      setError(e.message || 'Failed to remove item');
    }
  }

  async function handleClear() {
    try {
      await clearCart();
      const updated = await getCart();
      setCart(updated);
    } catch (e) {
      setError(e.message || 'Failed to clear cart');
    }
  }

  async function openCheckout() {
    setPaymentOpen(true);
  }

  const selectedRestaurant = useMemo(() => {
    return restaurants.find(r => (r.id || r._id) === selected);
  }, [restaurants, selected]);

  async function onPlaceOrder() {
    setPlacing(true);
    try {
      await placeOrder();
      setPaymentOpen(false);
      // Cart will be empty after placing order
      const updated = await getCart();
      setCart(updated);
      alert('Order placed! Proceed to Orders page to view status.');
    } catch (e) {
      setError(e.message || 'Failed to place order');
    } finally {
      setPlacing(false);
    }
  }

  return (
    <div className="page restaurants-page">
      {error ? <div className="banner error">{error}</div> : null}
      <div className="layout">
        <RestaurantList restaurants={restaurants} selectedId={selected} onSelect={setSelected} />
        <main className="menu-area">
          {loading ? <div>Loading restaurants...</div> : null}
          {selectedRestaurant ? <h2>{selectedRestaurant.name}</h2> : <h2>Browse restaurants</h2>}
          {menuLoading ? <div>Loading menu...</div> : null}
          <div className="menu-grid">
            {menu?.map(mi => (
              <MenuItemCard key={mi.id || mi._id} item={mi} onAdd={handleAdd} />
            ))}
          </div>
        </main>
        <CartPanel cart={cart} onRemove={handleRemove} onClear={handleClear} onCheckout={openCheckout} />
      </div>

      <Modal
        title="Checkout"
        open={paymentOpen}
        onClose={() => setPaymentOpen(false)}
        footer={
          <div style={{ display: 'flex', gap: 8, justifyContent: 'flex-end' }}>
            <button className="btn outline" onClick={() => setPaymentOpen(false)}>Cancel</button>
            <button className="btn" onClick={onPlaceOrder} disabled={placing}>{placing ? 'Placing...' : 'Place order'}</button>
          </div>
        }
      >
        <p>Choose a payment method:</p>
        <div className="pay-methods">
          <label><input type="radio" name="pay" value="card" checked={paymentMethod==='card'} onChange={()=>setPaymentMethod('card')} /> Card</label>
          <label><input type="radio" name="pay" value="cash" checked={paymentMethod==='cash'} onChange={()=>setPaymentMethod('cash')} /> Cash</label>
        </div>
        <p>You will be redirected to payment after placing the order if required.</p>
      </Modal>
    </div>
  );
}
