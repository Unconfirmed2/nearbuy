
import React from 'react';
import { Outlet } from 'react-router-dom';

const AuthLayout: React.FC = () => {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100">
      <div className="max-w-md w-full space-y-8 p-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold text-gray-900">NearBuy</h1>
          <p className="mt-2 text-gray-600">Find products near you</p>
        </div>
        <Outlet />
      </div>
    </div>
  );
};

export default AuthLayout;
