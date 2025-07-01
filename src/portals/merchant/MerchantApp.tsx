
import React from 'react';
import { Routes, Route } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { User } from '@supabase/supabase-js';
import { useAuth } from './hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import MerchantLayout from './components/MerchantLayout';
import MerchantAuth from './pages/MerchantAuth';
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
  const [userProfile, setUserProfile] = React.useState<any>(null);
  const [profileLoading, setProfileLoading] = React.useState(true);

  // Fetch user profile from database when user is available
  React.useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setProfileLoading(false);
        return;
      }

      try {
        const { data, error } = await supabase
          .from('users')
          .select('*')
          .eq('id', user.id)
          .single();

        if (error && error.code !== 'PGRST116') {
          console.error('Error fetching user profile:', error);
        } else {
          setUserProfile(data);
          console.log('User profile from database:', data);
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setProfileLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading || profileLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If no user, show merchant auth page
  if (!user) {
    return <MerchantAuth />;
  }

  // If user exists but no profile in database, or profile role is not merchant, show auth page
  if (!userProfile || userProfile.role !== 'merchant') {
    console.log('User profile role:', userProfile?.role);
    return <MerchantAuth />;
  }

  const profile = {
    id: user.id,
    name: userProfile.name || user.user_metadata?.name,
    email: userProfile.email || user.email,
    role: userProfile.role,
    avatar_url: userProfile.avatar_url
  };

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
