import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from "react-toastify";
import { TextField, Button, Typography, Box } from '@mui/material';

const LoginPage = () => {
  const { setToken, backendUrl, fetchUserData } = useContext(AuthContext);
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isSendingReset, setIsSendingReset] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.info('Please enter your email address first.');
      return;
    }

    setIsSendingReset(true);
    try {
      const response = await axios.post(`${backendUrl}/users/forgotPassword`, { email });
      response.data.status === 'success'
        ? toast.success('Password reset link has been sent to your email.')
        : toast.error('Failed to send password reset link.');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Failed to send password reset link.');
    } finally {
      setIsSendingReset(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(`${backendUrl}/users/login`, { email, password });
      if (response.data.status === 'success') {
        setToken(response.data.token);
        fetchUserData();
        navigate('/tours');
      } else {
        toast.error('Login failed');
      }
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed');
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
      }}
    >
      <Box
        sx={{
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          padding: 4,
          borderRadius: 4,
          width: 400,
          boxShadow: '0 0 20px rgba(0, 0, 0, 0.3)',
          color: '#fff',
        }}
      >
        <Typography variant="h5" fontWeight="bold" mb={3}>
          Login
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Email address"
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            InputLabelProps={{ style: { color: '#e0f2f1' } }}
            InputProps={{ style: { color: '#fff' } }}
          />
          <TextField
            label="Password"
            type="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            InputLabelProps={{ style: { color: '#e0f2f1' } }}
            InputProps={{ style: { color: '#fff' } }}
          />
          <Button
            type="submit"
            variant="contained"
            fullWidth
            sx={{
              mt: 2,
              backgroundColor: '#2e7d32',
              fontWeight: 'bold',
              '&:hover': {
                backgroundColor: '#1b5e20',
              },
            }}
          >
            LOGIN
          </Button>
        </form>

        <Box mt={3} display="flex" justifyContent="space-between" flexWrap="wrap" alignItems="center">
          <Button
            onClick={handleForgotPassword}
            disabled={isSendingReset}
            sx={{
              textTransform: 'none',
              fontSize: '0.875rem',
              color: '#a5d6a7',
              '&:hover': { textDecoration: 'underline' },
            }}
          >
            {isSendingReset ? 'Sending...' : 'Forgot Password?'}
          </Button>
          <Typography variant="body2" sx={{ color: '#c8e6c9', mt: { xs: 1, sm: 0 } }}>
            Don’t have an account?{' '}
            <Link to="/signup" style={{ color: '#a5d6a7', textDecoration: 'none' }}>
              Sign up here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default LoginPage;
