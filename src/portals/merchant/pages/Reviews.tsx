
import React from 'react';
import ReviewManager from '../components/ReviewManager';

const Reviews: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews & Feedback</h1>
        <p className="text-gray-600 mt-2">
          Manage customer reviews and respond to feedback
        </p>
      </div>

      <ReviewManager merchantId="debug-merchant-id" />
    </div>
  );
};

export default Reviews;
