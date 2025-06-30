
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Megaphone, 
  Settings, 
  HelpCircle,
  Zap,
  Star
} from 'lucide-react';

const MerchantSidebar = () => {
  const location = useLocation();

  const menuItems = [
    { icon: LayoutDashboard, label: 'Dashboard', path: '/merchant' },
    { icon: Store, label: 'Stores', path: '/merchant/stores' },
    { icon: Package, label: 'Products', path: '/merchant/products' },
    { icon: ShoppingCart, label: 'Orders', path: '/merchant/orders' },
    { icon: BarChart3, label: 'Analytics', path: '/merchant/analytics' },
    { icon: Megaphone, label: 'Marketing', path: '/merchant/marketing' },
    { icon: Star, label: 'Reviews', path: '/merchant/reviews' },
    { icon: Zap, label: 'Integrations', path: '/merchant/integrations' },
    { icon: Settings, label: 'Settings', path: '/merchant/settings' },
    { icon: HelpCircle, label: 'Support', path: '/merchant/support' }
  ];

  return (
    <nav className="space-y-1">
      {menuItems.map((item) => {
        const Icon = item.icon;
        const isActive = location.pathname === item.path;
        
        return (
          <Link
            key={item.path}
            to={item.path}
            className={cn(
              "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
              isActive
                ? "bg-blue-100 text-blue-700"
                : "text-gray-600 hover:bg-gray-50 hover:text-gray-900"
            )}
          >
            <Icon className="mr-3 h-5 w-5 flex-shrink-0" />
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
};

export default MerchantSidebar;
