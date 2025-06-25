
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import ConsumerLayout from './components/ConsumerLayout';
import Home from './pages/Home';
import ProductSearch from './pages/ProductSearch';
import ProductDetails from './pages/ProductDetails';
import Cart from './pages/Cart';
import Profile from './pages/Profile';
import OrderHistory from './pages/OrderHistory';
import Favorites from './pages/Favorites';

interface ConsumerAppProps {
  user: User;
  profile: any;
}

const ConsumerApp: React.FC<ConsumerAppProps> = ({ user, profile }) => {
  return (
    <ConsumerLayout user={user} profile={profile}>
      <Routes>
        <Route index element={<Home />} />
        <Route path="search" element={<ProductSearch />} />
        <Route path="product/:id" element={<ProductDetails />} />
        <Route path="cart" element={<Cart />} />
        <Route path="profile" element={<Profile user={user} profile={profile} />} />
        <Route path="orders" element={<OrderHistory />} />
        <Route path="favorites" element={<Favorites />} />
      </Routes>
    </ConsumerLayout>
  );
};

export default ConsumerApp;
