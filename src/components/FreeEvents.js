import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import EventCard from './EventCard';

const FreeEvents = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchFreeEvents = async () => {
      try {
        const response = await eventService.getFree();
        console.log('Free events response:', response); // Para debugging
        if (response && response.data) {
          setEvents(response.data);
        } else {
          setEvents([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching free events:', err);
        setError('Error al cargar los eventos gratuitos');
        setLoading(false);
      }
    };

    fetchFreeEvents();
  }, []);

  if (loading) return <div className="text-center">Cargando eventos gratuitos...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;
  if (!events || events.length === 0) return <div className="text-center">No hay eventos gratuitos disponibles</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-6">Eventos Gratuitos</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {events.map((event) => (
          <EventCard key={event.id} event={event} />
        ))}
      </div>
    </div>
  );
};

export default FreeEvents; 