import React from "react";

const StarRating = ({ rating, setRating }) => {
  return (
    <div className="flex space-x-1 cursor-pointer text-yellow-400 text-2xl">
      {[1, 2, 3, 4, 5].map((star) => (
        <span key={star} onClick={() => setRating(star)}>
          {star <= rating ? "★" : "☆"}
        </span>
      ))}
    </div>
  );
};

export default StarRating;
