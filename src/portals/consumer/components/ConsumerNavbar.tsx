
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
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  MapPin,
  Star,
  Package,
  Settings,
  CreditCard,
  Bell,
  ChevronDown,
  MessageCircle
} from 'lucide-react';
import { toast } from 'sonner';
import { getBasket, getFavorites } from '@/utils/localStorage';

interface ConsumerNavbarProps {
  user: User;
  profile: any;
}

const ConsumerNavbar: React.FC<ConsumerNavbarProps> = ({ user, profile }) => {
  const navigate = useNavigate();
  const basket = getBasket();
  const favorites = getFavorites();
  const basketCount = basket.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const handleSignOut = async () => {
    await supabase.auth.signOut();
    toast.success('Signed out successfully');
    navigate('/');
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          <Link to="/consumer" className="text-xl font-bold text-blue-600">
            NearBuy
          </Link>
          
          <div className="hidden md:flex items-center space-x-6">
            <Link to="/consumer" className="text-gray-700 hover:text-blue-600">
              Home
            </Link>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Products
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/consumer/search" className="w-full">
                    Browse Categories
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/consumer/favorites" className="w-full">
                    <Heart className="h-4 w-4 mr-2" />
                    Favorites
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Stores
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/consumer/stores" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Nearby Stores
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/consumer/stores/top-rated" className="w-full">
                    <Star className="h-4 w-4 mr-2" />
                    Top-rated Stores
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <div className="flex items-center space-x-4">
            <Link to="/consumer/search">
              <Button variant="ghost" size="sm">
                <Search className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/consumer/favorites">
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>
            </Link>
            
            <Link to="/consumer/cart">
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {basketCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {basketCount}
                  </Badge>
                )}
              </Button>
            </Link>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="text-gray-700 hover:text-blue-600">
                  Orders
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="bg-white border shadow-lg">
                <DropdownMenuItem asChild>
                  <Link to="/consumer/orders/current" className="w-full">
                    Current Orders
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/consumer/orders" className="w-full">
                    Order History
                  </Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" size="sm" className="rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={profile?.avatar_url} />
                    <AvatarFallback>
                      {profile?.name?.charAt(0) || user.email?.charAt(0)}
                    </AvatarFallback>
                  </Avatar>
                  <ChevronDown className="h-4 w-4 ml-1" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="bg-white border shadow-lg w-56">
                <DropdownMenuItem asChild>
                  <Link to="/consumer/profile" className="w-full">
                    <UserIcon className="h-4 w-4 mr-2" />
                    Profile Settings
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/consumer/addresses" className="w-full">
                    <MapPin className="h-4 w-4 mr-2" />
                    Addresses
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/consumer/payments" className="w-full">
                    <CreditCard className="h-4 w-4 mr-2" />
                    Payment Methods
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/consumer/notifications" className="w-full">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/consumer/support" className="w-full">
                    <MessageCircle className="h-4 w-4 mr-2" />
                    Help Center
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link to="/consumer/support/chat" className="w-full">
                    Live Chat
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
        </div>
      </div>
    </nav>
  );
};

export default ConsumerNavbar;
