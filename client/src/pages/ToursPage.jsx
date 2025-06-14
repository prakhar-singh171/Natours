import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";
import { Box, Typography, Button, Grid } from '@mui/material';

const ToursPage = () => {
  const [tours, setTours] = useState([]);
  const { backendUrl } = useContext(AuthContext);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTours = async () => {
      try {
        const response = await axios.get(`${backendUrl}/tours`, {
          withCredentials: true,
        });
        setTours(response.data.data.data); // Adjust according to your API response
      } catch (error) {
        toast.error('Error fetching tours');
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, [backendUrl]);

  return (
    <Box
      sx={{
        minHeight: '100vh',
        backgroundImage: "url('/bg.jpg')",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        backgroundRepeat: 'no-repeat',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'flex-start',
        py: 8,
        px: 2,
      }}
    >
      <Box
        sx={{
          width: '100%',
          maxWidth: 1200,
          backdropFilter: 'blur(12px)',
          backgroundColor: 'rgba(255, 255, 255, 0.1)',
          borderRadius: 4,
          boxShadow: '0 0 20px rgba(0,0,0,0.3)',
          color: '#fff',
          px: 4,
          py: 6,
        }}
      >
        <Typography
          variant="h4"
          fontWeight="bold"
          mb={6}
          textAlign="center"
          sx={{ textShadow: '0 0 8px rgba(0,0,0,0.7)' }}
        >
          Explore Our Tours
        </Typography>

        <Grid container spacing={4}>
          {tours.map((tour) => (
            <Grid item xs={12} sm={6} md={4} key={tour.id}>
              <Box
                sx={{
                  borderRadius: 3,
                  overflow: 'hidden',
                  boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
                  backgroundColor: 'rgba(255, 255, 255, 0.15)',
                  display: 'flex',
                  flexDirection: 'column',
                  height: 420,   // fixed height for uniformity
                  transition: 'transform 0.3s ease',
                  '&:hover': {
                    transform: 'scale(1.05)',
                  },
                }}
              >
                {/* Image */}
                <Box
                  sx={{
                    height: 200, // fixed image height
                    backgroundImage: `url(/img/tours/${tour.imageCover})`,
                    backgroundSize: 'cover',
                    backgroundPosition: 'center',
                    position: 'relative',
                    flexShrink: 0,
                  }}
                >
                  <Box
                    sx={{
                      position: 'absolute',
                      inset: 0,
                      backgroundColor: 'rgba(0, 0, 0, 0.4)',
                    }}
                  />
                </Box>

                {/* Content */}
                <Box sx={{ p: 3, flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
                  <Typography
                    variant="h6"
                    fontWeight="600"
                    mb={1}
                    sx={{
                      color: '#dcedc8',
                      whiteSpace: 'nowrap',
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                    }}
                    title={tour.name} // show full on hover
                  >
                    {tour.name}
                  </Typography>

                  <Typography
                    variant="body2"
                    sx={{
                      flexGrow: 1,
                      color: 'rgba(255,255,255,0.8)',
                      mb: 2,
                      overflow: 'hidden',
                      textOverflow: 'ellipsis',
                      display: '-webkit-box',
                      WebkitLineClamp: 4, // max 4 lines
                      WebkitBoxOrient: 'vertical',
                    }}
                    title={tour.summary} // full on hover
                  >
                    {tour.summary}
                  </Typography>

                  {/* Location & Date */}
                  <Box
                    sx={{
                      display: 'flex',
                      justifyContent: 'space-between',
                      fontSize: '0.85rem',
                      color: '#aed581',
                      mb: 3,
                    }}
                  >
                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#aed581"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                        style={{ marginRight: 6 }}
                      >
                        <path d="M12 21s-6-4.35-6-10a6 6 0 1112 0c0 5.65-6 10-6 10z" />
                        <circle cx="12" cy="11" r="2" />
                      </svg>
                      {tour.startLocation.description}
                    </Box>

                    <Box sx={{ display: 'flex', alignItems: 'center' }}>
                      <svg
                        width="16"
                        height="16"
                        fill="none"
                        stroke="#aed581"
                        strokeWidth="2"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        viewBox="0 0 24 24"
                        style={{ marginRight: 6 }}
                      >
                        <path d="M8 7V3h8v4" />
                        <rect width="12" height="14" x="6" y="7" rx="2" ry="2" />
                      </svg>
                      {new Date(tour.startDates[0]).toLocaleString('en-US', {
                        month: 'long',
                        year: 'numeric',
                      })}
                    </Box>
                  </Box>

                  {/* Price & Button */}
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <Typography sx={{ fontWeight: 'bold', fontSize: '1.2rem', color: '#aed581' }}>
                      ${tour.price}
                      <Typography component="span" sx={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.7)', ml: 0.5 }}>
                        per person
                      </Typography>
                    </Typography>

                    <Button
                      variant="contained"
                      sx={{
                        backgroundColor: '#2e7d32',
                        '&:hover': { backgroundColor: '#1b5e20' },
                        textTransform: 'none',
                        fontWeight: 'bold',
                        px: 3,
                        py: 1,
                      }}
                      onClick={() => navigate(`/tour/${tour.slug}`)}
                    >
                      View Details
                    </Button>
                  </Box>
                </Box>
              </Box>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default ToursPage;
