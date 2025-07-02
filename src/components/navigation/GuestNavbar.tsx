
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger,
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Menu, ChevronDown, HelpCircle, Store, User } from 'lucide-react';
import { 
  Sheet, 
  SheetContent, 
  SheetTrigger 
} from '@/components/ui/sheet';

const GuestNavbar: React.FC = () => {
  return (
    <nav className="bg-white shadow-sm border-b">
      <div className="container mx-auto px-4">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <Link to="/" className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
              <span className="text-white font-bold text-sm">NB</span>
            </div>
            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              NearBuy
            </span>
          </Link>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-8">
            <Link to="/" className="text-gray-700 hover:text-blue-600 transition-colors">
              Home
            </Link>
            <Link to="/search" className="text-gray-700 hover:text-blue-600 transition-colors">
              Products
            </Link>
            <Link to="/route-planner" className="text-gray-700 hover:text-blue-600 transition-colors">
              Route Planner
            </Link>
            <Link to="/support" className="text-gray-700 hover:text-blue-600 transition-colors flex items-center">
              <HelpCircle className="h-4 w-4 mr-1" />
              Help Center
            </Link>
            <Link to="/merchant" className="text-gray-700 hover:text-green-600 transition-colors flex items-center">
              <Store className="h-4 w-4 mr-1" />
              Merchant Portal
            </Link>
          </div>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="flex items-center">
                  <User className="h-4 w-4 mr-2" />
                  Sign In <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/auth-consumer" className="w-full">Consumer Sign In</Link>
                </DropdownMenuItem>
                <DropdownMenuItem>
                  <Link to="/auth/signin" className="w-full">Merchant Sign In</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button className="bg-blue-600 hover:bg-blue-700">
                  Sign Up <ChevronDown className="ml-2 h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem>
                  <Link to="/auth-consumer" className="w-full">Sign Up as Consumer</Link>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem>
                  <Link to="/auth/signup/merchant" className="w-full flex items-center">
                    <Store className="h-4 w-4 mr-2" />
                    Sign Up as Merchant
                  </Link>
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
                  <Link to="/" className="text-lg font-medium">Home</Link>
                  <Link to="/search" className="text-lg font-medium">Products</Link>
                  <Link to="/route-planner" className="text-lg font-medium">Route Planner</Link>
                  <Link to="/support" className="text-lg font-medium flex items-center">
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help Center
                  </Link>
                  <Link to="/merchant" className="text-lg font-medium flex items-center text-green-600">
                    <Store className="h-4 w-4 mr-2" />
                    Merchant Portal
                  </Link>
                  
                  <div className="border-t pt-4 space-y-2">
                    <Link to="/auth-consumer" className="block">
                      <Button variant="outline" className="w-full">Consumer Sign In</Button>
                    </Link>
                    <Link to="/auth-consumer" className="block">
                      <Button className="w-full bg-blue-600 hover:bg-blue-700">Sign Up as Consumer</Button>
                    </Link>
                    <Link to="/auth/signup/merchant" className="block">
                      <Button variant="outline" className="w-full flex items-center justify-center">
                        <Store className="h-4 w-4 mr-2" />
                        Sign Up as Merchant
                      </Button>
                    </Link>
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

export default GuestNavbar;
