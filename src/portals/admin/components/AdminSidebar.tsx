
import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Users, 
  Store, 
  Package, 
  ShoppingCart, 
  BarChart3,
  Shield
} from 'lucide-react';
import { cn } from '@/lib/utils';

const AdminSidebar: React.FC = () => {
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Users', href: '/admin/users', icon: Users },
    { name: 'Stores', href: '/admin/stores', icon: Store },
    { name: 'Products', href: '/admin/products', icon: Package },
    { name: 'Orders', href: '/admin/orders', icon: ShoppingCart },
    { name: 'Analytics', href: '/admin/analytics', icon: BarChart3 },
  ];

  return (
    <div className="bg-white w-64 shadow-sm border-r">
      <div className="p-6">
        <div className="flex items-center">
          <Shield className="h-6 w-6 text-red-600 mr-2" />
          <h1 className="text-xl font-bold text-red-600">Admin Portal</h1>
        </div>
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
                  ? 'bg-red-50 text-red-700'
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

export default AdminSidebar;
