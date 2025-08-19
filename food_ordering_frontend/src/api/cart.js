import { apiRequest } from './client';

// PUBLIC_INTERFACE
export function getCart() {
  /** Get current user's cart. */
  return apiRequest('/cart', { auth: true });
}

// PUBLIC_INTERFACE
export function addToCart(itemId, qty = 1) {
  /** Add an item to the cart. */
  return apiRequest('/cart', { method: 'POST', auth: true, body: { itemId, qty } });
}

// PUBLIC_INTERFACE
export function removeFromCart(itemId) {
  /** Remove an item from the cart. */
  return apiRequest(`/cart/${encodeURIComponent(itemId)}`, { method: 'DELETE', auth: true });
}

// PUBLIC_INTERFACE
export function clearCart() {
  /** Clear the user's cart. */
  return apiRequest('/cart/clear', { method: 'POST', auth: true });
}
