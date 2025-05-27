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
        setCreatedEvents(events.filter(e => e.creator_id === user?.id));
        setAttendingEvents(events.filter(e => e.attendees?.some(a => a.id === user?.id)));
      } catch (error) {
        toast.error('Failed to load your events');
      }
    };
    fetchProfile();
    fetchEvents();
  }, [isAuthenticated, navigate, user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log('handleSubmit called');
    console.log('formData:', formData);
    let hasError = false;
    if (formData.password && formData.password.length < 8) {
      toast.error('Password must be at least 8 characters');
      hasError = true;
    }
    if (formData.password && formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      hasError = true;
    }
    if (hasError) return;
    setSubmitting(true);
    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };
      console.log('Sending update:', updateData);
      const response = await profileService.update(updateData);
      console.log('Update response:', response);
      toast.success('Profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        password: '',
        password_confirmation: '',
      }));
      setEditMode(false);
      // Recargar datos de perfil tras guardar
      const refreshed = await profileService.get();
      setFormData({
        name: refreshed.data.name || '',
        email: refreshed.data.email || '',
        password: '',
        password_confirmation: '',
      });
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Error: ' + (error.response?.data?.message || error.message));
      if (error.response?.data?.errors) {
        error.response.data.errors.forEach(msg => toast.error(msg));
      }
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
            <Typography variant="h4" component="h1" gutterBottom>
              Profile
            </Typography>
            {!editMode ? (
              <Box sx={{ mb: 3 }}>
                <Typography variant="subtitle1"><b>Name:</b> {formData.name}</Typography>
                <Typography variant="subtitle1"><b>Email:</b> {formData.email}</Typography>
                <Button variant="outlined" sx={{ mt: 2 }} onClick={() => setEditMode(true)}>
                  Edit Profile
                </Button>
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
                />
                <Typography variant="h6" sx={{ mt: 4, mb: 2 }}>
                  Change Password
                </Typography>
                <TextField
                  margin="normal"
                  fullWidth
                  name="password"
                  label="New Password"
                  type="password"
                  id="password"
                  value={formData.password}
                  onChange={handleChange}
                />
                <TextField
                  margin="normal"
                  fullWidth
                  name="password_confirmation"
                  label="Confirm New Password"
                  type="password"
                  id="password_confirmation"
                  value={formData.password_confirmation}
                  onChange={handleChange}
                />
                <Box sx={{ display: 'flex', gap: 2, mt: 2 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    disabled={submitting}
                  >
                    {submitting ? 'Saving...' : 'Save Changes'}
                  </Button>
                  <Button
                    variant="outlined"
                    color="secondary"
                    onClick={() => setEditMode(false)}
                    disabled={submitting}
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