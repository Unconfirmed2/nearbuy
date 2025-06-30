
import React from 'react';
import { User } from '@supabase/supabase-js';
import GuestNavbar from './GuestNavbar';
import ConsumerNavbar from '@/portals/consumer/components/ConsumerNavbar';
import MerchantNavbar from '@/portals/merchant/components/MerchantNavbar';

interface MainNavigationProps {
  user?: User | null;
  profile?: any;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ user, profile }) => {
  // Guest/logged out state
  if (!user || !profile) {
    return <GuestNavbar />;
  }

  // Role-based navigation
  switch (profile.role) {
    case 'customer':
      return <ConsumerNavbar user={user} profile={profile} />;
    case 'store_owner':
      return <MerchantNavbar user={user} profile={profile} />;
    default:
      return <GuestNavbar />;
  }
};

export default MainNavigation;
