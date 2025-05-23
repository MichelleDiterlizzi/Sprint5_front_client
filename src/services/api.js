import axios from 'axios';

const API_URL = 'http://localhost:8000/api';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authService = {
  login: async (credentials) => {
    const response = await api.post('/login', credentials);
    return response.data;
  },
  register: async (userData) => {
    const response = await api.post('/register', userData);
    return response.data;
  },
  logout: async () => {
    const response = await api.post('/users/logout');
    return response.data;
  },
};

export const eventService = {
  getAll: async () => {
    const response = await api.get('/events');
    return response.data;
  },
  getPopular: async () => {
    const response = await api.get('/events/popular');
    return response.data;
  },
  getFree: async () => {
    const response = await api.get('/events/free');
    return response.data;
  },
  create: async (eventData) => {
    const response = await api.post('/events', eventData);
    return response.data;
  },
  update: async (id, eventData) => {
    const response = await api.put(`/events/${id}`, eventData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/events/${id}`);
    return response.data;
  },
  attend: async (eventId) => {
    const response = await api.post(`/events/${eventId}/users`);
    return response.data;
  },
  unattend: async (eventId) => {
    const response = await api.delete(`/events/${eventId}/users`);
    return response.data;
  },
};

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  getOne: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
};

export const profileService = {
  getProfile: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  updateProfile: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  deleteProfile: async () => {
    const response = await api.delete('/users/profile');
    return response.data;
  },
};

export default api; 