
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import MerchantLayout from './components/MerchantLayout';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';

interface MerchantAppProps {
  user: User;
  profile: any;
}

const MerchantApp: React.FC<MerchantAppProps> = ({ user, profile }) => {
  return (
    <MerchantLayout user={user} profile={profile}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="stores" element={<Stores />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
      </Routes>
    </MerchantLayout>
  );
};

export default MerchantApp;
