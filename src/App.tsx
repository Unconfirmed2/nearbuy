
import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import DebugUserSwitch from '@/components/DebugUserSwitch';

// Auth components
import AuthLayout from './components/auth/AuthLayout';
import SignIn from './pages/auth/SignIn';
import SignUp from './pages/auth/SignUp';
import ConsumerSignUp from './pages/auth/ConsumerSignUp';
import MerchantSignUp from './pages/auth/MerchantSignUp';

// Public pages
import Index from './pages/Index';

// Portal components
import ConsumerApp from './portals/consumer/ConsumerApp';
import MerchantApp from './portals/merchant/MerchantApp';
import AdminApp from './portals/admin/AdminApp';

// Types
interface UserProfile {
  id: string;
  email: string;
  name: string | null;
  role: 'customer' | 'store_owner' | 'admin' | 'moderator';
  avatar_url: string | null;
}

export default function App() {
  const [debugRole, setDebugRole] = useState<'guest' | 'customer' | 'store_owner'>('store_owner');

  // Mock user and profile for debug mode
  const mockUser = debugRole !== 'guest' ? {
    id: 'debug-user-id',
    email: 'debug@example.com',
    user_metadata: { role: debugRole }
  } as any : null;

  const mockProfile = debugRole !== 'guest' ? {
    id: 'debug-user-id',
    email: 'debug@example.com',
    name: debugRole === 'customer' ? 'Debug Consumer' : 'Debug Merchant',
    role: debugRole,
    avatar_url: null
  } : null;

  // Route user to appropriate portal based on role
  const getPortalRoute = (userProfile: UserProfile) => {
    switch (userProfile.role) {
      case 'admin':
      case 'moderator':
        return '/admin';
      case 'store_owner':
        return '/merchant';
      case 'customer':
      default:
        return '/consumer';
    }
  };

  // Get dashboard route based on debug role
  const getDashboardRoute = () => {
    console.log('Dashboard route - current debug role:', debugRole);
    switch (debugRole) {
      case 'store_owner':
        console.log('Redirecting to merchant dashboard');
        return '/merchant';
      case 'customer':
        console.log('Redirecting to consumer dashboard');
        return '/consumer';
      default:
        console.log('Redirecting to main page');
        return '/';
    }
  };

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        {/* Debug Switch - Only show in development */}
        <div className="fixed top-4 right-4 z-50">
          <DebugUserSwitch 
            currentRole={debugRole} 
            onRoleChange={setDebugRole} 
          />
        </div>

        <Routes>
          {/* Public routes - accessible without authentication */}
          <Route path="/" element={<Index />} />
          
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="signup/consumer" element={<ConsumerSignUp />} />
            <Route path="signup/merchant" element={<MerchantSignUp />} />
          </Route>

          {/* Portal routes - now accessible without authentication in debug mode */}
          <Route path="/consumer/*" element={<ConsumerApp user={mockUser} profile={mockProfile} />} />
          <Route path="/merchant/*" element={<MerchantApp user={mockUser} profile={mockProfile} />} />
          <Route path="/admin/*" element={<AdminApp user={mockUser} profile={mockProfile} />} />
          
          {/* Dashboard route - redirect based on current debug role */}
          <Route path="/dashboard" element={<Navigate to={getDashboardRoute()} replace />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};
