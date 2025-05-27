export const mockEvents = [
  {
    id: 1,
    title: "Concierto de Jazz",
    description: "Una noche de jazz en vivo con los mejores músicos de la ciudad",
    event_date: "2024-04-15T20:00:00",
    location: "Sala Jazz Club",
    address: "Calle Principal 123",
    price: 25.00,
    is_free: false,
    capacity: 100,
    category: {
      id: 1,
      name: "Música",
      description: "Eventos musicales y conciertos"
    },
    image: "https://picsum.photos/800/400",
    created_at: "2024-03-01T10:00:00",
    updated_at: "2024-03-01T10:00:00",
    creator: {
      id: 1,
      name: "Organizador de Eventos",
      email: "organizador@ejemplo.com"
    },
    attendees: []
  },
  {
    id: 2,
    title: "Workshop de Programación",
    description: "Aprende los fundamentos de React y JavaScript",
    event_date: "2024-04-20T15:00:00",
    location: "Centro de Innovación",
    address: "Avenida Tecnológica 456",
    price: 0.00,
    is_free: true,
    capacity: 50,
    category: {
      id: 2,
      name: "Tecnología",
      description: "Eventos relacionados con tecnología y programación"
    },
    image: "https://picsum.photos/800/401",
    created_at: "2024-03-02T10:00:00",
    updated_at: "2024-03-02T10:00:00",
    creator: {
      id: 2,
      name: "Tech Academy",
      email: "tech@ejemplo.com"
    },
    attendees: []
  },
  {
    id: 3,
    title: "Feria Gastronómica",
    description: "Degustación de platos típicos de la región",
    event_date: "2024-04-25T12:00:00",
    location: "Plaza Central",
    address: "Plaza Mayor 789",
    price: 15.00,
    is_free: false,
    capacity: 200,
    category: {
      id: 3,
      name: "Gastronomía",
      description: "Eventos gastronómicos y culinarios"
    },
    image: "https://picsum.photos/800/402",
    created_at: "2024-03-03T10:00:00",
    updated_at: "2024-03-03T10:00:00",
    creator: {
      id: 3,
      name: "Chef Gourmet",
      email: "chef@ejemplo.com"
    },
    attendees: []
  }
];

export const mockCategories = [
  {
    id: 1,
    name: "Música",
    description: "Eventos musicales y conciertos"
  },
  {
    id: 2,
    name: "Tecnología",
    description: "Eventos relacionados con tecnología y programación"
  },
  {
    id: 3,
    name: "Gastronomía",
    description: "Eventos gastronómicos y culinarios"
  }
];

export const mockUser = {
  id: 1,
  name: "Usuario Ejemplo",
  email: "usuario@ejemplo.com",
  created_at: "2024-03-01T10:00:00",
  updated_at: "2024-03-01T10:00:00"
}; 