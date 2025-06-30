
import React from 'react';
import { User } from '@supabase/supabase-js';
import UniversalNavbar from './UniversalNavbar';

interface MainNavigationProps {
  user?: User | null;
  profile?: any;
  debugMode?: boolean;
}

const MainNavigation: React.FC<MainNavigationProps> = ({ user, profile, debugMode = false }) => {
  return <UniversalNavbar user={user} profile={profile} debugMode={debugMode} />;
};

export default MainNavigation;
