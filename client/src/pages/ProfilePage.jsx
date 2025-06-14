import React, { useState, useEffect, useContext } from 'react';
import {
  Box,
  Button,
  TextField,
  Typography,
  Avatar,
  Paper,
  Grid,
  Stack,
} from '@mui/material';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import AuthContext from '../context/AuthContext';

const ProfilePage = () => {
  const { user, setUser, token, backendUrl, fetchUserData } = useContext(AuthContext);
  const [activeSection, setActiveSection] = useState('settings');
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [profileImage, setProfileImage] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!user) fetchUserData();
  }, [user]);

  const handleSettingsSubmit = async (e) => {
    e.preventDefault();
    const formData = new FormData();
    formData.append('name', user.name);
    formData.append('email', user.email);
    if (profileImage) formData.append('photo', profileImage);

    try {
      const res = await axios.patch(`${backendUrl}/users/updateMe`, formData, {
        headers: {
          Authorization: `Bearer ${token}`,
          'Content-Type': 'multipart/form-data',
        },
      });
      toast.success('Profile updated');
      setUser(res.data.data.user);
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to update profile');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      await axios.patch(
        `${backendUrl}/users/updateMyPassword`,
        {
          passwordCurrent: currentPassword,
          password: newPassword,
          passwordConfirm: confirmPassword,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      toast.success('Password updated');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Password update failed');
    }
  };

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        py: 8,
        px: 2,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
      }}
    >
      <Paper
        elevation={12}
        sx={{
          backgroundColor: 'rgba(255, 255, 255, 0.12)',
          borderRadius: 4,
          padding: 4,
          width: '100%',
          maxWidth: 900,
          color: '#fff',
        }}
      >
        <Typography variant="h4" fontWeight="bold" textAlign="center" mb={4}>
          Profile Settings
        </Typography>

        <Grid container spacing={4}>
          {/* Sidebar Navigation */}
         <Grid item xs={12} md={3}>
  <Stack spacing={2}>
    <Button
      variant={activeSection === 'settings' ? 'contained' : 'outlined'}
      onClick={() => setActiveSection('settings')}
      fullWidth
      sx={{
        color: activeSection === 'settings' ? '#fff' : '#aed581',
        backgroundColor: activeSection === 'settings' ? '#2e7d32' : 'transparent',
        borderColor: '#aed581',
      }}
    >
      Account Info
    </Button>
    <Button
      variant={activeSection === 'password' ? 'contained' : 'outlined'}
      onClick={() => setActiveSection('password')}
      fullWidth
      sx={{
        color: activeSection === 'password' ? '#fff' : '#aed581',
        backgroundColor: activeSection === 'password' ? '#1565c0' : 'transparent',
        borderColor: '#aed581',
      }}
    >
      Change Password
    </Button>
    <Button
      variant="outlined"
      fullWidth
      onClick={() => navigate('/my-bookings')}
      sx={{
        color: '#aed581',
        borderColor: '#aed581',
      }}
    >
      My Bookings
    </Button>

    {/* ✅ New My Reviews button */}
    <Button
      variant="outlined"
      fullWidth
      onClick={() => navigate('/my-reviews')}
      sx={{
        color: '#aed581',
        borderColor: '#aed581',
      }}
    >
      My Reviews
    </Button>
  </Stack>
</Grid>


          {/* Main Content Area */}
          <Grid item xs={12} md={9}>
            {activeSection === 'settings' && user && (
              <Box component="form" onSubmit={handleSettingsSubmit}>
                <Typography variant="h6" mb={2}>Update Account Info</Typography>
                <Stack spacing={2}>
                  <TextField
                    label="Name"
                    value={user.name}
                    onChange={(e) => setUser({ ...user, name: e.target.value })}
                    fullWidth
                    required
                    InputProps={{ style: { color: '#fff' } }}
                    InputLabelProps={{ style: { color: '#e0f2f1' } }}
                  />
                  <TextField
                    label="Email"
                    type="email"
                    value={user.email}
                    onChange={(e) => setUser({ ...user, email: e.target.value })}
                    fullWidth
                    required
                    InputProps={{ style: { color: '#fff' } }}
                    InputLabelProps={{ style: { color: '#e0f2f1' } }}
                  />
                  <Button
                    variant="outlined"
                    component="label"
                    fullWidth
                    sx={{ color: '#fff', borderColor: '#fff' }}
                  >
                    Upload Profile Photo
                    <input type="file" hidden onChange={(e) => setProfileImage(e.target.files[0])} />
                  </Button>
                  {user.photo && (
                    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
                      <Avatar
                        src={user.photo}
                        alt="Profile"
                        sx={{ width: 80, height: 80, mt: 1 }}
                      />
                    </Box>
                  )}
                  <Button
                    type="submit"
                    variant="contained"
                    fullWidth
                    sx={{
                      backgroundColor: '#2e7d32',
                      '&:hover': { backgroundColor: '#1b5e20' },
                      fontWeight: 'bold',
                    }}
                  >
                    Save Changes
                  </Button>
                </Stack>
              </Box>
            )}

            {activeSection === 'password' && (
              <Box component="form" onSubmit={handlePasswordSubmit}>
                <Typography variant="h6" mb={2}>Change Password</Typography>
                <Grid container spacing={2}>
                  <Grid item xs={12}>
                    <TextField
                      label="Current Password"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      fullWidth
                      required
                      InputProps={{ style: { color: '#fff' } }}
                      InputLabelProps={{ style: { color: '#e0f2f1' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="New Password"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      fullWidth
                      required
                      InputProps={{ style: { color: '#fff' } }}
                      InputLabelProps={{ style: { color: '#e0f2f1' } }}
                    />
                  </Grid>
                  <Grid item xs={12} sm={6}>
                    <TextField
                      label="Confirm Password"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      fullWidth
                      required
                      InputProps={{ style: { color: '#fff' } }}
                      InputLabelProps={{ style: { color: '#e0f2f1' } }}
                    />
                  </Grid>
                  <Grid item xs={12}>
                    <Button
                      type="submit"
                      variant="contained"
                      fullWidth
                      sx={{
                        backgroundColor: '#1565c0',
                        '&:hover': { backgroundColor: '#0d47a1' },
                        fontWeight: 'bold',
                      }}
                    >
                      Update Password
                    </Button>
                  </Grid>
                </Grid>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
};

export default ProfilePage;
