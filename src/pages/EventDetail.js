import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '@mui/material/Button';

const pink = '#ec4899'; // Tailwind's pink-500

const EventDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [attending, setAttending] = useState(false);
  const { user, isAuthenticated } = useAuth();

  const fetchEventDetails = async () => {
    try {
      const response = await eventService.getById(id);
      setEvent(response.event);
      setAttending(response.event.attendees?.some((a) => a.id === user?.id));
      setLoading(false);
    } catch (err) {
      console.error('Error fetching event details:', err);
      setError('Error al cargar los detalles del evento');
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEventDetails();
  }, [id, user]);

  const handleAttendance = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (attending) {
        await eventService.unattend(id);
        setAttending(false);
        toast.success('Has eliminado tu participación en el evento');
      } else {
        let guests = 0;
        const input = window.prompt('¿Cuántos invitados llevas? (0 si vas solo)', '0');
        if (input === null) return; // Cancelado
        guests = parseInt(input, 10);
        if (isNaN(guests) || guests < 0) {
          toast.error('Por favor, introduce un número válido de invitados');
          return;
        }
        await eventService.attendEvent(id, guests);
        setAttending(true);
        toast.success('Te has apuntado al evento');
      }
      await fetchEventDetails(); // Actualizar los detalles del evento
    } catch (error) {
      console.error('Error updating attendance:', error);
      if (error.response?.status === 409) {
        toast.error('Ya estás participando en este evento');
        setAttending(true);
      } else {
        toast.error(
          error.response?.data?.message ||
          'Error al actualizar la asistencia al evento'
        );
      }
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de que quieres eliminar este evento?')) {
      try {
        await eventService.delete(id);
        toast.success('Evento eliminado correctamente');
        navigate('/events');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Error al eliminar el evento');
      }
    }
  };

  if (loading) return <div className="text-center py-8">Cargando detalles del evento...</div>;
  if (error) return <div className="text-center text-red-500 py-8">{error}</div>;
  if (!event) return <div className="text-center py-8">Evento no encontrado</div>;

  const getEventImage = (event) => {
    if (event.image && event.image.startsWith('http')) {
      return event.image;
    }
    if (event.image) {
      return `http://localhost:8000/storage/${event.image}`;
    }
    if (event.category?.image) {
      if (event.category.image.startsWith('http')) {
        return event.category.image;
      }
      return `http://localhost:8000/storage/${event.category.image}`;
    }
    return 'https://placehold.co/600x400/333333/FFFFFF?text=Evento';
  };

  const isCreator = user && (event.user_id === user.id || user.role === 'admin');

  return (
    <div className="h-screen bg-gray-100 flex flex-col">
      {/* Header */}
      <div className="bg-white shadow-sm p-2">
        <button
          onClick={() => navigate(-1)}
          className="text-blue-600 hover:text-blue-800 flex items-center"
        >
          <span className="text-xs">← Volver</span>
        </button>
      </div>

      {/* Main Content */}
      <div className="flex-1 overflow-hidden p-2">
        <div className="h-full grid grid-cols-1 lg:grid-cols-2 gap-2">
          {/* Image Section */}
          <div className="relative w-full h-32 lg:h-auto">
            <div className="w-full h-full">
              <img
                src={getEventImage(event)}
                alt={event.title}
                className="w-full h-full object-contain"
                style={{ maxHeight: '200px' }}
              />
            </div>
            <div className="absolute top-1 right-1 bg-white px-1.5 py-0.5 rounded-full shadow-sm">
              <span className="text-xs">
                {event.is_free ? 'Gratuito' : `${event.price}€`}
              </span>
            </div>
          </div>

          {/* Details Section */}
          <div className="bg-white rounded p-2 flex flex-col h-full">
            <div className="flex-1">
              <h1 className="text-lg font-bold mb-1">{event.title}</h1>
              
              <div className="space-y-1 mb-2">
                <div className="flex items-center text-xs">
                  <span className="text-gray-500 mr-1">📍</span>
                  <span>
                    {event.location}
                    {event.address && ` - ${event.address}`}
                  </span>
                </div>
                
                <div className="flex items-center text-xs">
                  <span className="text-gray-500 mr-1">📅</span>
                  <span>{new Date(event.event_date).toLocaleString()}</span>
                </div>
              </div>

              <div className="mb-2">
                <h2 className="text-xs font-semibold mb-0.5">Descripción</h2>
                <p className="text-xs text-gray-600">{event.description}</p>
              </div>

              <div className="flex gap-1 mb-2">
                <span className="bg-blue-100 text-blue-800 px-1.5 py-0.5 rounded-full text-xs">
                  {event.category?.name || 'Sin categoría'}
                </span>
                {event.is_free && (
                  <span className="bg-green-100 text-green-800 px-1.5 py-0.5 rounded-full text-xs">
                    Gratuito
                  </span>
                )}
              </div>

              <div className="text-xs mb-2">
                <span className="text-gray-500">Creado por: </span>
                <span className="font-medium">{event.creator?.name || 'Anónimo'}</span>
              </div>
            </div>

            {/* Action Buttons - Now at the bottom */}
            <div className="mt-auto pt-4 border-t">
              {isAuthenticated && !isCreator && (
                <Button
                  variant={attending ? "contained" : "outlined"}
                  color={attending ? "error" : undefined}
                  style={attending ? { fontWeight: 500, fontSize: '1.1rem', marginTop: '1rem' } : {
                    color: pink,
                    borderColor: pink,
                    fontWeight: 500,
                    fontSize: '1.1rem',
                    marginTop: '1rem',
                  }}
                  size="large"
                  fullWidth
                  onClick={handleAttendance}
                >
                  {attending ? 'Eliminar tu participación' : 'Participar en el Evento'}
                </Button>
              )}
              {!isAuthenticated && (
                <Button
                  variant="outlined"
                  style={{
                    color: pink,
                    borderColor: pink,
                    fontWeight: 500,
                    fontSize: '1.1rem',
                    marginTop: '1rem',
                  }}
                  size="large"
                  fullWidth
                  onClick={() => navigate('/login')}
                >
                  Participar en el Evento
                </Button>
              )}
              {isCreator && (
                <div className="flex gap-2 mt-2">
                  <Button
                    variant="outlined"
                    color="primary"
                    size="large"
                    fullWidth
                    style={{ fontWeight: 500, fontSize: '1.1rem' }}
                    onClick={handleEdit}
                  >
                    Editar Evento
                  </Button>
                  <Button
                    variant="outlined"
                    color="error"
                    size="large"
                    fullWidth
                    style={{ fontWeight: 500, fontSize: '1.1rem' }}
                    onClick={handleDelete}
                  >
                    Eliminar Evento
                  </Button>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default EventDetail; 