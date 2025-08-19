const API_BASE = process.env.REACT_APP_API_BASE || "http://localhost:3001";

/**
 * Low-level HTTP helper with auth header and JSON parsing.
 */
async function request(path, { method = "GET", body, token } = {}) {
  const res = await fetch(`${API_BASE}${path}`, {
    method,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    },
    body: body ? JSON.stringify(body) : undefined,
  });
  if (!res.ok) {
    let message = `HTTP ${res.status}`;
    try {
      const data = await res.json();
      message = data?.message || message;
    } catch (_) {}
    const error = new Error(message);
    error.status = res.status;
    throw error;
  }
  // Some endpoints might not return JSON body (e.g., 204)
  const text = await res.text();
  try {
    return text ? JSON.parse(text) : {};
  } catch {
    return {};
  }
}

export const api = {
  // PUBLIC_INTERFACE
  async register(payload) {
    /** Register a new user with fields: email, password, full_name, phone. */
    return request("/auth/register", { method: "POST", body: payload });
  },
  // PUBLIC_INTERFACE
  async login({ email, password }) {
    /** Login user and return token/user per backend implementation. */
    return request("/auth/login", { method: "POST", body: { email, password } });
  },
  // PUBLIC_INTERFACE
  async me(token) {
    /** Return current user by token. */
    return request("/auth/me", { token });
  },
  // PUBLIC_INTERFACE
  async getRestaurants({ search, city, limit = 50, offset = 0 } = {}) {
    /** List restaurants with optional filters. */
    const q = new URLSearchParams();
    if (search) q.set("search", search);
    if (city) q.set("city", city);
    if (limit != null) q.set("limit", String(limit));
    if (offset != null) q.set("offset", String(offset));
    const qs = q.toString();
    return request(`/restaurants${qs ? `?${qs}` : ""}`);
  },
  // PUBLIC_INTERFACE
  async getMenuByRestaurant(id) {
    /** Fetch menu categories and items for a restaurant. */
    return request(`/restaurants/${id}/menu`);
  },
  // PUBLIC_INTERFACE
  async getCart(token) {
    /** Get active cart for current user. */
    return request("/cart", { token });
  },
  // PUBLIC_INTERFACE
  async addCartItem(token, { menu_item_id, quantity, notes }) {
    /** Add item to cart. */
    return request("/cart/items", { method: "POST", token, body: { menu_item_id, quantity, notes } });
  },
  // PUBLIC_INTERFACE
  async updateCartItem(token, id, { quantity, notes }) {
    /** Update quantity or notes for a cart item. Quantity 0 allowed to remove. */
    return request(`/cart/items/${id}`, { method: "PATCH", token, body: { quantity, notes } });
  },
  // PUBLIC_INTERFACE
  async removeCartItem(token, id) {
    /** Remove item from cart. */
    return request(`/cart/items/${id}`, { method: "DELETE", token });
  },
  // PUBLIC_INTERFACE
  async clearCart(token) {
    /** Clear entire cart. */
    return request("/cart/clear", { method: "POST", token });
  },
  // PUBLIC_INTERFACE
  async listOrders(token, { limit = 50, offset = 0 } = {}) {
    /** List user orders. */
    const q = new URLSearchParams();
    if (limit != null) q.set("limit", String(limit));
    if (offset != null) q.set("offset", String(offset));
    return request(`/orders?${q.toString()}`, { token });
  },
  // PUBLIC_INTERFACE
  async placeOrder(token, payload) {
    /** Place an order from active cart. Payload may include delivery_address, delivery_lat, delivery_lng. */
    return request("/orders", { method: "POST", token, body: payload });
  },
  // PUBLIC_INTERFACE
  async getOrder(token, id) {
    /** Get a specific order details. */
    return request(`/orders/${id}`, { token });
  },
  // PUBLIC_INTERFACE
  async createPaymentIntent(token, { order_id }) {
    /** Create payment intent for order. Returns client_secret (mock). */
    return request("/payments/intents", { method: "POST", token, body: { order_id } });
  },
  // PUBLIC_INTERFACE
  async confirmPayment(token, { order_id, client_secret }) {
    /** Confirm payment (mock). */
    return request("/payments/confirm", { method: "POST", token, body: { order_id, client_secret } });
  }
};
