export const mockEvents = [
  {
    id: 1,
    title: "Concierto de Jazz",
    description: "Una noche de jazz en vivo con los mejores músicos de la ciudad",
    date: "2024-04-15T20:00:00",
    location: "Sala Jazz Club",
    price: 25.00,
    capacity: 100,
    category_id: 1,
    image: "https://picsum.photos/800/400",
    created_at: "2024-03-01T10:00:00",
    updated_at: "2024-03-01T10:00:00"
  },
  {
    id: 2,
    title: "Workshop de Programación",
    description: "Aprende los fundamentos de React y JavaScript",
    date: "2024-04-20T15:00:00",
    location: "Centro de Innovación",
    price: 0.00,
    capacity: 50,
    category_id: 2,
    image: "https://picsum.photos/800/401",
    created_at: "2024-03-02T10:00:00",
    updated_at: "2024-03-02T10:00:00"
  },
  {
    id: 3,
    title: "Feria Gastronómica",
    description: "Degustación de platos típicos de la región",
    date: "2024-04-25T12:00:00",
    location: "Plaza Central",
    price: 15.00,
    capacity: 200,
    category_id: 3,
    image: "https://picsum.photos/800/402",
    created_at: "2024-03-03T10:00:00",
    updated_at: "2024-03-03T10:00:00"
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