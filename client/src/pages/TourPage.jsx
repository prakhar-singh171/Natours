import React, { useEffect, useState, useContext } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import ReviewCard from '../components/ReviewCard';
import { displayMap } from '../utils/mapUtils'; // Assuming you placed displayMap in a utils folder
import 'leaflet/dist/leaflet.css'; // Import Leaflet CSS
import { loadStripe } from '@stripe/stripe-js';
import { Elements } from '@stripe/react-stripe-js';
import { toast } from "react-toastify";
import OverviewBox from '../components/OveriewBox';


const stripePromise = loadStripe('pk_test_51QXzqYG2bh3UxEZ2gdS2YzmP9FAWjE1RAOjZ9jjpJt72cpWRUIiBUgpnOqlHbcFvgmFP3EFnX7SlrWzmM2mWO3z500BZCiPzBs'); // Replace with your Stripe publishable key



const handlePayment = async (backendUrl,tour,token) => {
  console.log(backendUrl,'dfdf',tour,'dfdf',token)
  try {
    

    // Get checkout session from the server
    const url=`${backendUrl}/bookings/checkout-session/${tour.id}`;
    console.log('fsdfd',url);
    const response = await axios.get(
      `${backendUrl}/bookings/checkout-session/${tour.id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`, // Include the token in the Authorization header
        },
      }
    );
        console.log(response);
    const { session } = response.data;
    // await stripe.redirectToCheckout({
    //   sessionId: session.data.session.id
    // });
    // Redirect to Stripe Checkout
    const stripe = await stripePromise;
    await stripe.redirectToCheckout({ sessionId: session.id });
  } catch (error) {
    console.error('Error initiating payment:', error);
    const msg=error.response?.data?.message || 'payment initiation failed.please try again'
    toast.error(msg);
  }
};

const TourPage = () => {
  const { slug } = useParams();
  const [tour, setTour] = useState(null);
  const { backendUrl,token } = useContext(AuthContext);

  useEffect(() => {
    const fetchTour = async () => {
      try {
        const response = await axios.get(`${backendUrl}/tours/${slug}`,{
          withCredentials:true,
        });
        console.log(response.data.data.tour);
        setTour(response.data.data.tour);
      } catch (error) {
        console.error('Error fetching tour details:', error);
      }
    };

    fetchTour();
  }, [slug, backendUrl]);

  useEffect(() => {
    if (tour && tour.locations) {
      displayMap(tour.locations);
    }
  }, [tour]);

  if (!tour) {
    return <div className="text-center text-gray-700 mt-10">Loading...</div>;
  }

  const formattedDate = new Date(tour.startDates[0]).toLocaleString('en-us', {
    month: 'long',
    year: 'numeric',
  });

  return ( 
    <main className="bg-gray-50">
      {/* Hero Section */}

      <section className="relative">
  {/* Background Image */}

  {/* Overlay Container */}
  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center">
    <h1 className="text-white text-4xl font-bold">{tour.name} Tour</h1>
  </div>

  {/* Second Image */}
  <img src={`/img/tours/${tour.imageCover}`} alt={tour.name} className="relative w-full h-96 object-cover mt-4" />
</section>


      {/* Overview Section */}
      <section className="container mx-auto px-4 py-10">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Quick Facts */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Quick Facts</h2>
            <OverviewBox label="Next Date" text={formattedDate} icon="calendar" />
            <OverviewBox label="Difficulty" text={tour.difficulty} icon="trending-up" />
            <OverviewBox label="Participants" text={`${tour.maxGroupSize} people`} icon="user" />
            <OverviewBox label="Rating" text={`${tour.ratingsAverage}/5`} icon="star" />
          </div>

          {/* Guides */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Your Tour Guides</h2>
            {tour.guides && tour.guides.map((guide) => (
              <div key={guide.name} className="flex items-center space-x-4 mb-4">
                <img
                  src={`/img/users/${guide.photo}`}
                  alt={guide.name}
                  className="w-12 h-12 rounded-full object-cover"
                />
                <div>
                  <span className="block font-bold text-gray-700">{guide.name}</span>
                  <span className="text-gray-600">
                    {guide.role === 'lead-guide' ? 'Lead Guide' : 'Tour Guide'}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Map</h2>
        <div id="map" className="w-full h-96 bg-gray-200 rounded-lg"></div>
      </section>


      {/* Description Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">About {tour.name} Tour</h2>
        {tour.description && tour.description.split('\n').map((paragraph, index) => (
          <p key={index} className="text-gray-700 mb-4">
            {paragraph}
          </p>
        ))}
      </section>

      {/* Tour Pictures */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Tour Pictures</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {tour.images && tour.images.map((img, index) => (
            <img
              key={index}
              src={`/img/tours/${img}`}
              alt={`Tour Image ${index + 1}`}
              className="w-full h-64 object-cover rounded-lg"
            />
          ))}
        </div>
      </section>

      {/* Reviews Section */}
      <section className="container mx-auto px-4 py-10">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Reviews</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {tour.reviews && tour.reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-green-600 text-white py-10">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div>
            <h2 className="text-3xl font-bold mb-4">What are you waiting for?</h2>
            <p className="text-lg">
              {`${tour.duration} days. 1 adventure. Infinite memories. Make it yours today!`}
            </p>
          </div>
          <button
  onClick={() => handlePayment(backendUrl,tour,token)} // Use an arrow function to pass arguments
  className="bg-white text-green-600 px-6 py-3 rounded-lg shadow-lg hover:bg-gray-100 cursor-pointer"
>
  Book Tour Now!
</button>
        </div>
      </section>
    </main>
  );
};

export default TourPage;
