import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8081/api/v1';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add token to requests
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth APIs
export const authAPI = {
  signup: (data) => api.post('/auth/signup', data),
  login: (data) => api.post('/auth/login', data),
};

// User APIs
export const userAPI = {
  getProfile: () => api.get('/users/profile'),
  updateProfile: (data) => api.put('/users/profile', data),
};

// Restaurant APIs
export const restaurantAPI = {
  getAll: (params) => api.get('/restaurants', { params }),
  getById: (id) => api.get(`/restaurants/${id}`),
  create: (data) => api.post('/restaurants', data),
  update: (id, data) => api.put(`/restaurants/${id}`, data),
  delete: (id) => api.delete(`/restaurants/${id}`),
};

// Menu Item APIs
export const menuItemAPI = {
  getByRestaurant: (restaurantId, params) =>
    api.get(`/restaurants/${restaurantId}/menu-items`, { params }),
  create: (restaurantId, data) =>
    api.post(`/restaurants/${restaurantId}/menu-items`, data),
  update: (restaurantId, itemId, data) =>
    api.put(`/restaurants/${restaurantId}/menu-items/${itemId}`, data),
  delete: (restaurantId, itemId) =>
    api.delete(`/restaurants/${restaurantId}/menu-items/${itemId}`),
  updateAvailability: (restaurantId, itemId, data) =>
    api.patch(`/restaurants/${restaurantId}/menu-items/${itemId}/availability`, data),
};

// Cart APIs
export const cartAPI = {
  initialize: () => api.post('/cart', {}),
  getCart: () => api.get('/cart'),
  addItem: (data) => api.post('/cart/items', data),
  updateItem: (cartItemId, data) => api.put(`/cart/items/${cartItemId}`, data),
  removeItem: (cartItemId) => api.delete(`/cart/items/${cartItemId}`),
  clearCart: () => api.delete('/cart'),
};

// Order APIs
export const orderAPI = {
  create: (data) => api.post('/orders', data),
  getById: (id) => api.get(`/orders/${id}`),
  getHistory: (params) => api.get('/orders', { params }),
  cancel: (id, data) => api.put(`/orders/${id}/cancel`, data),
  updateStatus: (id, data) => api.patch(`/orders/${id}/status`, data),
};

export default api;
