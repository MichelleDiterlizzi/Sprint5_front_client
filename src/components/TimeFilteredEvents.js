import React, { useState, useEffect } from 'react';
import { eventService } from '../services/api';
import EventCard from './EventCard';

const TimeFilteredEvents = () => {
  const [beforeEvents, setBeforeEvents] = useState([]);
  const [afterEvents, setAfterEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedTime, setSelectedTime] = useState('19:00');

  useEffect(() => {
    const fetchTimeFilteredEvents = async () => {
      try {
        const [beforeResponse, afterResponse] = await Promise.all([
          eventService.getBeforeTime(selectedTime),
          eventService.getAfterTime(selectedTime)
        ]);
        console.log('Before events response:', beforeResponse); // Para debugging
        console.log('After events response:', afterResponse); // Para debugging

        if (beforeResponse && beforeResponse.data) {
          setBeforeEvents(beforeResponse.data);
        } else {
          setBeforeEvents([]);
        }

        if (afterResponse && afterResponse.data) {
          setAfterEvents(afterResponse.data);
        } else {
          setAfterEvents([]);
        }
        setLoading(false);
      } catch (err) {
        console.error('Error fetching time filtered events:', err);
        setError('Error al cargar los eventos filtrados por hora');
        setLoading(false);
      }
    };

    fetchTimeFilteredEvents();
  }, [selectedTime]);

  const handleTimeChange = (e) => {
    setSelectedTime(e.target.value);
  };

  if (loading) return <div className="text-center">Cargando eventos...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <label htmlFor="time" className="block text-lg font-medium mb-2">
          Selecciona una hora:
        </label>
        <input
          type="time"
          id="time"
          value={selectedTime}
          onChange={handleTimeChange}
          className="border rounded px-3 py-2"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-bold mb-4">Eventos antes de las {selectedTime}</h2>
          {beforeEvents.length === 0 ? (
            <div className="text-center">No hay eventos antes de esta hora</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {beforeEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>

        <div>
          <h2 className="text-2xl font-bold mb-4">Eventos después de las {selectedTime}</h2>
          {afterEvents.length === 0 ? (
            <div className="text-center">No hay eventos después de esta hora</div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {afterEvents.map((event) => (
                <EventCard key={event.id} event={event} />
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default TimeFilteredEvents; 