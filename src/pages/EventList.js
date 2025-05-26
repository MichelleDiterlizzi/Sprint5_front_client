import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import Button from '@mui/material/Button';
import Chip from '@mui/material/Chip';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Grid from '@mui/material/Grid';
import { toast } from 'react-toastify';

const getEventImage = (event) => {
  if (event.image && event.image !== 'img/' && event.image.startsWith('http')) {
    return event.image;
  }
  if (event.image && event.image !== 'img/') {
    return `http://localhost:8000/storage/${event.image}`;
  }
  if (event.category?.image) {
    if (event.category.image.startsWith('http')) {
      return event.category.image;
    }
    return `http://localhost:8000/storage/${event.category.image}`;
  }
  return 'https://source.unsplash.com/random?event';
};

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await eventService.getAll();
        setEvents(Array.isArray(response.data) ? response.data : []);
      } catch (error) {
        toast.error('Error al cargar los eventos');
      } finally {
        setLoading(false);
      }
    };
    fetchEvents();
  }, []);

  const handleAttend = async (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    try {
      await eventService.attend(eventId);
      toast.success('¡Te has registrado en el evento!');
    } catch (error) {
      toast.error(error.response?.data?.message || 'No se pudo registrar en el evento');
    }
  };

  if (loading) {
    return <div className="text-center py-8">Cargando eventos...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Eventos</h1>
      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card className="flex flex-col h-full shadow-md hover:shadow-lg transition-transform duration-200 transform hover:scale-105">
              <CardMedia
                component="img"
                height="180"
                image={getEventImage(event)}
                alt={event.title}
                onError={(e) => { e.target.onerror = null; e.target.src = 'https://source.unsplash.com/random?event'; }}
              />
              <CardContent className="flex-1 flex flex-col">
                <Typography gutterBottom variant="h6" component="h2">
                  {event.title}
                </Typography>
                <Box className="flex flex-wrap gap-1 mb-2">
                  <Chip label={event.category?.name || 'Sin categoría'} color="primary" size="small" />
                  {event.is_free && <Chip label="Gratuito" color="success" size="small" />}
                  {!event.is_free && <Chip label={`${event.price}€`} color="secondary" size="small" />}
                </Box>
                <Typography variant="body2" color="text.secondary" className="mb-1">
                  📍 {event.location}{event.address && ` - ${event.address}`}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-1">
                  📅 {event.event_date ? new Date(event.event_date).toLocaleString() : 'Fecha no disponible'}
                </Typography>
                <Typography variant="body2" color="text.secondary" className="mb-2">
                  👤 {event.creator?.name || 'Anónimo'}
                </Typography>
                <Box className="flex gap-2 mt-auto">
                  <Button
                    size="small"
                    variant="outlined"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    Ver Detalles
                  </Button>
                  {isAuthenticated && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAttend(event.id)}
                    >
                      Participar
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
      {events.length === 0 && (
        <Typography variant="h6" className="mt-4 text-center">
          No se encontraron eventos
        </Typography>
      )}
    </div>
  );
};

export default EventList; 