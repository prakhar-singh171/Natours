import { useContext, useEffect, useState } from "react";
import axios from "axios";
import AuthContext from "../context/AuthContext";
import { toast } from "react-toastify";
import ReviewCard from "../components/ReviewCard";
import StarRating from "../components/StarRating";

const MyReviews = () => {
  const { backendUrl, token } = useContext(AuthContext);
  const [reviews, setReviews] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingReview, setEditingReview] = useState(null);
  const [newReviewText, setNewReviewText] = useState("");
  const [newRating, setNewRating] = useState(5);

  const fetchReviews = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${backendUrl}/reviews/getMyReviews`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      console.log(response);
      setReviews(response.data.data.reviews);
    } catch (error) {
      console.error("Error fetching reviews:", error);
      toast.error(error.response?.data?.message || "Error fetching reviews.");
    }
    setLoading(false);
  };

  useEffect(() => {
    if (!token) return;
    fetchReviews();
  }, [token]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this review?")) return;
    try {
      await axios.delete(`${backendUrl}/reviews/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Review deleted successfully");
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error deleting review.");
    }
  };

  const handleEdit = (review) => {
    setEditingReview(review);
    setNewReviewText(review.review);
    setNewRating(review.rating);
  };

  const handleUpdate = async () => {
    try {
      await axios.patch(
        `${backendUrl}/reviews/${editingReview._id}`,
        { review: newReviewText, rating: newRating },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      toast.success("Review updated successfully");
      setEditingReview(null);
      fetchReviews();
    } catch (error) {
      toast.error(error.response?.data?.message || "Error updating review.");
    }
  };

  return (
    <div
      className="min-h-screen bg-cover bg-center bg-no-repeat p-6"
      style={{ backgroundImage: "url('/bg.jpg')" }}
    >
      <h1 className="text-3xl font-bold mb-6 text-center text-white drop-shadow-lg">
        My Reviews
      </h1>

      {loading ? (
        <p className="text-white text-center">Loading...</p>
) : (reviews?.length || 0) > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reviews.map((review) => (
            <ReviewCard
              key={review._id}
              review={review}
              onDelete={handleDelete}
              onEdit={handleEdit}
            />
          ))}
        </div>
      ) : (
        <p className="text-center text-white">No reviews found.</p>
      )}

      {/* Edit Modal */}
      {editingReview && (
        <div className="fixed inset-0 bg-black/60 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-lg w-full max-w-md">
            <h2 className="text-2xl font-bold mb-4">Edit Review</h2>
            <textarea
              className="w-full border p-2 rounded mb-4"
              rows="4"
              value={newReviewText}
              onChange={(e) => setNewReviewText(e.target.value)}
            />
            <StarRating rating={newRating} setRating={setNewRating} />
            <div className="mt-4 flex justify-end gap-2">
              <button
                onClick={() => setEditingReview(null)}
                className="px-4 py-2 bg-gray-400 text-white rounded"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="px-4 py-2 bg-blue-500 text-white rounded"
              >
                Update
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default MyReviews;
