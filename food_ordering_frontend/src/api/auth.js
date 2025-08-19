import { apiRequest } from './client';

// PUBLIC_INTERFACE
export async function register({ name, email, password }) {
  /** Registers a new user. Returns server response. */
  return apiRequest('/auth/register', { method: 'POST', body: { name, email, password } });
}

// PUBLIC_INTERFACE
export async function login({ email, password }) {
  /** Logs in a user and returns token or session info. */
  return apiRequest('/auth/login', { method: 'POST', body: { email, password } });
}

// PUBLIC_INTERFACE
export async function me() {
  /** Gets the current authenticated user profile. */
  return apiRequest('/auth/me', { auth: true });
}
