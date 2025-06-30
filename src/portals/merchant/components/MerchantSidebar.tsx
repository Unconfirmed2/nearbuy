import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { cn } from '@/lib/utils';
import { 
  LayoutDashboard, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3, 
  Settings,
  Megaphone
} from 'lucide-react';

interface MerchantSidebarProps {
  className?: string;
}

const MerchantSidebar: React.FC<MerchantSidebarProps> = ({ className }) => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/merchant', icon: LayoutDashboard },
    { name: 'Stores', href: '/merchant/stores', icon: Store },
    { name: 'Products', href: '/merchant/products', icon: Package },
    { name: 'Orders', href: '/merchant/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/merchant/analytics', icon: BarChart3 },
    { name: 'Marketing', href: '/merchant/marketing', icon: Megaphone },
    { name: 'Settings', href: '/merchant/settings', icon: Settings },
  ];

  return (
    <div className="bg-white w-64 shadow-sm border-r">
      <div className="p-6">
        <h1 className="text-xl font-bold text-blue-600">Merchant Portal</h1>
      </div>
      
      <nav className="px-4 space-y-1">
        {navigation.map((item) => {
          const isActive = location.pathname === item.href;
          return (
            <Link
              key={item.name}
              to={item.href}
              className={cn(
                'flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors',
                isActive
                  ? 'bg-blue-50 text-blue-700'
                  : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
              )}
            >
              <item.icon className="h-5 w-5 mr-3" />
              {item.name}
            </Link>
          );
        })}
      </nav>
    </div>
  );
};

export default MerchantSidebar;
