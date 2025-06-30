
import React from 'react';
import { User } from '@supabase/supabase-js';
import UniversalNavbar from '@/components/navigation/UniversalNavbar';

interface ConsumerLayoutProps {
  children: React.ReactNode;
  user?: User | null;
  profile?: any;
}

const ConsumerLayout: React.FC<ConsumerLayoutProps> = ({ children, user, profile }) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <UniversalNavbar user={user} profile={profile} />
      <main>
        {children}
      </main>
    </div>
  );
};

export default ConsumerLayout;
