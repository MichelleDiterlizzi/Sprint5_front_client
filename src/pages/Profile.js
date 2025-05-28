import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Container,
  Paper,
  Typography,
  Box,
  TextField,
  Button,
  Grid,
  Card,
  CardContent,
  CardActions,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogContentText,
  DialogActions,
  List,
  ListItem,
  ListItemText,
  Divider,
  Alert,
} from '@mui/material';
import { toast } from 'react-toastify';
import { profileService, eventService } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Profile = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    password_confirmation: '',
  });
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [openDialog, setOpenDialog] = useState(false);
  const [createdEvents, setCreatedEvents] = useState([]);
  const [attendingEvents, setAttendingEvents] = useState([]);
  const [editMode, setEditMode] = useState(false);
  const [passwordError, setPasswordError] = useState('');
  const [emailError, setEmailError] = useState('');
  const [confirmPasswordError, setConfirmPasswordError] = useState('');
  const navigate = useNavigate();
  const { user, logout, isAuthenticated } = useAuth();

  useEffect(() => {
    if (!isAuthenticated) {
      navigate('/login');
      return;
    }
    const fetchProfile = async () => {
      try {
        const response = await profileService.get();
        setFormData({
          name: response.data.name || '',
          email: response.data.email || '',
          password: '',
          password_confirmation: '',
        });
      } catch (error) {
        console.error('Error fetching profile:', error);
        toast.error('Failed to load profile data');
      } finally {
        setLoading(false);
      }
    };
    const fetchEvents = async () => {
      try {
        const allEvents = await eventService.getAll();
        const events = Array.isArray(allEvents.data) ? allEvents.data : [];
        setCreatedEvents(events.filter(e => e.creator?.id === user?.id));
        setAttendingEvents(events.filter(e => e.attendees?.some(a => a.id === user?.id)));
      } catch (error) {
        toast.error('Failed to load your events');
      }
    };
    fetchProfile();
    fetchEvents();
  }, [isAuthenticated, navigate, user]);

  const validateEmail = (email) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  };

  const validateForm = async () => {
    let valid = true;
    // Email
    if (!validateEmail(formData.email)) {
      setEmailError('Please enter a valid email address');
      valid = false;
    } else {
      setEmailError('');
    }
    // Password
    if (formData.password && formData.password.length < 9) {
      setPasswordError('Password must be at least 9 characters');
      valid = false;
    } else {
      setPasswordError('');
    }
    // Confirm Password
    if (formData.password && formData.password !== formData.password_confirmation) {
      setConfirmPasswordError('Passwords do not match');
      valid = false;
    } else {
      setConfirmPasswordError('');
    }
    return valid;
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));

    // Validación en tiempo real
    if (name === 'email') {
      if (value && !validateEmail(value)) {
        setEmailError('Please enter a valid email address');
      } else {
        setEmailError('');
      }
    }
    if (name === 'password') {
      if (value && value.length < 9) {
        setPasswordError('Password must be at least 9 characters');
      } else {
        setPasswordError('');
      }
      if (formData.password_confirmation && value !== formData.password_confirmation) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
    if (name === 'password_confirmation') {
      if (value !== formData.password) {
        setConfirmPasswordError('Passwords do not match');
      } else {
        setConfirmPasswordError('');
      }
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const isValid = await validateForm();
    if (!isValid) return;
    setSubmitting(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };
      const response = await profileService.update(updateData);
      toast.success('Profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        password: '',
        password_confirmation: '',
      }));
      setEditMode(false);
      setPasswordError('');
      setEmailError('');
      setConfirmPasswordError('');
      // Recargar datos de perfil tras guardar
      const refreshed = await profileService.get();
      setFormData({
        name: refreshed.data.name || '',
        email: refreshed.data.email || '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(msg => {
          if (msg.toLowerCase().includes('email')) setEmailError(msg);
          if (msg.toLowerCase().includes('password')) setPasswordError(msg);
        });
      }
      toast.error('Error: ' + (error.response?.data?.message || error.message));
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    try {
      await profileService.deleteProfile();
      toast.success('Account deleted successfully');
      logout();
      navigate('/');
    } catch (error) {
      console.error('Error deleting account:', error);
      toast.error('Failed to delete account');
    }
    setOpenDialog(false);
  };

  const handleLogout = () => {
    logout();
    navigate('/');
    toast.success('Logged out successfully');
  };

  if (loading) {
    return (
      <Container>
        <Typography>Loading profile...</Typography>
      </Container>
    );
  }

  if (!formData.name && !formData.email) {
    return (
      <Container>
        <Typography color="error">No profile data found.</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="md">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
              <Typography variant="h4" component="h1">
                Profile
              </Typography>
            </Box>
            
            {!editMode ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1"><b>Name:</b> {formData.name}</Typography>
                <Typography variant="subtitle1"><b>Email:</b> {formData.email}</Typography>
                <Box sx={{ mt: 2, display: 'flex', gap: 2 }}>
                  <Button variant="outlined" onClick={() => setEditMode(true)}>
                    Edit Profile
                  </Button>
                  <Button 
                    variant="outlined" 
                    color="error" 
                    onClick={handleLogout}
                  >
                    Logout
                  </Button>
                </Box>
              </Box>
            ) : (
              <Box component="form" onSubmit={handleSubmit} noValidate sx={{ mt: 3 }}>
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="name"
                  label="Full Name"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  required
                  fullWidth
                  id="email"
                  label="Email Address"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                  error={!!emailError}
                  helperText={emailError}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="password"
                  label="New Password"
                  name="password"
                  type="password"
                  value={formData.password}
                  onChange={handleChange}
                  error={!!passwordError}
                  helperText={passwordError}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  id="password_confirmation"
                  label="Confirm New Password"
                  name="password_confirmation"
                  type="password"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                  error={!!confirmPasswordError}
                  helperText={confirmPasswordError}
                />
                <Box sx={{ mt: 3, display: 'flex', gap: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting || !!passwordError || !!emailError || !!confirmPasswordError}
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      setEditMode(false);
                      setPasswordError('');
                      setEmailError('');
                      setConfirmPasswordError('');
                      setFormData(prev => ({
                        ...prev,
                        password: '',
                        password_confirmation: ''
                      }));
                    }}
                  >
                    Cancel
                  </Button>
                </Box>
              </Box>
            )}
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>Events Created by You</Typography>
            <List>
              {createdEvents.length === 0 && (
                <ListItem><ListItemText primary="You haven't created any events yet." /></ListItem>
              )}
              {createdEvents.map(event => (
                <ListItem key={event.id} button onClick={() => navigate(`/events/${event.id}`)}>
                  <ListItemText primary={event.title} secondary={new Date(event.event_date).toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} />
                </ListItem>
              ))}
            </List>
            <Divider sx={{ my: 4 }} />
            <Typography variant="h5" gutterBottom>Events You're Attending</Typography>
            <List>
              {attendingEvents.length === 0 && (
                <ListItem><ListItemText primary="You haven't joined any events yet." /></ListItem>
              )}
              {attendingEvents.map(event => (
                <ListItem key={event.id} button onClick={() => navigate(`/events/${event.id}`)}>
                  <ListItemText primary={event.title} secondary={new Date(event.event_date).toLocaleString('es-ES', { year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit' })} />
                </ListItem>
              ))}
            </List>
          </Paper>
        </Grid>

        <Grid item xs={12} md={4}>
          <Card sx={{ mt: 4 }}>
            <CardContent>
              <Typography variant="h6" color="error" gutterBottom>
                Danger Zone
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Once you delete your account, there is no going back. Please be
                certain.
              </Typography>
            </CardContent>
            <CardActions>
              <Button
                color="error"
                onClick={() => setOpenDialog(true)}
                fullWidth
              >
                Delete Account
              </Button>
            </CardActions>
          </Card>
        </Grid>
      </Grid>

      <Dialog
        open={openDialog}
        onClose={() => setOpenDialog(false)}
        aria-labelledby="alert-dialog-title"
        aria-describedby="alert-dialog-description"
      >
        <DialogTitle id="alert-dialog-title">
          {"Are you sure you want to delete your account?"}
        </DialogTitle>
        <DialogContent>
          <DialogContentText id="alert-dialog-description">
            This action cannot be undone. All your data, including your events and
            registrations, will be permanently deleted.
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenDialog(false)}>Cancel</Button>
          <Button onClick={handleDeleteAccount} color="error" autoFocus>
            Delete Account
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default Profile; 