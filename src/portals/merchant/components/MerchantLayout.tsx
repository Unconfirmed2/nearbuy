
import React from 'react';
import { User } from '@supabase/supabase-js';
import MerchantSidebar from './MerchantSidebar';
import MerchantNavbar from './MerchantNavbar';

interface MerchantLayoutProps {
  children: React.ReactNode;
  user: User;
  profile: any;
}

const MerchantLayout: React.FC<MerchantLayoutProps> = ({ children, user, profile }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <MerchantSidebar />
      <div className="flex-1 flex flex-col">
        <MerchantNavbar user={user} profile={profile} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MerchantLayout;
