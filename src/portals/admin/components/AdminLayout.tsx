
import React from 'react';
import { User } from '@supabase/supabase-js';
import AdminSidebar from './AdminSidebar';
import AdminNavbar from './AdminNavbar';

interface AdminLayoutProps {
  children: React.ReactNode;
  user: User;
  profile: any;
}

const AdminLayout: React.FC<AdminLayoutProps> = ({ children, user, profile }) => {
  return (
    <div className="min-h-screen bg-gray-50 flex">
      <AdminSidebar />
      <div className="flex-1 flex flex-col">
        <AdminNavbar user={user} profile={profile} />
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AdminLayout;
