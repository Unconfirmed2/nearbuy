
import React from 'react';
import { User } from '@supabase/supabase-js';
import ConsumerNavbar from './ConsumerNavbar';
import GuestNavbar from '@/components/navigation/GuestNavbar';

interface ConsumerLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  profile?: any;
}

const ConsumerLayout: React.FC<ConsumerLayoutProps> = ({ children, user, profile }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      {user ? (
        <ConsumerNavbar user={user} profile={profile} />
      ) : (
        <GuestNavbar />
      )}
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default ConsumerLayout;
