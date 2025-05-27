import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const EventCard = ({ event }) => {
  const navigate = useNavigate();
  const [imageError, setImageError] = useState(false);

  const getEventImage = (event) => {
    if (event.image) {
      return event.image;
    }
    if (event.category && event.category.image) {
      return event.category.image;
    }
    return 'https://picsum.photos/800/400';
  };

  const getDefaultImage = (categoryName) => {
    const categoryImages = {
      'Conciertos': 'https://placehold.co/600x400/FF5733/FFFFFF?text=Concierto',
      'Deportes': 'https://placehold.co/600x400/33FF57/FFFFFF?text=Deportes',
      'Teatro': 'https://placehold.co/600x400/3357FF/FFFFFF?text=Teatro',
      'Gastronomía': 'https://placehold.co/600x400/FF33A8/FFFFFF?text=Gastronomía',
      'Arte': 'https://placehold.co/600x400/33FFF6/FFFFFF?text=Arte',
      'Tecnología': 'https://placehold.co/600x400/F6FF33/FFFFFF?text=Tecnología',
      'Educación': 'https://placehold.co/600x400/FF3333/FFFFFF?text=Educación',
      'Networking': 'https://placehold.co/600x400/33FF33/FFFFFF?text=Networking',
      'Otros': 'https://placehold.co/600x400/333333/FFFFFF?text=Evento'
    };
    
    return categoryImages[categoryName] || 'https://placehold.co/600x400/333333/FFFFFF?text=Evento';
  };

  return (
    <div 
      className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl transition-shadow duration-300 flex flex-col h-full"
      onClick={() => navigate(`/events/${event.id}`)}
    >
      <div className="relative h-48">
        <img
          src={getEventImage(event)}
          alt={event.title}
          className="w-full h-full object-cover"
          onError={() => setImageError(true)}
        />
        <div className="absolute top-2 right-2 bg-white px-2 py-0.5 rounded-full shadow-sm">
          <span className="text-xs">
            {event.is_free ? 'Gratuito' : `${event.price}€`}
          </span>
        </div>
      </div>
      <div className="p-4 flex-1 flex flex-col">
        <h3 className="text-lg font-semibold mb-2">{event.title}</h3>
        <div className="flex items-center text-gray-600 mb-2">
          <span className="text-gray-500 mr-1">📍</span>
          <span className="text-sm">
            {event.location}
            {event.address && ` - ${event.address}`}
          </span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <span className="text-gray-500 mr-1">📅</span>
          <span className="text-sm">
            {new Date(event.event_date).toLocaleString()}
          </span>
        </div>
        <div className="flex items-center text-gray-600 mb-2">
          <span className="text-gray-500 mr-1">👤</span>
          <span className="text-sm">{event.creator?.name || 'Anónimo'}</span>
        </div>
        <div className="flex items-center text-gray-600 mt-auto">
          <span className="text-gray-500 mr-1">🏷️</span>
          <span className="text-sm">{event.category?.name || 'Sin categoría'}</span>
        </div>
      </div>
    </div>
  );
};

export default EventCard; 