import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import EventCard from './EventCard';

const PopularEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPopularEvents = async () => {
      try {
        const response = await eventService.getPopular();
        console.log('Popular events response:', response); // Para debugging
        if (response && response.data) {
          setEvents(response.data);
        } else {
          setEvents([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching popular events:', err);
        setError('Error al cargar los eventos populares');
        setLoading(false);
      }
    };

    fetchPopularEvents();
  }, []);

  if (loading) return <div className="text-center">Cargando eventos populares...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!events || events.length === 0) return <div className="text-center">No hay eventos populares disponibles</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Eventos Populares</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default PopularEvents; 