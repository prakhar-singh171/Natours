import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const { backendUrl, token } = useContext(AuthContext);

  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${backendUrl}/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        console.log(response.data);
        setBookings(response.data.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
      toast.error(error.response?.data?.message || 'error displaying bookings of the user');
      }
    };

    fetchBookings();
  }, [backendUrl, token]);

  return (
    <div className="p-6">
      <h1 className="text-2xl font-semibold mb-6 text-center">My Bookings</h1>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => (
            <div
              key={booking._id}
              className="border rounded-lg shadow-lg bg-white p-4"
            >
              {/* Tour Image (Using given structure) */}
              {console.log(booking.tour)}
              {booking.tour.imageCover && (
                <img
                  src={`/img/tours/${booking.tour.imageCover}`}
                  alt={booking.tour.name}
                  className="w-full h-48 object-cover rounded-md"
                />
              )}

              <div className="mt-4">
                <h2 className="text-lg font-bold">{booking.tour.name}</h2>
                <p className="text-gray-600">
                  <span className="font-semibold">Date:</span>{" "}
                  {new Date(booking.createdAt).toLocaleDateString()}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Price:</span> ${booking.price}
                </p>
                <p className="text-gray-600">
                  <span className="font-semibold">Status:</span>{" "}
                  <span
                    className={`px-2 py-1 rounded-full text-white text-sm ${
                      booking.paid ? "bg-green-500" : "bg-red-500"
                    }`}
                  >
                    {booking.paid ? "Paid" : "Unpaid"}
                  </span>
                </p>
              </div>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-center text-gray-600">No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookings;
