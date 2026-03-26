// API client helper for frontend.
// Uses environment variable override `VITE_API_BASE` or defaults to backend URL.
const API_BASE = import.meta.env.VITE_API_BASE || 'http://localhost:5001/api';

// persisted JWT token in localStorage
export const getToken = () => localStorage.getItem('smartGroceryToken');

// helper to apply authorization header when signed in
const getAuthHeaders = () => {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
};

const request = async (url, options = {}) => {
  const res = await fetch(`${API_BASE}${url}`, options);
  const data = await res.json();
  if (!res.ok) {
    throw new Error(data.message || data.error || res.statusText);
  }
  return data;
};

export const register = (user) =>
  request('/auth/register', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(user),
  });

export const login = (credentials) =>
  request('/auth/login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(credentials),
  });

export const getGroceries = () =>
  request('/groceries', { headers: { ...getAuthHeaders() } });

export const getGroceriesByType = (path) =>
  request(`/groceries/${path}`, { headers: { ...getAuthHeaders() } });

export const addGrocery = (item) =>
  request('/groceries', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(item),
  });

export const updateGrocery = (id, data) =>
  request(`/groceries/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });

export const patchGrocery = (id, path) =>
  request(`/groceries/${id}/${path}`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

export const deleteGrocery = (id) =>
  request(`/groceries/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

export const getShoppingList = () =>
  request('/shopping-list', { headers: { ...getAuthHeaders() } });

export const addShoppingItem = (item) =>
  request('/shopping-list', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(item),
  });

export const updateShoppingItem = (id, data) =>
  request(`/shopping-list/${id}`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', ...getAuthHeaders() },
    body: JSON.stringify(data),
  });

export const patchShoppingItem = (id) =>
  request(`/shopping-list/${id}/purchased`, {
    method: 'PATCH',
    headers: getAuthHeaders(),
  });

export const deleteShoppingItem = (id) =>
  request(`/shopping-list/${id}`, {
    method: 'DELETE',
    headers: getAuthHeaders(),
  });

export const getDashboard = () =>
  request('/dashboard', { headers: { ...getAuthHeaders() } });

export const logout = () => {
  localStorage.removeItem('smartGroceryToken');
  localStorage.removeItem('smartGroceryUser');
};

export const saveSession = ({ token, user }) => {
  localStorage.setItem('smartGroceryToken', token);
  localStorage.setItem('smartGroceryUser', JSON.stringify(user));
};

export const getCurrentUser = () => {
  const user = localStorage.getItem('smartGroceryUser');
  return user ? JSON.parse(user) : null;
};
