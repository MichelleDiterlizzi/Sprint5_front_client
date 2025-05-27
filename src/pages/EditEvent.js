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
  const [isFree, setIsFree] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});

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
        setIsFree(event.price === 0);
        setCategories(categoriesResponse.data || []);
        if (event.image) setImagePreview(event.image);
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

  const handleIsFreeChange = (e) => {
    const checked = e.target.checked;
    setIsFree(checked);
    setFormData((prev) => ({
      ...prev,
      price: checked ? 0 : '',
    }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    } else {
      setImagePreview(null);
    }
  };

  const validate = () => {
    const newErrors = {};
    if (!isFree && (!formData.price || Number(formData.price) <= 0)) {
      newErrors.price = 'El precio debe ser mayor que 0 si el evento no es gratuito.';
    }
    if (imageFile && !imageFile.type.startsWith('image/')) {
      newErrors.image = 'El archivo debe ser una imagen.';
    }
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setSubmitting(true);
    // Simulación de envío
    setTimeout(() => {
      toast.success('Evento editado correctamente (simulado)');
      setSubmitting(false);
      navigate(`/events/${id}`);
    }, 1000);
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

            <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
              <label style={{ marginRight: 8 }}>¿Evento gratuito?</label>
              <input
                type="checkbox"
                checked={isFree}
                onChange={handleIsFreeChange}
              />
            </Box>

            <TextField
              margin="normal"
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
              value={isFree ? 0 : formData.price}
              onChange={handleChange}
              disabled={isFree}
              required={!isFree}
              error={!!errors.price}
              helperText={errors.price}
            />

            <FormControl fullWidth margin="normal">
              <InputLabel id="category-label">Category</InputLabel>
              <Select
                labelId="category-label"
                id="category_id"
                name="category_id"
                value={formData.category_id}
                label="Category"
                onChange={handleChange}
                required
              >
                {categories.map((cat) => (
                  <MenuItem key={cat.id} value={cat.id}>{cat.name}</MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box sx={{ mt: 2 }}>
              <label>Imagen:</label>
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                style={{ display: 'block', marginTop: 8 }}
              />
              {imagePreview && (
                <Box sx={{ mt: 2 }}>
                  <img src={imagePreview} alt="Preview" style={{ maxWidth: 200 }} />
                </Box>
              )}
              {errors.image && <Typography color="error">{errors.image}</Typography>}
            </Box>

            <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
              <Button
                type="submit"
                variant="contained"
                disabled={submitting}
                sx={{ flex: 1 }}
              >
                {submitting ? 'Guardando...' : 'Guardar'}
              </Button>
              <Button
                variant="outlined"
                onClick={() => navigate(`/events/${id}`)}
                sx={{ flex: 1 }}
              >
                Cancelar
              </Button>
            </Box>
          </Box>
        </Paper>
      </Container>
    </ThemeProvider>
  );
};

export default EditEvent;