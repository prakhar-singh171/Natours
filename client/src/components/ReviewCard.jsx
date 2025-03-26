import React from 'react';

const ReviewCard = ({ review }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg p-6 flex flex-col items-center">
      {/* Avatar */}
      <div className="mb-4">
        <img
          className="w-16 h-16 rounded-full object-cover"
          src={`/img/users/${review.user.photo}`}
          alt={review.user.name}
        />
      </div>

      {/* User Name */}
      <h6 className="text-lg font-bold text-gray-800 mb-2">{review.user.name}</h6>

      {/* Review Text */}
      <p className="text-gray-600 italic text-center mb-4">{review.review}</p>

      {/* Star Rating */}
      <div className="flex space-x-1">
        {[1, 2, 3, 4, 5].map((star) => (
          <svg
            key={star}
            className={`w-5 h-5 ${
              review.rating >= star ? 'text-yellow-500' : 'text-gray-300'
            }`}
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 20 20"
            fill="currentColor"
          >
            <path d="M9.049 2.927a1 1 0 011.902 0l1.716 4.954 5.181.018a1 1 0 01.616 1.779l-3.993 3.067 1.491 5.062a1 1 0 01-1.516 1.089L10 14.94l-4.446 3.956a1 1 0 01-1.516-1.089l1.491-5.062-3.993-3.067a1 1 0 01.616-1.779l5.181-.018L9.049 2.927z" />
          </svg>
        ))}
      </div>
    </div>
  );
};

export default ReviewCard;
