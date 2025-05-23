import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Grid,
  Card,
  CardContent,
  CardMedia,
  Typography,
  Button,
  Box,
  Chip,
  ToggleButtonGroup,
  ToggleButton,
} from '@mui/material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventList = () => {
  const [events, setEvents] = useState([]);
  const [filter, setFilter] = useState('all');
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();

  const fetchEvents = async (filterType = 'all') => {
    try {
      let response;
      switch (filterType) {
        case 'popular':
          response = await eventService.getPopular();
          break;
        case 'free':
          response = await eventService.getFree();
          break;
        default:
          response = await eventService.getAll();
      }
      setEvents(response.data || []);
    } catch (error) {
      console.error('Error fetching events:', error);
      toast.error('Failed to load events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvents(filter);
  }, [filter]);

  const handleFilterChange = (event, newFilter) => {
    if (newFilter !== null) {
      setFilter(newFilter);
    }
  };

  const handleAttend = async (eventId) => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      await eventService.attend(eventId);
      toast.success('Successfully registered for the event!');
      fetchEvents(filter);
    } catch (error) {
      console.error('Error attending event:', error);
      toast.error(error.response?.data?.message || 'Failed to register for event');
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading events...</Typography>
      </Container>
    );
  }

  return (
    <Container>
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Events
        </Typography>
        <ToggleButtonGroup
          value={filter}
          exclusive
          onChange={handleFilterChange}
          aria-label="event filter"
        >
          <ToggleButton value="all">All Events</ToggleButton>
          <ToggleButton value="popular">Popular</ToggleButton>
          <ToggleButton value="free">Free</ToggleButton>
        </ToggleButtonGroup>
      </Box>

      <Grid container spacing={4}>
        {events.map((event) => (
          <Grid item key={event.id} xs={12} sm={6} md={4}>
            <Card
              sx={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
              }}
            >
              <CardMedia
                component="img"
                height="200"
                image={event.image || 'https://source.unsplash.com/random?event'}
                alt={event.title}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h5" component="h2">
                  {event.title}
                </Typography>
                <Typography variant="body2" color="text.secondary" paragraph>
                  {event.description}
                </Typography>
                <Box sx={{ mt: 2, mb: 2 }}>
                  <Chip
                    label={format(new Date(event.date), 'PPP')}
                    sx={{ mr: 1 }}
                  />
                  <Chip
                    label={event.price === 0 ? 'Free' : `$${event.price}`}
                    color={event.price === 0 ? 'success' : 'default'}
                  />
                </Box>
                <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                  <Button
                    size="small"
                    onClick={() => navigate(`/events/${event.id}`)}
                  >
                    View Details
                  </Button>
                  {isAuthenticated && (
                    <Button
                      size="small"
                      variant="contained"
                      onClick={() => handleAttend(event.id)}
                    >
                      Attend
                    </Button>
                  )}
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {events.length === 0 && (
        <Typography variant="h6" sx={{ mt: 4, textAlign: 'center' }}>
          No events found
        </Typography>
      )}
    </Container>
  );
};

export default EventList; 