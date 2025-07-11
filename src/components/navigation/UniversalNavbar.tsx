import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { 
  ShoppingCart, 
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
  Store,
  ChevronDown,
  Settings,
  Star,
  History,
  Gift,
  Shield,
  Navigation
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Input } from '@/components/ui/input';
import { getBasket } from '@/utils/localStorage';
import { toast } from 'sonner';
import { useAuth } from '@/portals/consumer/hooks/useAuth';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import LocationAutocompleteInput from "@/components/LocationAutocompleteInput";
import { getUserLocation, setUserLocation } from '@/utils/location';

interface UniversalNavbarProps {
  user?: User | null;
  profile?: any;
}

const UniversalNavbar: React.FC<UniversalNavbarProps> = ({ user: propUser, profile: propProfile }) => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut } = useAuth();
  const basket = getBasket();
  const itemCount = basket.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const user = propUser;
  const profile = propProfile;

  const [locationValue, setLocationValue] = React.useState('');
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = React.useState(false);
  const [travelFilter, setTravelFilter] = React.useState<TravelFilterValue>({
    mode: 'driving',
    type: 'distance',
    value: 5
  });

  // Sync locationValue with persistent storage on mount and when changed elsewhere
  React.useEffect(() => {
    const stored = getUserLocation();
    if (stored && stored !== locationValue) {
      setLocationValue(stored);
    }
    const handleStorage = (e: StorageEvent) => {
      if (e.key === 'user_location') {
        setLocationValue(e.newValue || '');
      }
    };
    window.addEventListener('storage', handleStorage);
    return () => window.removeEventListener('storage', handleStorage);
  }, []);

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    navigate('/auth-consumer');
  };

  const handleAuthAction = () => {
    navigate('/auth-consumer');
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocationValue(selectedLocation);
    setUserLocation(selectedLocation);
    setIsLocationPopoverOpen(false);
    toast.success('Location updated!');
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocationValue(locationString);
          setUserLocation(locationString);
          setIsLocationPopoverOpen(false);
          toast.success('Location updated to your current position!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
    }
  };

  const isActivePath = (path: string) => location.pathname === path;

  return (
    <nav className="bg-white shadow-sm border-b sticky top-0 z-50">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3 shrink-0">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">NB</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NearBuy
            </span>
          </Link>

          {/* Location and Travel Filter - Desktop Only */}
          <div className="hidden lg:flex items-center gap-2">
            <Popover open={isLocationPopoverOpen} onOpenChange={setIsLocationPopoverOpen}>
              <PopoverTrigger asChild>
                <div className="relative flex items-center">
                  <MapPin className="h-4 w-4 text-gray-500 mr-2" />
                  <LocationAutocompleteInput
                    placeholder="Set location"
                    value={locationValue}
                    onChange={setLocationValue}
                    className="w-48 cursor-pointer text-sm"
                  />
                </div>
              </PopoverTrigger>
              <PopoverContent className="w-80 p-4" align="end">
                <div className="space-y-4">
                  <h4 className="font-medium text-gray-900">Enter your location</h4>
                  <Button
                    onClick={handleUseMyLocation}
                    variant="outline"
                    className="w-full justify-start"
                  >
                    <Navigation className="h-4 w-4 mr-2" />
                    Use My Current Location
                  </Button>
                  <LocationAutocompleteInput
                    placeholder="Type your address..."
                    value={locationValue}
                    onChange={setLocationValue}
                    className="w-full"
                  />
                  {locationValue.trim() && (
                    <Button
                      onClick={() => handleLocationSelect(locationValue)}
                      className="w-full"
                    >
                      Use "{locationValue}"
                    </Button>
                  )}
                </div>
              </PopoverContent>
            </Popover>

            <TravelFilter 
              value={travelFilter}
              onChange={setTravelFilter}
            />
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden md:flex items-center space-x-4">
            <Link to="/favorites">
              <Button variant="ghost" size="sm">
                <Heart className="h-4 w-4" />
              </Button>
            </Link>
            
            <Link to="/cart">
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
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3 py-2 h-auto">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Hello, {profile?.name || 'Customer'}</div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        Account & Lists <ChevronDown className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                    <Avatar className="h-8 w-8">
                      <AvatarImage src={profile?.avatar_url} />
                      <AvatarFallback>
                        {profile?.name?.charAt(0) || user.email?.charAt(0)}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <div className="p-4 bg-blue-50 border-b">
                    <div className="text-sm font-medium text-gray-900">Signed in as</div>
                    <div className="text-xs text-gray-600">{user?.email}</div>
                  </div>

                  <div className="flex">
                    <div className="flex-1 p-4 border-r">
                      <DropdownMenuLabel className="text-sm font-semibold text-gray-900 px-0 pb-2">
                        Your Account
                      </DropdownMenuLabel>
                      <div className="space-y-1">
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/profile')}
                        >
                          <UserIcon className="h-4 w-4 mr-2" />
                          Your Profile
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/orders')}
                        >
                          <Package className="h-4 w-4 mr-2" />
                          Your Orders
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/addresses')}
                        >
                          <MapPin className="h-4 w-4 mr-2" />
                          Your Addresses
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/payment-methods')}
                        >
                          <CreditCard className="h-4 w-4 mr-2" />
                          Payment Methods
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/route-planner')}
                        >
                          <Route className="h-4 w-4 mr-2" />
                          Route Planner
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/support')}
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Support
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/profile')}
                        >
                          <Settings className="h-4 w-4 mr-2" />
                          Account Settings
                        </DropdownMenuItem>
                      </div>
                    </div>

                    <div className="flex-1 p-4">
                      <DropdownMenuLabel className="text-sm font-semibold text-gray-900 px-0 pb-2">
                        Your Lists
                      </DropdownMenuLabel>
                      <div className="space-y-1">
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/favorites')}
                        >
                          <Heart className="h-4 w-4 mr-2" />
                          Your Wish List
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/cart')}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Shopping Cart
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/orders')}
                        >
                          <History className="h-4 w-4 mr-2" />
                          Buy Again
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/favorites')}
                        >
                          <Gift className="h-4 w-4 mr-2" />
                          Gift Ideas
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/orders')}
                        >
                          <Star className="h-4 w-4 mr-2" />
                          Your Reviews
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator className="my-0" />
                  
                  <div className="p-2">
                    <DropdownMenuItem 
                      onClick={handleSignOut} 
                      className="text-red-600 focus:text-red-600 cursor-pointer"
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3 py-2 h-auto">
                    <div className="text-right">
                      <div className="text-xs text-gray-500">Hello, Sign in</div>
                      <div className="text-sm font-medium text-gray-900 flex items-center">
                        Account & Lists <ChevronDown className="ml-1 h-3 w-3" />
                      </div>
                    </div>
                    <div className="w-8 h-8 bg-gray-100 rounded-full flex items-center justify-center">
                      <UserIcon className="h-4 w-4 text-gray-600" />
                    </div>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-80 p-0">
                  <div className="p-4 bg-blue-50 border-b">
                    <div className="text-sm font-medium text-gray-900">Find products you want NearBuy</div>
                    <div className="text-xs text-gray-600">Sign in to access your account</div>
                  </div>

                  <div className="flex">
                    <div className="flex-1 p-4 border-r">
                      <DropdownMenuLabel className="text-sm font-semibold text-gray-900 px-0 pb-2">
                        Your Account
                      </DropdownMenuLabel>
                      <div className="space-y-1">
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/auth-consumer')}
                        >
                          <UserIcon className="h-4 w-4 mr-2" />
                          Sign In
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/auth-consumer')}
                        >
                          <UserIcon className="h-4 w-4 mr-2" />
                          Create Account
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/route-planner')}
                        >
                          <Route className="h-4 w-4 mr-2" />
                          Route Planner
                        </DropdownMenuItem>
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/support')}
                        >
                          <HelpCircle className="h-4 w-4 mr-2" />
                          Support
                        </DropdownMenuItem>
                      </div>
                    </div>

                    <div className="flex-1 p-4">
                      <DropdownMenuLabel className="text-sm font-semibold text-gray-900 px-0 pb-2">
                        Your Lists
                      </DropdownMenuLabel>
                      <div className="space-y-1">
                        <DropdownMenuItem 
                          className="px-0 py-1 text-sm cursor-pointer"
                          onClick={() => navigate('/cart')}
                        >
                          <ShoppingCart className="h-4 w-4 mr-2" />
                          Shopping Cart
                        </DropdownMenuItem>
                      </div>
                    </div>
                  </div>
                  
                  <DropdownMenuSeparator className="my-0" />
                  
                  <div className="p-2">
                    <DropdownMenuItem 
                      onClick={() => navigate('/merchant')} 
                      className="text-green-600 focus:text-green-600 cursor-pointer"
                    >
                      <Store className="h-4 w-4 mr-2" />
                      Merchant Portal
                    </DropdownMenuItem>
                  </div>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden flex items-center space-x-2">
            <Link to="/cart">
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
                  <Link to="/favorites" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                    <Heart className="h-5 w-5" />
                    <span className="text-lg font-medium">Favorites</span>
                  </Link>

                  <Link to="/route-planner" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                    <Route className="h-5 w-5" />
                    <span className="text-lg font-medium">Route Planner</span>
                  </Link>

                  <Link to="/support" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                    <HelpCircle className="h-5 w-5" />
                    <span className="text-lg font-medium">Support</span>
                  </Link>

                  <Link to="/merchant" className="flex items-center space-x-3 px-3 py-2 rounded-md text-green-600 hover:text-green-700 hover:bg-green-50">
                    <Store className="h-5 w-5" />
                    <span className="text-lg font-medium">Merchant Portal</span>
                  </Link>

                  {user ? (
                    <>
                      <div className="border-t pt-4 space-y-2">
                        <Link to="/profile" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
                          <UserIcon className="h-5 w-5" />
                          <span className="text-lg font-medium">Profile</span>
                        </Link>
                        <Link to="/orders" className="flex items-center space-x-3 px-3 py-2 rounded-md text-gray-700 hover:text-blue-600 hover:bg-gray-100">
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

export default UniversalNavbar;
