import { apiRequest } from './client';

// PUBLIC_INTERFACE
export function placeOrder() {
  /** Place order from the current cart. */
  return apiRequest('/orders', { method: 'POST', auth: true });
}

// PUBLIC_INTERFACE
export function getOrders() {
  /** Get order history for current user. */
  return apiRequest('/orders', { auth: true });
}

// PUBLIC_INTERFACE
export function getOrder(orderId) {
  /** Get a specific order details. */
  return apiRequest(`/orders/${encodeURIComponent(orderId)}`, { auth: true });
}

// PUBLIC_INTERFACE
export function payOrder(orderId, method = 'card') {
  /** Process payment for the order. */
  return apiRequest('/payments', { method: 'POST', auth: true, body: { orderId, method } });
}
