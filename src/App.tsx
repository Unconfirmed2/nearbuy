import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

// Auth components
import AuthLayout from './components/auth/AuthLayout';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ConsumerSignUp from './pages/auth/ConsumerSignUp';
import MerchantSignUp from './pages/auth/MerchantSignUp';

// Consumer pages - now at root level
import Home from './portals/consumer/pages/Home';
import ProductSearch from './portals/consumer/pages/ProductSearch';
import ProductDetails from './portals/consumer/pages/ProductDetails';
import Cart from './portals/consumer/pages/Cart';
import Profile from './portals/consumer/pages/Profile';
import OrderHistory from './portals/consumer/pages/OrderHistory';
import Favorites from './portals/consumer/pages/Favorites';
import Auth from './portals/consumer/pages/Auth';
import ForgotPassword from './portals/consumer/pages/ForgotPassword';
import Addresses from './portals/consumer/pages/Addresses';
import PaymentMethods from './portals/consumer/pages/PaymentMethods';
import RoutePlanner from './portals/consumer/pages/RoutePlanner';
import Support from './portals/consumer/pages/Support';
import Checkout from './portals/consumer/pages/Checkout';
import OrderConfirmation from './portals/consumer/pages/OrderConfirmation';

// Portal components
import MerchantApp from './portals/merchant/MerchantApp';
import AdminApp from './portals/admin/AdminApp';

// Layout
import ConsumerLayout from './portals/consumer/components/ConsumerLayout';
import MerchantLayout from './portals/merchant/components/MerchantLayout';
import { useAuth } from './portals/consumer/hooks/useAuth';

// Types
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'customer' | 'store_owner' | 'admin' | 'moderator';
  avatar_url: string | null;
}

// Merchant Preview Component - shows consumer UI with merchant navigation
const MerchantPreview = ({ user, profile, children }: { user: any, profile: any, children: React.ReactNode }) => {
  return (
    <MerchantLayout user={user} profile={profile}>
      <div className="space-y-4">
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            <span className="text-sm font-medium text-blue-800">Merchant Preview Mode</span>
          </div>
          <p className="text-sm text-blue-600 mt-1">
            You're viewing the customer experience. Cart actions are disabled for merchants.
          </p>
        </div>
        {children}
      </div>
    </MerchantLayout>
  );
};

// Root redirect component to handle merchant users
const RootRedirect = ({ user, profile }: { user: any, profile: any }) => {
  const [userProfile, setUserProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUserProfile = async () => {
      if (!user) {
        setLoading(false);
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
        }
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchUserProfile();
  }, [user]);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // If user is a merchant, show merchant preview mode
  if (userProfile && userProfile.role === 'merchant') {
    const merchantProfile = {
      id: user.id,
      name: userProfile.name || user.user_metadata?.name,
      email: userProfile.email || user.email,
      role: userProfile.role,
      avatar_url: userProfile.avatar_url
    };

    return (
      <MerchantPreview user={user} profile={merchantProfile}>
        <Home isMerchantPreview={true} />
      </MerchantPreview>
    );
  }

  // Otherwise, show consumer home page
  return (
    <ConsumerLayout user={user} profile={profile}>
      <Home />
    </ConsumerLayout>
  );
};

export default function App() {
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
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="signup/consumer" element={<ConsumerSignUp />} />
            <Route path="signup/merchant" element={<MerchantSignUp />} />
          </Route>

          {/* Root route with merchant detection */}
          <Route path="/" element={<RootRedirect user={user} profile={profile} />} />

          {/* Consumer routes */}
          <Route path="/search" element={
            <ConsumerLayout user={user} profile={profile}>
              <ProductSearch />
            </ConsumerLayout>
          } />
          <Route path="/product/:id" element={
            <ConsumerLayout user={user} profile={profile}>
              <ProductDetails />
            </ConsumerLayout>
          } />
          <Route path="/cart" element={
            <ConsumerLayout user={user} profile={profile}>
              <Cart />
            </ConsumerLayout>
          } />
          <Route path="/route-planner" element={
            <ConsumerLayout user={user} profile={profile}>
              <RoutePlanner />
            </ConsumerLayout>
          } />
          <Route path="/favorites" element={
            <ConsumerLayout user={user} profile={profile}>
              <Favorites />
            </ConsumerLayout>
          } />
          <Route path="/support" element={
            <ConsumerLayout user={user} profile={profile}>
              <Support />
            </ConsumerLayout>
          } />
          <Route path="/auth-consumer" element={
            <ConsumerLayout user={user} profile={profile}>
              <Auth />
            </ConsumerLayout>
          } />
          <Route path="/auth/forgot-password" element={
            <ConsumerLayout user={user} profile={profile}>
              <ForgotPassword />
            </ConsumerLayout>
          } />
          
          {/* Protected routes - require authentication */}
          <Route path="/profile" element={
            <ConsumerLayout user={user} profile={profile}>
              {user ? <Profile user={user} profile={profile} /> : <Navigate to="/auth-consumer" replace />}
            </ConsumerLayout>
          } />
          <Route path="/addresses" element={
            <ConsumerLayout user={user} profile={profile}>
              {user ? <Addresses /> : <Navigate to="/auth-consumer" replace />}
            </ConsumerLayout>
          } />
          <Route path="/payment-methods" element={
            <ConsumerLayout user={user} profile={profile}>
              {user ? <PaymentMethods /> : <Navigate to="/auth-consumer" replace />}
            </ConsumerLayout>
          } />
          <Route path="/orders" element={
            <ConsumerLayout user={user} profile={profile}>
              {user ? <OrderHistory /> : <Navigate to="/auth-consumer" replace />}
            </ConsumerLayout>
          } />
          <Route path="/checkout" element={
            <ConsumerLayout user={user} profile={profile}>
              {user ? <Checkout /> : <Navigate to="/auth-consumer" replace />}
            </ConsumerLayout>
          } />
          <Route path="/order-confirmation" element={
            <ConsumerLayout user={user} profile={profile}>
              {user ? <OrderConfirmation /> : <Navigate to="/auth-consumer" replace />}
            </ConsumerLayout>
          } />

          {/* Portal routes */}
          <Route path="/merchant/*" element={<MerchantApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
