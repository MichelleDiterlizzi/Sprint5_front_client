import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  Button,
  Chip,
  Grid,
  Divider,
} from '@mui/material';
import {
  CalendarToday,
  LocationOn,
  AttachMoney,
  People,
} from '@mui/icons-material';
import { format } from 'date-fns';
import { toast } from 'react-toastify';
import { eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const EventDetail = () => {
  const [event, setEvent] = useState(null);
  const [loading, setLoading] = useState(true);
  const [attending, setAttending] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const fetchEvent = async () => {
    try {
      const response = await eventService.getAll();
      const foundEvent = response.data.find((e) => e.id === parseInt(id));
      if (foundEvent) {
        setEvent(foundEvent);
        setAttending(foundEvent.attendees?.some((a) => a.id === user?.id));
      } else {
        toast.error('Event not found');
        navigate('/events');
      }
    } catch (error) {
      console.error('Error fetching event:', error);
      toast.error('Failed to load event details');
      navigate('/events');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEvent();
  }, [id, user]);

  const handleAttendance = async () => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }

    try {
      if (attending) {
        await eventService.unattend(id);
        toast.success('Successfully unregistered from the event');
      } else {
        await eventService.attend(id);
        toast.success('Successfully registered for the event');
      }
      fetchEvent();
    } catch (error) {
      console.error('Error updating attendance:', error);
      toast.error(
        error.response?.data?.message ||
          'Failed to update event registration status'
      );
    }
  };

  const handleEdit = () => {
    navigate(`/events/${id}/edit`);
  };

  const handleDelete = async () => {
    if (window.confirm('Are you sure you want to delete this event?')) {
      try {
        await eventService.delete(id);
        toast.success('Event deleted successfully');
        navigate('/events');
      } catch (error) {
        console.error('Error deleting event:', error);
        toast.error('Failed to delete event');
      }
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading event details...</Typography>
      </Container>
    );
  }

  if (!event) {
    return (
      <Container>
        <Typography>Event not found</Typography>
      </Container>
    );
  }

  const isOwner = event.user_id === user?.id;

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Box
          component="img"
          src={event.image || 'https://source.unsplash.com/random?event'}
          alt={event.title}
          sx={{
            width: '100%',
            height: 300,
            objectFit: 'cover',
            borderRadius: 1,
            mb: 4,
          }}
        />

        <Grid container spacing={3}>
          <Grid item xs={12} md={8}>
            <Typography variant="h4" component="h1" gutterBottom>
              {event.title}
            </Typography>

            <Box sx={{ mb: 3, display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              <Chip
                icon={<CalendarToday />}
                label={format(new Date(event.date), 'PPP')}
              />
              <Chip
                icon={<LocationOn />}
                label={event.location || 'Location TBA'}
              />
              <Chip
                icon={<AttachMoney />}
                label={event.price === 0 ? 'Free' : `$${event.price}`}
                color={event.price === 0 ? 'success' : 'default'}
              />
              <Chip
                icon={<People />}
                label={`${event.attendees?.length || 0} attending`}
              />
            </Box>

            <Typography variant="body1" paragraph>
              {event.description}
            </Typography>

            <Box sx={{ mt: 4 }}>
              <Typography variant="h6" gutterBottom>
                Category
              </Typography>
              <Chip label={event.category?.name || 'Uncategorized'} />
            </Box>
          </Grid>

          <Grid item xs={12} md={4}>
            <Paper elevation={1} sx={{ p: 2 }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                {isAuthenticated && !isOwner && (
                  <Button
                    variant="contained"
                    color={attending ? 'error' : 'primary'}
                    onClick={handleAttendance}
                    fullWidth
                  >
                    {attending ? 'Cancel Registration' : 'Register for Event'}
                  </Button>
                )}

                {isOwner && (
                  <>
                    <Button
                      variant="outlined"
                      color="primary"
                      onClick={handleEdit}
                      fullWidth
                    >
                      Edit Event
                    </Button>
                    <Button
                      variant="outlined"
                      color="error"
                      onClick={handleDelete}
                      fullWidth
                    >
                      Delete Event
                    </Button>
                  </>
                )}
              </Box>
            </Paper>
          </Grid>
        </Grid>

        {event.attendees && event.attendees.length > 0 && (
          <>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h6" gutterBottom>
              Attendees
            </Typography>
            <Box sx={{ display: 'flex', gap: 1, flexWrap: 'wrap' }}>
              {event.attendees.map((attendee) => (
                <Chip
                  key={attendee.id}
                  label={attendee.name}
                  variant="outlined"
                />
              ))}
            </Box>
          </>
        )}
      </Paper>
    </Container>
  );
};

export default EventDetail; 