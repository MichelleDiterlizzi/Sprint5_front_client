import { mockEvents, mockCategories, mockUser } from '../utils/mockData';

// Servicios simulados para el nivel 1
export const authService = {
  login: async (credentials) => {
    // Simulando login exitoso
    return { 
      data: { 
        token: 'mock-token',
        user: mockUser 
      } 
    };
  },
  register: async (userData) => {
    // Simulando registro exitoso
    return { 
      data: { 
        message: 'Usuario registrado con éxito',
        user: { ...mockUser, ...userData }
      } 
    };
  },
  logout: async () => {
    // Simulando logout
    return { data: { message: 'Sesión cerrada con éxito' } };
  },
};

export const eventService = {
  getAll: async () => {
    return { data: mockEvents };
  },
  getById: async (id) => {
    const event = mockEvents.find(e => e.id === parseInt(id));
    return { data: event };
  },
  create: async (eventData) => {
    const newEvent = {
      id: mockEvents.length + 1,
      ...eventData,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString()
    };
    return { data: newEvent };
  },
  update: async (id, eventData) => {
    const event = mockEvents.find(e => e.id === parseInt(id));
    const updatedEvent = { ...event, ...eventData, updated_at: new Date().toISOString() };
    return { data: updatedEvent };
  },
  delete: async (id) => {
    return { data: { message: 'Evento eliminado con éxito' } };
  },
  attend: async (id) => {
    return { data: { message: 'Asistencia registrada con éxito' } };
  },
  attendEvent: async (id, guests_count) => {
    return { data: { message: `Asistencia registrada con ${guests_count} invitados` } };
  },
  getPopular: async () => {
    return { data: mockEvents.slice(0, 2) };
  },
  getFree: async () => {
    return { data: mockEvents.filter(e => e.price === 0) };
  },
  getBeforeTime: async (time) => {
    return { data: mockEvents.filter(e => new Date(e.date) < new Date(time)) };
  },
  getAfterTime: async (time) => {
    return { data: mockEvents.filter(e => new Date(e.date) > new Date(time)) };
  },
};

export const categoryService = {
  getAll: async () => {
    return { data: mockCategories };
  },
  getById: async (id) => {
    const category = mockCategories.find(c => c.id === parseInt(id));
    return { data: category };
  },
  create: async (categoryData) => {
    const newCategory = {
      id: mockCategories.length + 1,
      ...categoryData
    };
    return { data: newCategory };
  },
  update: async (id, categoryData) => {
    const category = mockCategories.find(c => c.id === parseInt(id));
    const updatedCategory = { ...category, ...categoryData };
    return { data: updatedCategory };
  },
  delete: async (id) => {
    return { data: { message: 'Categoría eliminada con éxito' } };
  },
};

export const profileService = {
  get: async () => {
    return { data: mockUser };
  },
  update: async (profileData) => {
    const updatedUser = { ...mockUser, ...profileData };
    return { data: updatedUser };
  },
  delete: async () => {
    return { data: { message: 'Perfil eliminado con éxito' } };
  },
}; 