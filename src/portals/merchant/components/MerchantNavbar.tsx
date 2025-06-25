
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { supabase } from '@/integrations/supabase/client';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  LogOut, 
  User as UserIcon, 
  Bell, 
  Shield, 
  Store, 
  Package, 
  Plus,
  ChevronDown,
  MessageCircle,
  LayoutDashboard
} from 'lucide-react';
import { toast } from 'sonner';

interface MerchantNavbarProps {
  user: User;
  profile: any;
}

const MerchantNavbar: React.FC<MerchantNavbarProps> = ({ user, profile }) => {
  const navigate = useNavigate();

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white border-b h-16 flex items-center justify-between px-6 shadow-sm">
      <div className="flex items-center space-x-8">
        <Link to="/merchant" className="text-xl font-bold text-blue-600">
          NearBuy Merchant
        </Link>
        
        <div className="hidden md:flex items-center space-x-6">
          <Link to="/merchant" className="flex items-center text-gray-700 hover:text-blue-600">
            <LayoutDashboard className="h-4 w-4 mr-1" />
            Dashboard
          </Link>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                <Store className="h-4 w-4 mr-1" />
                Stores
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg">
              <DropdownMenuItem asChild>
                <Link to="/merchant/stores" className="w-full">
                  My Stores
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/merchant/stores/new" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add New Store
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                <Package className="h-4 w-4 mr-1" />
                Products
                <ChevronDown className="h-4 w-4 ml-1" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="bg-white border shadow-lg">
              <DropdownMenuItem asChild>
                <Link to="/merchant/products" className="w-full">
                  All Products
                </Link>
              </DropdownMenuItem>
              <DropdownMenuItem asChild>
                <Link to="/merchant/products/new" className="w-full">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Product
                </Link>
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>

          <Link to="/merchant/inventory" className="text-gray-700 hover:text-blue-600">
            Inventory
          </Link>

          <Link to="/merchant/orders" className="text-gray-700 hover:text-blue-600">
            Orders
          </Link>

          <Link to="/merchant/analytics" className="text-gray-700 hover:text-blue-600">
            Analytics
          </Link>

          <Link to="/merchant/marketing" className="text-gray-700 hover:text-blue-600">
            Marketing
          </Link>

          <Link to="/merchant/integrations" className="text-gray-700 hover:text-blue-600">
            Integrations
          </Link>
        </div>
      </div>
      
      <div className="flex items-center space-x-4">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarImage src={profile?.avatar_url} />
                <AvatarFallback>
                  {profile?.name?.charAt(0) || user.email?.charAt(0)}
                </AvatarFallback>
              </Avatar>
              <span className="ml-2 hidden md:block">
                {profile?.name || user.email}
              </span>
              <ChevronDown className="h-4 w-4 ml-1" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="bg-white border shadow-lg w-56">
            <DropdownMenuItem asChild>
              <Link to="/merchant/profile" className="w-full">
                <UserIcon className="h-4 w-4 mr-2" />
                Merchant Profile
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/merchant/notifications" className="w-full">
                <Bell className="h-4 w-4 mr-2" />
                Notifications
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link to="/merchant/security" className="w-full">
                <Shield className="h-4 w-4 mr-2" />
                Security Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem asChild>
              <Link to="/merchant/support" className="w-full">
                <MessageCircle className="h-4 w-4 mr-2" />
                Merchant Support
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut}>
              <LogOut className="h-4 w-4 mr-2" />
              Log Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </nav>
  );
};

export default MerchantNavbar;
