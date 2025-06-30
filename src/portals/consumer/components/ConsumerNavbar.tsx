
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { ShoppingCart, Search, Heart, User as UserIcon, LogOut, MapPin, CreditCard, Package } from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { getBasket } from '@/utils/localStorage';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

interface ConsumerNavbarProps {
  user?: User | null;
  profile?: any;
}

const ConsumerNavbar: React.FC<ConsumerNavbarProps> = ({ user: propUser, profile: propProfile }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  const basket = getBasket();
  const itemCount = basket.reduce((sum, item) => sum + (item.quantity || 1), 0);

  // Use auth user if available, otherwise use props for debug mode
  const user = propUser;
  const profile = propProfile;

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/consumer/auth');
  };

  const handleAuthAction = () => {
    navigate('/consumer/auth');
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
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {itemCount > 0 && (
                  <Badge variant="destructive" className="absolute -top-2 -right-2 h-5 w-5 text-xs flex items-center justify-center p-0">
                    {itemCount}
                  </Badge>
                )}
              </Button>
            </Link>
            
            {user ? (
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
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuItem onClick={() => navigate('/consumer/profile')}>
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/consumer/addresses')}>
                    <MapPin className="h-4 w-4 mr-2" />
                    Saved Addresses
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/consumer/payment-methods')}>
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => navigate('/consumer/orders')}>
                    <Package className="h-4 w-4 mr-2" />
                    Order History
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut}>
                    <LogOut className="h-4 w-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <Button onClick={handleAuthAction}>
                Sign In
              </Button>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ConsumerNavbar;
