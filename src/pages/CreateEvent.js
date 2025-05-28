import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
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

const CreateEvent = () => {
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
  const [loading, setLoading] = useState(false);
  const [isFree, setIsFree] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await categoryService.getAll();
        setCategories(response.data || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
        toast.error('Failed to load categories');
      }
    };

    fetchCategories();
  }, []);

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
    
    if (!formData.title.trim()) {
      newErrors.title = 'El título es obligatorio';
    }
    
    if (!formData.description.trim()) {
      newErrors.description = 'La descripción es obligatoria';
    }
    
    if (!formData.date) {
      newErrors.date = 'La fecha es obligatoria';
    }
    
    if (!formData.location.trim()) {
      newErrors.location = 'La ubicación es obligatoria';
    }
    
    if (!isFree && (!formData.price || Number(formData.price) <= 0)) {
      newErrors.price = 'El precio debe ser mayor que 0 si el evento no es gratuito';
    }
    
    if (!formData.category_id) {
      newErrors.category_id = 'La categoría es obligatoria';
    }
    
    if (imageFile && !imageFile.type.startsWith('image/')) {
      newErrors.image = 'El archivo debe ser una imagen';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    // Simulación de envío
    setTimeout(() => {
      toast.success('Evento creado correctamente (simulado)');
      setLoading(false);
      navigate('/events');
    }, 1000);
  };

  return (
    <Container maxWidth="md">
      <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Create New Event
        </Typography>

        <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
          <TextField
            margin="normal"
            required
            fullWidth
            id="title"
            label="Event Title"
            name="title"
            autoFocus
            value={formData.title}
            onChange={handleChange}
            error={!!errors.title}
            helperText={errors.title}
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
            error={!!errors.description}
            helperText={errors.description}
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
                  error={!!errors.date}
                  helperText={errors.date}
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
            error={!!errors.location}
            helperText={errors.location}
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

          <FormControl fullWidth margin="normal" error={!!errors.category_id}>
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
              {categories.map((category) => (
                <MenuItem key={category.id} value={category.id}>
                  {category.name}
                </MenuItem>
              ))}
            </Select>
            {errors.category_id && (
              <Typography color="error" variant="caption">
                {errors.category_id}
              </Typography>
            )}
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
              disabled={loading}
              sx={{ flex: 1 }}
            >
              {loading ? 'Creando...' : 'Crear Evento'}
            </Button>
            <Button
              variant="outlined"
              onClick={() => navigate('/events')}
              sx={{ flex: 1 }}
            >
              Cancelar
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
};

export default CreateEvent; 