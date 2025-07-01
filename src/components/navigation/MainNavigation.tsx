
import React from 'react';
import { User } from '@supabase/supabase-js';
import UniversalNavbar from './UniversalNavbar';

interface MainNavigationProps {
  user?: User | null;
  profile?: any;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ user, profile }) => {
  return <UniversalNavbar user={user} profile={profile} />;
};

export default MainNavigation;
