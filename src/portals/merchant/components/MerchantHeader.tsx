
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
  Shield
} from 'lucide-react';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';

interface MerchantHeaderProps {
  user: User;
  profile: any;
}

const MerchantHeader: React.FC<MerchantHeaderProps> = ({ user, profile }) => {
  const navigate = useNavigate();
  
  const [notifications] = React.useState([
    {
      id: '1',
      title: 'New Order #1234',
      message: 'Order for iPhone 15 Pro Max ready for confirmation',
      type: 'new_order',
      time: '2 minutes ago',
      unread: true
    },
    {
      id: '2',
      title: 'Low Stock Alert',
      message: 'MacBook Air M3 is running low (3 left)',
      type: 'low_stock',
      time: '1 hour ago',
      unread: true
    },
    {
      id: '3',
      title: 'New Review',
      message: 'Sarah left a 5-star review for AirPods Pro',
      type: 'review',
      time: '3 hours ago',
      unread: false
    }
  ]);

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
    toast.success('Signed out successfully');
    navigate('/consumer');
  };

  return (
    <header className="h-16 bg-white border-b px-6 flex items-center justify-between shadow-sm">
      <div className="flex items-center gap-4">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">NearBuy Merchant</h1>
            <p className="text-sm text-gray-500">Welcome back, {profile?.name || 'Merchant'}!</p>
          </div>
        </div>
      </div>
      
      <div className="flex items-center gap-3">
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
              {notifications.map(notification => (
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
              ))}
            </div>
            <div className="p-3 border-t">
              <Button variant="ghost" size="sm" className="w-full">
                View All Notifications
              </Button>
            </div>
          </PopoverContent>
        </Popover>

        {/* User Menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm" className="flex items-center gap-2">
              <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                <UserIcon className="h-4 w-4 text-blue-600" />
              </div>
              <span className="font-medium">{profile?.name || 'Merchant'}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <DropdownMenuLabel>
              <div>
                <p className="font-medium">{profile?.name || 'Merchant'}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
            </DropdownMenuLabel>
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate('/merchant/settings')}>
              <UserIcon className="h-4 w-4 mr-2" />
              Profile Settings
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/merchant/stores')}>
              <Store className="h-4 w-4 mr-2" />
              Store Management
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/merchant/settings')}>
              <CreditCard className="h-4 w-4 mr-2" />
              Billing & Payments
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/merchant/settings')}>
              <Settings className="h-4 w-4 mr-2" />
              Account Settings
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={() => navigate('/merchant/support')}>
              <HelpCircle className="h-4 w-4 mr-2" />
              Help & Support
            </DropdownMenuItem>
            
            <DropdownMenuItem onClick={() => navigate('/merchant/settings')}>
              <Shield className="h-4 w-4 mr-2" />
              Security
            </DropdownMenuItem>
            
            <DropdownMenuSeparator />
            
            <DropdownMenuItem onClick={handleSignOut} className="text-red-600 focus:text-red-600">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
};

export default MerchantHeader;
