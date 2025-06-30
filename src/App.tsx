import React, { useState } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';

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
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50">
        <Routes>
          {/* Root redirect to consumer portal (landing page) */}
          <Route path="/" element={<Navigate to="/consumer" replace />} />
          
          {/* Keep original landing page for reference but don't link to it */}
          <Route path="/original-landing" element={<Index />} />
          
          {/* Auth routes */}
          <Route path="/auth" element={<AuthLayout />}>
            <Route path="signin" element={<SignIn />} />
            <Route path="signup" element={<SignUp />} />
            <Route path="signup/consumer" element={<ConsumerSignUp />} />
            <Route path="signup/merchant" element={<MerchantSignUp />} />
          </Route>

          {/* Portal routes */}
          <Route path="/consumer/*" element={<ConsumerApp />} />
          <Route path="/merchant/*" element={<MerchantApp />} />
          <Route path="/admin/*" element={<AdminApp />} />
        </Routes>
        <Toaster />
      </div>
    </BrowserRouter>
  );
};
