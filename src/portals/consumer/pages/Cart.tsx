
import React from 'react';

const Cart: React.FC = () => {
  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <h1 className="text-2xl font-bold mb-4">Shopping Cart</h1>
      <p className="text-gray-600">
        Your shopping cart is empty. Start shopping to add items here.
      </p>
    </div>
  );
};

export default Cart;
