
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { LogOut, User as UserIcon } from 'lucide-react';
import { toast } from 'sonner';

interface AdminNavbarProps {
  user: User;
  profile: any;
}

const AdminNavbar: React.FC<AdminNavbarProps> = ({ user, profile }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/auth/signin');
  };

  return (
    <nav className="bg-white border-b h-16 flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-gray-900">
          Admin Dashboard - {profile?.name || user.email}
        </h2>
      </div>
      
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <Button variant="ghost" size="sm" className="rounded-full">
            <Avatar className="h-8 w-8">
              <AvatarImage src={profile?.avatar_url} />
              <AvatarFallback>
                {profile?.name?.charAt(0) || user.email?.charAt(0)}
              </AvatarFallback>
            </Avatar>
          </Button>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end">
          <DropdownMenuItem>
            <UserIcon className="h-4 w-4 mr-2" />
            Profile
          </DropdownMenuItem>
          <DropdownMenuItem onClick={handleSignOut}>
            <LogOut className="h-4 w-4 mr-2" />
            Sign Out
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    </nav>
  );
};

export default AdminNavbar;
