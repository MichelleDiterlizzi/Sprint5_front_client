import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  InputAdornment,
} from '@mui/material';
import { DateTimePicker } from '@mui/x-date-pickers/DateTimePicker';
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider';
import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns';
import { toast } from 'react-toastify';
import { eventService, categoryService } from '../services/api';
import { useAuth } from '../context/AuthContext';
import { ThemeProvider, createTheme } from '@mui/material';

const theme = createTheme();

const EditEvent = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    date: new Date(),
    location: '',
    price: 0,
    category_id: '',
    image: '',
  });
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const navigate = useNavigate();
  const { id } = useParams();
  const { user } = useAuth();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [eventResponse, categoriesResponse] = await Promise.all([
          eventService.getAll(),
          categoryService.getAll(),
        ]);

        const event = eventResponse.data.find((e) => e.id === parseInt(id));
        if (!event) {
          toast.error('Event not found');
          navigate('/events');
          return;
        }

        if (event.user_id !== user?.id) {
          toast.error('You are not authorized to edit this event');
          navigate('/events');
          return;
        }

        setFormData({
          title: event.title,
          description: event.description,
          date: new Date(event.date),
          location: event.location || '',
          price: event.price || 0,
          category_id: event.category_id || '',
          image: event.image || '',
        });
        setCategories(categoriesResponse.data || []);
      } catch (error) {
        console.error('Error fetching data:', error);
        toast.error('Failed to load event data');
        navigate('/events');
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [id, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDateChange = (newDate) => {
    setFormData((prev) => ({
      ...prev,
      date: newDate,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSubmitting(true);

    try {
      await eventService.update(id, formData);
      toast.success('Event updated successfully!');
      navigate(`/events/${id}`);
    } catch (error) {
      console.error('Error updating event:', error);
      toast.error(error.response?.data?.message || 'Failed to update event');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading event data...</Typography>
      </Container>
    );
  }

  return (
    <ThemeProvider theme={theme}>
      <Container maxWidth="md">
        <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
          <Typography variant="h4" component="h1" gutterBottom>
            Edit Event
          </Typography>

          <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
            <TextField
              margin="normal"
              required
              fullWidth
              id="title"
              label="Event Title"
              name="title"
              value={formData.title}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              multiline
              rows={4}
              id="description"
              label="Event Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
            />

            <LocalizationProvider dateAdapter={AdapterDateFns}>
              <DateTimePicker
                label="Event Date and Time"
                value={formData.date}
                onChange={handleDateChange}
                renderInput={(params) => (
                  <TextField
                    {...params}
                    margin="normal"
                    required
                    fullWidth
                    name="date"
                  />
                )}
              />
            </LocalizationProvider>

            <TextField
              margin="normal"
              required
              fullWidth
              id="location"
              label="Event Location"
              name="location"
              value={formData.location}
              onChange={handleChange}
            />

            <TextField
              margin="normal"
              required
              fullWidth
              id="price"
              label="Event Price"
              name="price"
              type="number"
              InputProps={{
                startAdornment: (
                  <InputAdornment position="start">$</InputAdornment>
                ),
              }}
              value={formData.price}
              onChange={handleChange}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category"
                name="category_id"
                value={formData.category_id}
                onChange={handleChange}
                label="Category"
              >
                {categories.map((category) => (
                  <MenuItem key={category.id} value={category.id}>
                    {category.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <TextField
              margin="normal"
              fullWidth
              id="image"
              label="Image URL"
              name="image"
              value={formData.image}
              onChange={handleChange}
              helperText="Optional: Provide a URL for the event image"
            />

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ flex: 1 }}
              >
                {submitting ? 'Updating...' : 'Update Event'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/events/${id}`)}
                sx={{ flex: 1 }}
              >
                Cancel
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditEvent; 