
import React from 'react';
import { User } from '@supabase/supabase-js';
import MerchantSidebar from './MerchantSidebar';
import MerchantHeader from './MerchantHeader';

interface MerchantLayoutProps {
  children: React.ReactNode;
  user: User;
  profile: any;
}

const MerchantLayout: React.FC<MerchantLayoutProps> = ({ children, user, profile }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <MerchantHeader user={user} profile={profile} />
      <div className="flex flex-1">
        <div className="w-64 bg-white border-r">
          <div className="p-4">
            <MerchantSidebar />
          </div>
        </div>
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default MerchantLayout;
