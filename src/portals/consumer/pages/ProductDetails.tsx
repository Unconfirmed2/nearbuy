
import React from 'react';
import { useParams } from 'react-router-dom';

const ProductDetails: React.FC = () => {
  const { id } = useParams();

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Product Details</h1>
      <p className="text-gray-600">Product ID: {id}</p>
      <p className="text-gray-600 mt-2">
        Product details page will be implemented here.
      </p>
    </div>
  );
};

export default ProductDetails;
