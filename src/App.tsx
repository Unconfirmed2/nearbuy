
import React, { useEffect, useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { User } from '@supabase/supabase-js';
import { Toaster } from '@/components/ui/sonner';

// Auth components
import AuthLayout from './components/auth/AuthLayout';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';

// Portal components
import ConsumerApp from './portals/consumer/ConsumerApp';
import MerchantApp from './portals/merchant/MerchantApp';
import AdminApp from './portals/admin/AdminApp';

// Loading component
import LoadingSpinner from './components/LoadingSpinner';

// Types
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'customer' | 'store_owner' | 'admin' | 'moderator';
  avatar_url: string | null;
}

export default function App() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Get initial session
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (session?.user) {
        fetchUserProfile(session.user.id);
      } else {
        setLoading(false);
      }
    });

    // Listen for auth changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null);
        if (session?.user) {
          await fetchUserProfile(session.user.id);
        } else {
          setProfile(null);
          setLoading(false);
        }
      }
    );

    return () => subscription.unsubscribe();
  }, []);

  const fetchUserProfile = async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single();

      if (error) throw error;
      setProfile(data);
    } catch (error) {
      console.error('Error fetching profile:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Route user to appropriate portal based on role
  const getPortalRoute = (userProfile: UserProfile) => {
    switch (userProfile.role) {
      case 'admin':
      case 'moderator':
        return '/admin/*';
      case 'store_owner':
        return '/merchant/*';
      case 'customer':
      default:
        return '/consumer/*';
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Public routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
          </Route>

          {/* Protected routes */}
          {user && profile ? (
            <>
              <Route path="/consumer/*" element={<ConsumerApp user={user} profile={profile} />} />
              <Route path="/merchant/*" element={<MerchantApp user={user} profile={profile} />} />
              <Route path="/admin/*" element={<AdminApp user={user} profile={profile} />} />
              
              {/* Default redirect based on user role */}
              <Route path="/" element={<Navigate to={getPortalRoute(profile).replace('/*', '')} replace />} />
            </>
          ) : (
            <>
              {/* Redirect unauthenticated users to sign in */}
              <Route path="*" element={<Navigate to="/auth/signin" replace />} />
            </>
          )}
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
}
