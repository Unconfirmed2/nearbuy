import React from 'react';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuSeparator,
  DropdownMenuTrigger,
  DropdownMenuLabel
} from '@/components/ui/dropdown-menu';
import { 
  Bell, 
  Settings, 
  User as UserIcon, 
  LogOut, 
  HelpCircle,
  Store,
  CreditCard,
  Shield,
  ChevronDown,
  Package,
  BarChart3,
  FileText,
  Users,
  Star,
  Megaphone,
  Heart,
  History,
  ShoppingCart,
  Eye
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../hooks/useAuth';

interface MerchantHeaderProps {
  user: User;
  profile: any;
}

const MerchantHeader: React.FC<MerchantHeaderProps> = ({ user, profile }) => {
  const navigate = useNavigate();
  const { signOut } = useAuth();
  
  const [notifications] = React.useState([]);

  const unreadCount = notifications.filter(n => n.unread).length;

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'new_order':
        return '🛒';
      case 'low_stock':
        return '⚠️';
      case 'review':
        return '⭐';
      default:
        return '📢';
    }
  };

  const handleSignOut = async () => {
    await signOut();
  };

  const handleLogoClick = () => {
    navigate('/?merchant=true');
  };

  const handlePreviewMode = () => {
    navigate('/merchant/preview');
  };

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div 
            className="w-8 h-8 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center cursor-pointer" 
            onClick={handleLogoClick}
          >
            <span className="text-white font-bold text-sm">NB</span>
          </div>
          <div>
            <h1 
              className="text-lg font-semibold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent cursor-pointer" 
              onClick={handleLogoClick}
            >
              NearBuy Merchant
            </h1>
            <p className="text-sm text-gray-500">Welcome back, {profile?.name || 'Merchant'}!</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
        {/* Preview Mode Button */}
        <Button
          variant="outline"
          size="sm"
          onClick={handlePreviewMode}
          className="flex items-center gap-2"
        >
          <Eye className="h-4 w-4" />
          Preview Store
        </Button>

        {/* Notifications */}
        <Popover>
          <PopoverTrigger asChild>
            <Button variant="ghost" size="sm" className="relative">
              <Bell className="h-5 w-5" />
              {unreadCount > 0 && (
                <Badge className="absolute -top-1 -right-1 h-5 w-5 rounded-full p-0 flex items-center justify-center text-xs">
                  {unreadCount}
                </Badge>
              )}
            </Button>
          </PopoverTrigger>
          <PopoverContent className="w-80 p-0" align="end">
            <div className="p-4 border-b">
              <h3 className="font-semibold">Notifications</h3>
              <p className="text-xs text-gray-500">{unreadCount} unread</p>
            </div>
            <div className="max-h-80 overflow-y-auto">
              {notifications.length === 0 ? (
                <div className="p-4 text-center text-gray-500">
                  No notifications
                </div>
              ) : (
                notifications.map(notification => (
                  <div 
                    key={notification.id}
                    className={`p-4 border-b hover:bg-gray-50 cursor-pointer ${
                      notification.unread ? 'bg-blue-50' : ''
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-lg">{getNotificationIcon(notification.type)}</span>
                      <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-medium text-sm">{notification.title}</p>
                          {notification.unread && (
                            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                          )}
                        </div>
                        <p className="text-xs text-gray-600 mt-1">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>
            <div className="p-3 border-t">
              <Button variant="ghost" size="sm" className="w-full">
                View All Notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* Single Combined Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2 px-3 py-2 h-auto">
              <div className="text-right">
                <div className="text-xs text-gray-500">Merchant Portal</div>
                <div className="text-sm font-medium text-gray-900 flex items-center">
                  {profile?.name || user?.email?.split('@')[0] || 'Account'} <ChevronDown className="ml-1 h-3 w-3" />
                </div>
              </div>
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-blue-600" />
              </div>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-80 p-0">
            {/* Sign In Section */}
            <div className="p-4 bg-blue-50 border-b">
              <div className="text-sm font-medium text-gray-900">Signed in as</div>
              <div className="text-xs text-gray-600">{user?.email}</div>
            </div>

            <div className="flex">
              {/* Your Business Column */}
              <div className="flex-1 p-4 border-r">
                <DropdownMenuLabel className="text-sm font-semibold text-gray-900 px-0 pb-2">
                  Your Business
                </DropdownMenuLabel>
                <div className="space-y-1">
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Dashboard
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/stores')}
                  >
                    <Store className="h-4 w-4 mr-2" />
                    Manage Stores
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/products')}
                  >
                    <Package className="h-4 w-4 mr-2" />
                    Products
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/orders')}
                  >
                    <ShoppingCart className="h-4 w-4 mr-2" />
                    Orders
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/analytics')}
                  >
                    <BarChart3 className="h-4 w-4 mr-2" />
                    Analytics
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/marketing')}
                  >
                    <Megaphone className="h-4 w-4 mr-2" />
                    Marketing
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/reviews')}
                  >
                    <Star className="h-4 w-4 mr-2" />
                    Reviews
                  </DropdownMenuItem>
                </div>
              </div>

              {/* Your Account Column */}
              <div className="flex-1 p-4">
                <DropdownMenuLabel className="text-sm font-semibold text-gray-900 px-0 pb-2">
                  Your Account
                </DropdownMenuLabel>
                <div className="space-y-1">
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/settings')}
                  >
                    <UserIcon className="h-4 w-4 mr-2" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/settings')}
                  >
                    <CreditCard className="h-4 w-4 mr-2" />
                    Billing & Payments
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/settings')}
                  >
                    <Settings className="h-4 w-4 mr-2" />
                    Preferences
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/settings')}
                  >
                    <Shield className="h-4 w-4 mr-2" />
                    Security
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/integrations')}
                  >
                    <FileText className="h-4 w-4 mr-2" />
                    Integrations
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    className="px-0 py-1 text-sm cursor-pointer"
                    onClick={() => navigate('/merchant/support')}
                  >
                    <HelpCircle className="h-4 w-4 mr-2" />
                    Help & Support
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
      </div>
    </header>
  );
};

export default MerchantHeader;
