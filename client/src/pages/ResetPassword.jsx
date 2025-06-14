import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { toast } from "react-toastify";
import { TextField, Button, Typography, Box } from '@mui/material';

const ResetPasswordPage = () => {
  const { token } = useParams();
  const navigate = useNavigate();
  const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (password !== confirmPassword) {
      toast.error('Passwords do not match. Please try again.');
      return;
    }

    setLoading(true);
    try {
      const response = await axios.patch(
        `${backendUrl}/users/resetPassword/${token}`,
        { password, passwordConfirm: confirmPassword },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.status === 'success') {
        toast.success('Password reset successful! You can now log in.');
        navigate('/login');
      } else {
        toast.error('Failed to reset password. Please try again.');
      }
    } catch (error) {
      console.error('Reset password error:', error.response?.data || error.message);
      toast.error(error.response?.data?.message || 'Failed to reset password.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Box
      display="flex"
      alignItems="center"
      justifyContent="center"
      minHeight="100vh"
      sx={{
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        px: 2,
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(14px)',
          backgroundColor: 'rgba(255, 255, 255, 0.08)',
          padding: 4,
          borderRadius: 4,
          width: { xs: '100%', sm: 400 },
          maxWidth: '100%',
          boxShadow: '0 8px 30px rgba(0, 0, 0, 0.35)',
          color: '#fff',
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3} textAlign="center">
          Reset Password
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="New Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            autoComplete="new-password"
            InputLabelProps={{ style: { color: '#b2dfdb' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            label="Confirm New Password"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            autoComplete="new-password"
            InputLabelProps={{ style: { color: '#b2dfdb' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <Button
            type="submit"
            variant="contained"
            fullWidth
            disabled={loading}
            sx={{
              mt: 3,
              backgroundColor: '#2e7d32',
              fontWeight: 'bold',
              borderRadius: '8px',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            {loading ? 'Resetting...' : 'Reset Password'}
          </Button>
        </form>
      </Box>
    </Box>
  );
};

export default ResetPasswordPage;
