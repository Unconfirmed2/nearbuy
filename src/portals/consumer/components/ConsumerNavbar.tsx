
import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
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
import { 
  ShoppingCart, 
  Search, 
  Heart, 
  User as UserIcon, 
  LogOut, 
  MapPin, 
  CreditCard, 
  Package, 
  HelpCircle,
  Menu,
  Home,
  Route,
  Store
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { getBasket } from '@/utils/localStorage';
import { toast } from 'sonner';
import { useAuth } from '../hooks/useAuth';

interface ConsumerNavbarProps {
  user?: User | null;
  profile?: any;
}

const ConsumerNavbar: React.FC<ConsumerNavbarProps> = ({ user: propUser, profile: propProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const basket = getBasket();
  const itemCount = basket.reduce((sum, item) => sum + (item.quantity || 1), 0);

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

  const isActivePath = (path: string) => location.pathname === path;

  const navigationItems = [
    { path: '/consumer', label: 'Home', icon: Home },
    { path: '/consumer/search', label: 'Search', icon: Search },
    { path: '/consumer/route-planner', label: 'Route Planner', icon: Route },
    { path: '/consumer/support', label: 'Support', icon: HelpCircle },
  ];

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/consumer" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">NB</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NearBuy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-6">
            {navigationItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-md transition-colors ${
                  isActivePath(item.path)
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                }`}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </Link>
            ))}
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
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

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
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

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Navigation Items */}
                  {navigationItems.map((item) => (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center space-x-3 px-3 py-2 rounded-md transition-colors ${
                        isActivePath(item.path)
                          ? 'bg-blue-100 text-blue-700'
                          : 'text-gray-700 hover:text-blue-600 hover:bg-gray-100'
                      }`}
                    >
                      <item.icon className="h-5 w-5" />
                      <span className="text-lg font-medium">{item.label}</span>
                    </Link>
                  ))}
                  
                  <Link to="/consumer/favorites" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                    <Heart className="h-5 w-5" />
                    <span className="text-lg font-medium">Favorites</span>
                  </Link>

                  {/* Merchant Portal Link */}
                  <Link to="/merchant" className="flex items-center space-x-3 px-3 py-2 rounded-md text-green-600 hover:text-green-700 hover:bg-green-50">
                    <Store className="h-5 w-5" />
                    <span className="text-lg font-medium">Merchant Portal</span>
                  </Link>

                  {user ? (
                    <>
                      <div className="border-t pt-4 space-y-2">
                        <Link to="/consumer/profile" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                          <UserIcon className="h-5 w-5" />
                          <span className="text-lg font-medium">Profile</span>
                        </Link>
                        <Link to="/consumer/orders" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                          <Package className="h-5 w-5" />
                          <span className="text-lg font-medium">Orders</span>
                        </Link>
                        <Button onClick={handleSignOut} variant="outline" className="w-full justify-start">
                          <LogOut className="h-4 w-4 mr-2" />
                          Sign Out
                        </Button>
                      </div>
                    </>
                  ) : (
                    <div className="border-t pt-4">
                      <Button onClick={handleAuthAction} className="w-full">
                        Sign In
                      </Button>
                    </div>
                  )}
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default ConsumerNavbar;
