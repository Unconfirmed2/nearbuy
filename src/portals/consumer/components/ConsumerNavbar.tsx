
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
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
import { ShoppingCart, Search, Heart, User as UserIcon, LogOut } from 'lucide-react';
import { toast } from 'sonner';

interface ConsumerNavbarProps {
  user: User;
  profile: any;
}

const ConsumerNavbar: React.FC<ConsumerNavbarProps> = ({ user, profile }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/auth/signin');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/consumer" className="text-xl font-bold text-blue-600">
            NearBuy
          </Link>
          
          <div className="flex items-center space-x-4">
            <Link to="/consumer/search">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4 mr-2" />
                Search
              </Button>
            </Link>
            
            <Link to="/consumer/favorites">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/consumer/cart">
              <Button variant="ghost" size="sm">
                <ShoppingCart className="h-4 w-4" />
              </Button>
            </Link>
            
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
                <DropdownMenuItem onClick={() => navigate('/consumer/profile')}>
                  <UserIcon className="h-4 w-4 mr-2" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/consumer/orders')}>
                  Order History
                </DropdownMenuItem>
                <DropdownMenuItem onClick={handleSignOut}>
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ConsumerNavbar;
