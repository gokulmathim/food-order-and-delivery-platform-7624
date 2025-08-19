import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { useAuth } from "./AuthContext";
import { api } from "../services/api";

const CartContext = createContext(null);

// PUBLIC_INTERFACE
export function CartProvider({ children }) {
  /** Manages cart state; mirrors backend cart where possible. */
  const { token } = useAuth() || { token: "" };
  const [cart, setCart] = useState({ id: null, items: [] });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!token) {
      setCart({ id: null, items: [] });
      return;
    }
    let mounted = true;
    setLoading(true);
    api.getCart(token)
      .then((c) => mounted && setCart(c || { id: null, items: [] }))
      .catch(() => mounted && setCart({ id: null, items: [] }))
      .finally(() => mounted && setLoading(false));
    return () => { mounted = false; };
  }, [token]);

  const refresh = async () => {
    if (!token) return;
    const c = await api.getCart(token).catch(() => ({ id: null, items: [] }));
    setCart(c || { id: null, items: [] });
  };

  const addItem = async (menu_item_id, quantity = 1, notes = "") => {
    if (!token) throw new Error("Login required");
    await api.addCartItem(token, { menu_item_id, quantity, notes });
    await refresh();
  };
  const updateItem = async (id, quantity, notes) => {
    if (!token) throw new Error("Login required");
    await api.updateCartItem(token, id, { quantity, notes });
    await refresh();
  };
  const removeItem = async (id) => {
    if (!token) throw new Error("Login required");
    await api.removeCartItem(token, id);
    await refresh();
  };
  const clear = async () => {
    if (!token) throw new Error("Login required");
    await api.clearCart(token);
    await refresh();
  };

  const totals = useMemo(() => {
    const items = cart?.items || [];
    const subtotal = items.reduce((sum, it) => sum + (it.price || it.menu_item_price || 0) * (it.quantity || 1), 0);
    const fees = Math.round(subtotal * 0.05 * 100) / 100;
    const total = Math.round((subtotal + fees) * 100) / 100;
    return { subtotal, fees, total, count: items.reduce((s, i) => s + (i.quantity || 1), 0) };
  }, [cart]);

  const value = useMemo(
    () => ({
      cart,
      loading,
      addItem,
      updateItem,
      removeItem,
      clear,
      refresh,
      totals,
    }),
    [cart, loading, totals]
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
}

// PUBLIC_INTERFACE
export function useCart() {
  /** Hook to access cart context. */
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within CartProvider");
  return ctx;
}
