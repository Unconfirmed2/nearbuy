
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
import RoutePlanner from './pages/RoutePlanner';
import Support from './pages/Support';
import Checkout from './pages/Checkout';
import OrderConfirmation from './pages/OrderConfirmation';
import { useAuth } from './hooks/useAuth';

interface ConsumerAppProps {
  user?: User | null;
  profile?: any;
}

const ConsumerApp: React.FC<ConsumerAppProps> = () => {
  const { user, loading } = useAuth();
  
  const profile = user ? { 
    id: user.id, 
    name: user.user_metadata?.name, 
    email: user.email,
    role: 'customer' 
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <ConsumerLayout user={user} profile={profile}>
      <Routes>
        {/* Public routes - accessible without authentication */}
        <Route path="/" element={<Home />} />
        <Route path="/search" element={<ProductSearch />} />
        <Route path="/product/:id" element={<ProductDetails />} />
        <Route path="/cart" element={<Cart />} />
        <Route path="/route-planner" element={<RoutePlanner />} />
        <Route path="/favorites" element={<Favorites />} />
        <Route path="/support" element={<Support />} />
        <Route path="/auth" element={<Auth />} />
        <Route path="/auth/forgot-password" element={<ForgotPassword />} />
        
        {/* Protected routes - require authentication */}
        <Route path="/profile" element={
          user ? <Profile user={user} profile={profile} /> : <Navigate to="/consumer/auth" replace />
        } />
        <Route path="/addresses" element={
          user ? <Addresses /> : <Navigate to="/consumer/auth" replace />
        } />
        <Route path="/payment-methods" element={
          user ? <PaymentMethods /> : <Navigate to="/consumer/auth" replace />
        } />
        <Route path="/orders" element={
          user ? <OrderHistory /> : <Navigate to="/consumer/auth" replace />
        } />
        <Route path="/checkout" element={
          user ? <Checkout /> : <Navigate to="/consumer/auth" replace />
        } />
        <Route path="/order-confirmation" element={
          user ? <OrderConfirmation /> : <Navigate to="/consumer/auth" replace />
        } />
      </Routes>
    </ConsumerLayout>
  );
};

export default ConsumerApp;
