
import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, Navigate, useSearchParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import { supabase } from '@/integrations/supabase/client';

// Consumer pages - now at root level
import Home from './portals/consumer/pages/Home';
import ProductSearch from './portals/consumer/pages/ProductSearch';
import ProductDetails from './portals/consumer/pages/ProductDetails';
import StoreProducts from './portals/consumer/pages/StoreProducts';
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
import MerchantNavbar from './components/navigation/MerchantNavbar';
import { useAuth } from './portals/consumer/hooks/useAuth';

// Types
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'customer' | 'store_owner' | 'admin' | 'moderator';
  avatar_url: string | null;
}

// Root component that handles merchant vs consumer routing
const RootHandler = ({ user, profile }: { user: any, profile: any }) => {
  const [searchParams] = useSearchParams();
  const isMerchantView = searchParams.get('merchant') === 'true';
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

  // Check if user is a merchant and they're not in merchant view, redirect to merchant portal
  if (userProfile && (userProfile.role === 'merchant' || userProfile.user_role === 'merchant' || userProfile.user_role === 'super_merchant' || userProfile.user_role === 'store_user') && !isMerchantView) {
    return <Navigate to="/merchant" replace />;
  }

  // If merchant parameter is present and user is authenticated merchant, show merchant navbar
  if (isMerchantView && user && userProfile && (userProfile.role === 'merchant' || userProfile.user_role === 'merchant' || userProfile.user_role === 'super_merchant' || userProfile.user_role === 'store_user')) {
    return (
      <div className="min-h-screen bg-gray-50">
        <MerchantNavbar />
        <Home />
      </div>
    );
  }

  // For consumers or guests, show the consumer home page
  return (
    <ConsumerLayout user={user} profile={profile}>
      <Home />
    </ConsumerLayout>
  );
};

// Routes component that has access to search params
const AppRoutes = () => {
  const { user, loading } = useAuth();
  const [searchParams] = useSearchParams();
  const isMerchantView = searchParams.get('merchant') === 'true';
  
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
    <div className="min-h-screen bg-gray-50">
      <Routes>
        {/* Root route - handles merchant vs consumer logic */}
        <Route path="/" element={<RootHandler user={user} profile={profile} />} />

        {/* Consumer routes with merchant navbar support */}
        <Route path="/search" element={
          isMerchantView && user ? (
            <div className="min-h-screen bg-gray-50">
              <MerchantNavbar />
              <ProductSearch />
            </div>
          ) : (
            <ConsumerLayout user={user} profile={profile}>
              <ProductSearch />
            </ConsumerLayout>
          )
        } />
        <Route path="/product/:id" element={
          isMerchantView && user ? (
            <div className="min-h-screen bg-gray-50">
              <MerchantNavbar />
              <ProductDetails />
            </div>
          ) : (
            <ConsumerLayout user={user} profile={profile}>
              <ProductDetails />
            </ConsumerLayout>
          )
        } />
        <Route path="/store/:storeId" element={
          <ConsumerLayout user={user} profile={profile}>
            <StoreProducts />
          </ConsumerLayout>
        } />
        <Route path="/cart" element={
          <ConsumerLayout user={user} profile={profile}>
            <Cart />
          </ConsumerLayout>
        } />
        <Route path="/route-planner" element={
          isMerchantView && user ? (
            <div className="min-h-screen bg-gray-50">
              <MerchantNavbar />
              <RoutePlanner />
            </div>
          ) : (
            <ConsumerLayout user={user} profile={profile}>
              <RoutePlanner />
            </ConsumerLayout>
          )
        } />
        <Route path="/favorites" element={
          <ConsumerLayout user={user} profile={profile}>
            <Favorites />
          </ConsumerLayout>
        } />
        <Route path="/support" element={
          isMerchantView && user ? (
            <div className="min-h-screen bg-gray-50">
              <MerchantNavbar />
              <Support />
            </div>
          ) : (
            <ConsumerLayout user={user} profile={profile}>
              <Support />
            </ConsumerLayout>
          )
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
  );
};

export default function App() {
  return (
    <BrowserRouter>
      <AppRoutes />
    </BrowserRouter>
  );
}
