
import React from 'react';
import { User } from '@supabase/supabase-js';
import ConsumerNavbar from './ConsumerNavbar';

interface ConsumerLayoutProps {
  children: React.ReactNode;
  user: User;
  profile: any;
}

const ConsumerLayout: React.FC<ConsumerLayoutProps> = ({ children, user, profile }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <ConsumerNavbar user={user} profile={profile} />
      <main className="container mx-auto px-4 py-8">
        {children}
      </main>
    </div>
  );
};

export default ConsumerLayout;
