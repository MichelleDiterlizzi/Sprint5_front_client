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
} from '@mui/material';
import { toast } from 'react-toastify';
import { profileService } from '../services/api';
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
  const navigate = useNavigate();
  const { user, logout } = useAuth();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await profileService.getProfile();
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

    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (formData.password && formData.password !== formData.password_confirmation) {
      toast.error('Passwords do not match');
      return;
    }

    setSubmitting(true);

    try {
      const updateData = {
        name: formData.name,
        email: formData.email,
        ...(formData.password && { password: formData.password }),
      };

      await profileService.updateProfile(updateData);
      toast.success('Profile updated successfully!');
      setFormData((prev) => ({
        ...prev,
        password: '',
        password_confirmation: '',
      }));
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error(error.response?.data?.message || 'Failed to update profile');
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

  return (
    <Container maxWidth="md">
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper elevation={3} sx={{ p: 4, mt: 4 }}>
            <Typography variant="h4" component="h1" gutterBottom>
              Profile Settings
            </Typography>

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

              <Button
                type="submit"
                variant="contained"
                sx={{ mt: 3 }}
                disabled={submitting}
              >
                {submitting ? 'Saving...' : 'Save Changes'}
              </Button>
            </Box>
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