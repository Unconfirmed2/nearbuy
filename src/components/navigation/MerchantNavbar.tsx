
import React from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown, Store, User, ShoppingCart, BarChart3, Package, Star, Megaphone, Settings, LogOut, MapPin } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';
import { useAuth } from '@/portals/merchant/hooks/useAuth';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';

const MerchantNavbar: React.FC = () => {
  const navigate = useNavigate();
  const { user, signOut } = useAuth();
  
  const [travelFilter, setTravelFilter] = React.useState<TravelFilterValue>({
    mode: 'driving',
    type: 'time',
    value: 5
  });

  const handleSignOut = async () => {
    await signOut();
  };

  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/?merchant=true" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">NB</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NearBuy
            </span>
          </Link>

          {/* Center Section - Location and Filter */}
          <div className="hidden md:flex items-center space-x-4 flex-1 max-w-2xl mx-8">
            {/* Location Input */}
            <div className="relative flex-1 max-w-xs">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Location"
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            {/* Travel Filter */}
            <TravelFilter 
              value={travelFilter}
              onChange={setTravelFilter}
            />
          </div>

          {/* Desktop Merchant Menu */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <Store className="h-4 w-4 mr-2" />
                  Merchant Portal <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={() => navigate('/merchant')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Dashboard
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/merchant/stores')}>
                  <Store className="h-4 w-4 mr-2" />
                  Stores
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/merchant/products')}>
                  <Package className="h-4 w-4 mr-2" />
                  Products
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/merchant/orders')}>
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Orders
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/merchant/analytics')}>
                  <BarChart3 className="h-4 w-4 mr-2" />
                  Analytics
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/merchant/marketing')}>
                  <Megaphone className="h-4 w-4 mr-2" />
                  Marketing
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate('/merchant/reviews')}>
                  <Star className="h-4 w-4 mr-2" />
                  Reviews
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate('/merchant/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Settings
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  {user?.email?.split('@')[0] || 'Account'} <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={() => navigate('/merchant/settings')}>
                  <Settings className="h-4 w-4 mr-2" />
                  Account Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
                  <LogOut className="h-4 w-4 mr-2" />
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>

          {/* Mobile Menu */}
          <div className="md:hidden">
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="sm">
                  <Menu className="h-6 w-6" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-80">
                <div className="flex flex-col space-y-4 mt-8">
                  {/* Mobile Location Input */}
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      type="text"
                      placeholder="Location"
                      className="pl-10 bg-gray-50 border-gray-200"
                    />
                  </div>

                  {/* Mobile Travel Filter */}
                  <TravelFilter 
                    value={travelFilter}
                    onChange={setTravelFilter}
                  />
                  
                  <div className="border-t pt-4 space-y-2">
                    <div className="text-sm font-semibold text-gray-600 mb-2">Merchant Portal</div>
                    <Link to="/merchant" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <BarChart3 className="h-4 w-4 mr-2" />
                        Dashboard
                      </Button>
                    </Link>
                    <Link to="/merchant/stores" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <Store className="h-4 w-4 mr-2" />
                        Stores
                      </Button>
                    </Link>
                    <Link to="/merchant/products" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <Package className="h-4 w-4 mr-2" />
                        Products
                      </Button>
                    </Link>
                    <Link to="/merchant/orders" className="block">
                      <Button variant="ghost" className="w-full justify-start">
                        <ShoppingCart className="h-4 w-4 mr-2" />
                        Orders
                      </Button>
                    </Link>
                    
                    <div className="pt-2 border-t">
                      <Button onClick={handleSignOut} variant="ghost" className="w-full justify-start text-red-600">
                        <LogOut className="h-4 w-4 mr-2" />
                        Sign Out
                      </Button>
                    </div>
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MerchantNavbar;
