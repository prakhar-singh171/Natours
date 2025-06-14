import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";

const MyBookings = () => {
  const [bookings, setBookings] = useState([]);
  const [myReviews, setMyReviews] = useState([]);
  const [showReviewForm, setShowReviewForm] = useState({});
  const [rating, setRating] = useState(5);
  const [review, setReview] = useState("");
  const { backendUrl, token } = useContext(AuthContext);

  // Fetch bookings
  useEffect(() => {
    const fetchBookings = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${backendUrl}/bookings/my`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setBookings(response.data.data.data);
      } catch (error) {
        console.error("Error fetching bookings:", error);
        toast.error(error.response?.data?.message || "Error fetching bookings.");
      }
    };

    fetchBookings();
  }, [backendUrl, token]);

  // Fetch my reviews
  useEffect(() => {
    const fetchReviews = async () => {
      if (!token) return;

      try {
        const response = await axios.get(`${backendUrl}/reviews/getMyReviews`, {
          headers: { Authorization: `Bearer ${token}` },
        });
        setMyReviews(response.data.data.reviews);
      } catch (error) {
        console.error("Error fetching reviews:", error);
        toast.error(error.response?.data?.message || "Error fetching reviews.");
      }
    };

    fetchReviews();
  }, [backendUrl, token]);

  // Helper function to check if review already exists for a tour
  const hasReviewed = (tourId) => {
    return myReviews?.some((review) => {
      const reviewedTourId = review.tour?._id || review.tour;
      return reviewedTourId === tourId;
    });
  };

  // Submit review
  const submitReview = async (tourId, bookingId) => {
    try {
      await axios.post(
        `${backendUrl}/reviews`,
        {
          tour: tourId,
          rating,
          review,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Review submitted!");
      setShowReviewForm((prev) => ({ ...prev, [bookingId]: false }));
      setRating(5);
      setReview("");
      // Refresh reviews after submit
      const response = await axios.get(`${backendUrl}/reviews/getMyReviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setMyReviews(response.data.data.reviews);
    } catch (error) {
      console.error("Error submitting review:", error);
      toast.error(error.response?.data?.message || "Error submitting review.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
        My Bookings
      </h1>

      {bookings.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {bookings.map((booking) => {
            const tourId = booking.tour?._id || booking.tour;
            const reviewed = hasReviewed(tourId);

            return (
              <div
                key={booking._id}
                className="bg-white/90 backdrop-blur-md border rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-[1.02]"
              >
                {booking.tour.imageCover && (
                  <img
                    src={`/img/tours/${booking.tour.imageCover}`}
                    alt={booking.tour.name}
                    className="w-full h-48 object-cover"
                  />
                )}

                <div className="p-4 space-y-2">
                  <h2 className="text-lg font-semibold text-gray-800">{booking.tour.name}</h2>
                  <p className="text-gray-700">
                    <span className="font-medium">Date:</span>{" "}
                    {new Date(booking.createdAt).toLocaleDateString()}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Price:</span> ${booking.price}
                  </p>
                  <p className="text-gray-700">
                    <span className="font-medium">Status:</span>{" "}
                    <span className={`px-3 py-1 rounded-full text-sm font-semibold text-white ${
                      booking.paid ? "bg-green-500" : "bg-red-500"
                    }`}>
                      {booking.paid ? "Paid" : "Unpaid"}
                    </span>
                  </p>

                  {/* Review section */}
                  {reviewed ? (
                    <p className="mt-3 text-green-600 font-semibold">Already Reviewed</p>
                  ) : (
                    <>
                      <button
                        className="mt-3 bg-blue-500 text-white py-1 px-4 rounded hover:bg-blue-600"
                        onClick={() =>
                          setShowReviewForm((prev) => ({ ...prev, [booking._id]: true }))
                        }
                      >
                        Add Review
                      </button>

                      {showReviewForm[booking._id] && (
                        <div className="mt-4 space-y-2">
                          <label className="block text-sm font-medium">
                            Rating:
                            <select
                              className="ml-2 border rounded"
                              value={rating}
                              onChange={(e) => setRating(e.target.value)}
                            >
                              {[5, 4, 3, 2, 1].map((val) => (
                                <option key={val} value={val}>{val}</option>
                              ))}
                            </select>
                          </label>

                          <textarea
                            className="w-full border rounded p-2"
                            placeholder="Write your review..."
                            value={review}
                            onChange={(e) => setReview(e.target.value)}
                          />
                          <button
                            className="bg-green-500 text-white py-1 px-4 rounded hover:bg-green-600"
                            onClick={() => submitReview(tourId, booking._id)}
                          >
                            Submit Review
                          </button>
                          <button
                            className="ml-2 bg-gray-400 text-white py-1 px-4 rounded hover:bg-gray-500"
                            onClick={() =>
                              setShowReviewForm((prev) => ({ ...prev, [booking._id]: false }))
                            }
                          >
                            Cancel
                          </button>
                        </div>
                      )}
                    </>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-center text-white">No bookings found.</p>
      )}
    </div>
  );
};

export default MyBookings;
