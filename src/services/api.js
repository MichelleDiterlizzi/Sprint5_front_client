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
    try {
      const response = await api.get('/events');
      console.log('API Response in service:', response);
      return response.data;
    } catch (error) {
      console.error('Error in eventService.getAll:', error);
      throw error;
    }
  },
  getById: async (id) => {
    const response = await api.get(`/events/${id}`);
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
  attend: async (id) => {
    const response = await api.post(`/events/${id}/attend`);
    return response.data;
  },
  attendEvent: async (id, guests_count) => {
    const response = await api.post(`/events/${id}/attend`, { guests_count });
    return response.data;
  },
  getPopular: async () => {
    try {
      const response = await api.get('/events/popular');
      console.log('Popular events API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching popular events:', error);
      throw error;
    }
  },
  getFree: async () => {
    try {
      const response = await api.get('/events/free');
      console.log('Free events API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching free events:', error);
      throw error;
    }
  },
  getBeforeTime: async (time) => {
    try {
      const response = await api.get('/events/before-time', { 
        params: { time_before: time } 
      });
      console.log('Before time events API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching before time events:', error);
      throw error;
    }
  },
  getAfterTime: async (time) => {
    try {
      const response = await api.get('/events/after-time', { 
        params: { time_after: time } 
      });
      console.log('After time events API response:', response);
      return response.data;
    } catch (error) {
      console.error('Error fetching after time events:', error);
      throw error;
    }
  },
};

export const categoryService = {
  getAll: async () => {
    const response = await api.get('/categories');
    return response.data;
  },
  getById: async (id) => {
    const response = await api.get(`/categories/${id}`);
    return response.data;
  },
  create: async (categoryData) => {
    const response = await api.post('/categories', categoryData);
    return response.data;
  },
  update: async (id, categoryData) => {
    const response = await api.put(`/categories/${id}`, categoryData);
    return response.data;
  },
  delete: async (id) => {
    const response = await api.delete(`/categories/${id}`);
    return response.data;
  },
};

export const profileService = {
  get: async () => {
    const response = await api.get('/users/profile');
    return response.data;
  },
  update: async (profileData) => {
    const response = await api.put('/users/profile', profileData);
    return response.data;
  },
  delete: async () => {
    const response = await api.delete('/users/profile');
    return response.data;
  },
};

export default api; 