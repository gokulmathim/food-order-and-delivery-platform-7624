const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'http://localhost:3001';

// PUBLIC_INTERFACE
export async function apiRequest(path, { method = 'GET', body, auth = false, headers = {} } = {}) {
  /** Performs a JSON HTTP request to the backend API with optional Bearer auth. */
  const token = auth ? localStorage.getItem('token') : null;
  const res = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(auth && token ? { Authorization: `Bearer ${token}` } : {}),
      ...headers
    },
    ...(body ? { body: JSON.stringify(body) } : {})
  });
  const contentType = res.headers.get('content-type') || '';
  let data = null;
  if (contentType.includes('application/json')) {
    data = await res.json().catch(() => null);
  } else {
    data = await res.text().catch(() => null);
  }
  if (!res.ok) {
    const errMessage = (data && (data.message || data.error)) || res.statusText || 'Request failed';
    const error = new Error(errMessage);
    error.status = res.status;
    error.data = data;
    throw error;
  }
  return data;
}

// PUBLIC_INTERFACE
export function getApiBaseUrl() {
  /** Returns the API base URL configured via env. */
  return API_BASE_URL;
}
