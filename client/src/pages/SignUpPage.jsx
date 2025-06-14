import React, { useState, useContext } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { toast } from "react-toastify";
import { TextField, Button, Typography, Box } from '@mui/material';

const SignupPage = () => {
  const { backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    confirmPassword: '',
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (formData.password !== formData.confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await axios.post(`${backendUrl}/users/signup`, {
        name: formData.name,
        email: formData.email,
        password: formData.password,
        passwordConfirm: formData.confirmPassword
      });

      if (res.data.status === 'success') {
        toast.success('Signup successful. Please login!');
        navigate('/login');
      }
    } catch (err) {
      toast.error(err.response?.data?.message || 'Signup failed');
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
          Sign Up
        </Typography>

        <form onSubmit={handleSubmit}>
          <TextField
            label="Full Name"
            name="name"
            value={formData.name}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            InputLabelProps={{ style: { color: '#e0f2f1' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            label="Email address"
            type="email"
            name="email"
            value={formData.email}
            onChange={handleChange}
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
            name="password"
            value={formData.password}
            onChange={handleChange}
            fullWidth
            margin="normal"
            required
            variant="outlined"
            InputLabelProps={{ style: { color: '#e0f2f1' } }}
            InputProps={{ style: { color: '#fff' } }}
          />

          <TextField
            label="Confirm Password"
            type="password"
            name="confirmPassword"
            value={formData.confirmPassword}
            onChange={handleChange}
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
            SIGN UP
          </Button>
        </form>

        <Box mt={3} textAlign="center">
          <Typography variant="body2" sx={{ color: '#c8e6c9' }}>
            Already have an account?{' '}
            <Link to="/login" style={{ color: '#a5d6a7', textDecoration: 'none' }}>
              Login here
            </Link>
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SignupPage;
