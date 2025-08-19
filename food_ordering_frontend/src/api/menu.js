import { apiRequest } from './client';

// PUBLIC_INTERFACE
export function getRestaurants() {
  /** Fetch list of restaurants. */
  return apiRequest('/restaurants');
}

// PUBLIC_INTERFACE
export function getMenuByRestaurant(restaurantId) {
  /** Fetch menu items for a given restaurantId. */
  return apiRequest(`/restaurants/${encodeURIComponent(restaurantId)}/menu`);
}
