import React, { useContext, useEffect, useState } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';
import { toast } from "react-toastify";

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
        console.error('Error fetching tours:', error);
      }
    };

    fetchTours();
  }, [backendUrl]);

  return (
    <main className="bg-gradient-to-br from-blue-200 to-blue-500 p-10 min-h-screen">
      <div className="container mx-auto">
        <h1 className="text-center text-4xl text-white font-extrabold mb-10">
          Explore Our Tours
        </h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {tours.map((tour) => (
            <div
              key={tour.id}
              className="relative rounded-lg shadow-lg overflow-hidden bg-white group transition-all duration-300 transform hover:scale-105"
            >
              {/* Card Image */}
              <div className="w-full h-60 bg-cover bg-center group-hover:opacity-70"
                style={{ backgroundImage: `url(/img/tours/${tour.imageCover})` }}>
                <div className="absolute inset-0 bg-black opacity-40"></div>
              </div>

              {/* Card Content */}
              <div className="relative p-6">
                <h2 className="text-2xl font-semibold text-gray-800 mb-3">
                  {tour.name}
                </h2>
                <p className="text-gray-600 text-sm mb-4">{tour.summary}</p>

                <div className="flex flex-wrap items-center justify-between text-sm text-gray-700">
                  <div className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c1.333 0 4-1.333 4-4s-1.333-4-4-4-4 1.333-4 4 2.667 4 4 4z"
                      />
                    </svg>
                    {tour.startLocation.description}
                  </div>

                  <div className="flex items-center mb-2">
                    <svg
                      className="w-4 h-4 mr-2 text-green-500"
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M12 8c2 0 4-1.5 4-4s-2-4-4-4-4 1.5-4 4 2 4 4 4z"
                      />
                    </svg>
                    {new Date(tour.startDates[0]).toLocaleString("en-us", {
                      month: "long",
                      year: "numeric",
                    })}
                  </div>
                </div>

                <div className="mt-6 flex justify-between items-center">
                  <div className="text-xl text-green-600 font-semibold">
                    ${tour.price}
                    <span className="text-sm text-gray-500"> per person</span>
                  </div>
                  <button
                    className="bg-green-600 text-white text-sm py-2 px-4 rounded-lg hover:bg-green-700 transition-colors duration-200"
                    onClick={() => navigate(`/tour/${tour.slug}`)}
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default ToursPage;
