import React from "react";

const ReviewCard = ({ review, onDelete, onEdit, editable = false }) => {
  return (
    <div className="bg-white/90 backdrop-blur-md border rounded-xl shadow-xl overflow-hidden transition-transform hover:scale-[1.02]">
      {review.tour?.imageCover && (
        <img
          src={`/img/tours/${review.tour.imageCover}`}
          alt={review.tour.name}
          className="w-full h-48 object-cover"
        />
      )}
      <div className="p-4 space-y-2">
        <h2 className="text-lg font-semibold text-gray-800">{review.tour?.name}</h2>
        <p className="text-yellow-500 text-sm">
          {"★".repeat(review.rating)}{"☆".repeat(5 - review.rating)}
        </p>
        <p className="text-gray-700">{review.review}</p>
        <p className="text-gray-500 text-sm">
          {new Date(review.createdAt).toLocaleDateString()}
        </p>

        {editable && (
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => onEdit(review)}
              className="px-4 py-1 bg-blue-500 text-white rounded"
            >
              Edit
            </button>
            <button
              onClick={() => onDelete(review._id)}
              className="px-4 py-1 bg-red-500 text-white rounded"
            >
              Delete
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default ReviewCard;
