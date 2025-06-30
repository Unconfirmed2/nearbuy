
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import ConsumerLayout from './components/ConsumerLayout';
import Home from './pages/Home';
import ProductSearch from './pages/ProductSearch';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Favorites from './pages/Favorites';
import Auth from './pages/Auth';
import ForgotPassword from './pages/ForgotPassword';
import Addresses from './pages/Addresses';
import PaymentMethods from './pages/PaymentMethods';
import { useAuth } from './hooks/useAuth';

interface ConsumerAppProps {
  user?: User | null;
  profile?: any;
}

const ConsumerApp: React.FC<ConsumerAppProps> = ({ user: propUser, profile: propProfile }) => {
  const { user: authUser, loading } = useAuth();
  
  // Use authentication hook user if available, otherwise use props (for debug mode)
  const user = authUser || propUser;
  const profile = propProfile || (authUser ? { 
    id: authUser.id, 
    name: authUser.user_metadata?.name, 
    email: authUser.email,
    role: 'customer' 
  } : null);

  if (loading) {
    return <div className="min-h-screen bg-gray-50 flex items-center justify-center">Loading...</div>;
  }

  // If no user and not in debug mode, show auth
  if (!user && !propUser) {
    return (
      <Routes>
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        <Route path="*" element={<Navigate to="/auth" replace />} />
      </Routes>
    );
  }

  return (
    <ConsumerLayout user={user} profile={profile}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="search" element={<ProductSearch />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile user={user} profile={profile} />} />
        <Route path="addresses" element={<Addresses />} />
        <Route path="payment-methods" element={<PaymentMethods />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="favorites" element={<Favorites />} />
        <Route path="auth" element={<Auth />} />
        <Route path="auth/forgot-password" element={<ForgotPassword />} />
      </Routes>
    </ConsumerLayout>
  );
};

export default ConsumerApp;
