
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import AdminLayout from './components/AdminLayout';
import Dashboard from './pages/Dashboard';
import Users from './pages/Users';
import Stores from './pages/Stores';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';

interface AdminAppProps {
  user?: User;
  profile?: any;
}

const AdminApp: React.FC<AdminAppProps> = ({ user, profile }) => {
  // For now, we'll show a login prompt if no user is provided
  // Later this can be replaced with proper authentication
  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Admin Portal</h1>
          <p className="text-gray-600 mb-4">
            Please sign in to access the admin portal.
          </p>
          <a 
            href="/auth/signin" 
            className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
          >
            Sign In
          </a>
        </div>
      </div>
    );
  }

  // Check if user has admin role
  if (profile?.role !== 'admin' && profile?.role !== 'moderator') {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-gray-600 mt-2">
            You don't have permission to access the admin portal.
          </p>
        </div>
      </div>
    );
  }

  return (
    <AdminLayout user={user} profile={profile}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="users" element={<Users />} />
        <Route path="stores" element={<Stores />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
      </Routes>
    </AdminLayout>
  );
};

export default AdminApp;
