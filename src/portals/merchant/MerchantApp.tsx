
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import { useAuth } from './hooks/useAuth';
import MerchantLayout from './components/MerchantLayout';
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import Products from './pages/Products';
import Inventory from './pages/Inventory';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Marketing from './pages/Marketing';
import Settings from './pages/Settings';
import Integrations from './pages/Integrations';
import Support from './pages/Support';
import Reviews from './pages/Reviews';

interface MerchantAppProps {
  user?: User | null;
  profile?: any;
}

// Create a query client instance
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      retry: 1,
    },
  },
});

const MerchantApp: React.FC<MerchantAppProps> = () => {
  const { user, loading } = useAuth();
  
  const profile = user ? { 
    id: user.id, 
    name: user.user_metadata?.name, 
    email: user.email,
    role: user.user_metadata?.role || 'merchant' // Default to merchant for this portal
  } : null;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">You must be logged in as a merchant to access this portal.</p>
          <a href="/auth/signup/merchant" className="text-blue-600 hover:text-blue-500">
            Sign up as a merchant
          </a>
        </div>
      </div>
    );
  }

  // Check if user has merchant role from their metadata
  const userRole = user.user_metadata?.role;
  if (userRole && userRole !== 'merchant') {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Access Denied</h1>
          <p className="text-gray-600 mb-6">This portal is only accessible to merchant accounts.</p>
          <div className="space-x-4">
            <a href="/" className="text-blue-600 hover:text-blue-500">
              Go to Consumer Portal
            </a>
            <a href="/auth/signup/merchant" className="text-blue-600 hover:text-blue-500">
              Sign up as Merchant
            </a>
          </div>
        </div>
      </div>
    );
  }

  return (
    <QueryClientProvider client={queryClient}>
      <MerchantLayout user={user} profile={profile}>
        <Routes>
          <Route index element={<Dashboard />} />
          <Route path="stores" element={<Stores />} />
          <Route path="products" element={<Products />} />
          <Route path="inventory" element={<Inventory />} />
          <Route path="orders" element={<Orders />} />
          <Route path="analytics" element={<Analytics />} />
          <Route path="marketing" element={<Marketing />} />
          <Route path="integrations" element={<Integrations />} />
          <Route path="reviews" element={<Reviews />} />
          <Route path="settings" element={<Settings />} />
          <Route path="support" element={<Support />} />
        </Routes>
      </MerchantLayout>
    </QueryClientProvider>
  );
};

export default MerchantApp;
