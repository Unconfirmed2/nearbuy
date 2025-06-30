
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import MerchantLayout from './components/MerchantLayout';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Marketing from './pages/Marketing';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import Support from './pages/Support';

interface MerchantAppProps {
  user?: User | null;
  profile?: any;
}

const MerchantApp: React.FC<MerchantAppProps> = ({ user, profile }) => {
  // Provide default mock data if not provided
  const mockUser = user || {
    id: 'debug-merchant-id',
    email: 'merchant@example.com',
    user_metadata: { role: 'store_owner' }
  } as any;

  const mockProfile = profile || {
    id: 'debug-merchant-id',
    email: 'merchant@example.com',
    name: 'Debug Merchant',
    role: 'store_owner',
    avatar_url: null
  };

  return (
    <MerchantLayout user={mockUser} profile={mockProfile}>
      <Routes>
        <Route index element={<Dashboard />} />
        <Route path="stores" element={<Stores />} />
        <Route path="products" element={<Products />} />
        <Route path="orders" element={<Orders />} />
        <Route path="analytics" element={<Analytics />} />
        <Route path="marketing" element={<Marketing />} />
        <Route path="integrations" element={<Integrations />} />
        <Route path="settings" element={<Settings />} />
        <Route path="support" element={<Support />} />
      </Routes>
    </MerchantLayout>
  );
};

export default MerchantApp;
