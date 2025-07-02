
import React from 'react';
import { Routes, Route, Navigate } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { StoreFilterProvider } from './contexts/StoreFilterContext';
import MerchantLayout from './components/MerchantLayout';
import { useAuth } from './hooks/useAuth';

// Import pages
import Dashboard from './pages/Dashboard';
import Stores from './pages/Stores';
import Products from './pages/Products';
import Orders from './pages/Orders';
import Analytics from './pages/Analytics';
import Marketing from './pages/Marketing';
import Reviews from './pages/Reviews';
import Settings from './pages/Settings';
import Support from './pages/Support';
import Integrations from './pages/Integrations';
import UserManagement from './pages/UserManagement';
import StorePreview from './pages/StorePreview';
import MerchantAuth from './pages/MerchantAuth';

// Create a query client for React Query
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      retry: 1,
      refetchOnWindowFocus: false,
    },
  },
});

const MerchantApp: React.FC = () => {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  if (!user) {
    // Redirect unauthenticated users to merchant auth page
    return <MerchantAuth />;
  }

  const profile = {
    id: user.id,
    name: user.user_metadata?.name || user.email,
    email: user.email,
    role: 'merchant'
  };

  return (
    <QueryClientProvider client={queryClient}>
      <StoreFilterProvider>
        <Routes>
          {/* Store Preview - standalone page without merchant layout */}
          <Route path="/store-preview/:storeId" element={<StorePreview />} />
          
          {/* All other routes with merchant layout */}
          <Route path="/*" element={
            <MerchantLayout user={user} profile={profile}>
              <Routes>
                <Route index element={<Dashboard />} />
                <Route path="stores" element={<Stores />} />
                <Route path="products" element={<Products />} />
                <Route path="orders" element={<Orders />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="marketing" element={<Marketing />} />
                <Route path="reviews" element={<Reviews />} />
                <Route path="integrations" element={<Integrations />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="settings" element={<Settings />} />
                <Route path="support" element={<Support />} />
              </Routes>
            </MerchantLayout>
          } />
        </Routes>
      </StoreFilterProvider>
    </QueryClientProvider>
  );
};

export default MerchantApp;
