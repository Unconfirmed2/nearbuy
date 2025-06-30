
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { 
  Clock, 
  CheckCircle, 
  Package, 
  Car,
  X,
  AlertTriangle
} from 'lucide-react';

interface OrderStatusBadgeProps {
  status: string;
  size?: 'sm' | 'default';
}

const OrderStatusBadge: React.FC<OrderStatusBadgeProps> = ({ status, size = 'default' }) => {
  const getStatusConfig = (status: string) => {
    switch (status) {
      case 'pending':
        return {
          label: 'Pending',
          variant: 'outline' as const,
          className: 'text-yellow-600 border-yellow-600',
          icon: <Clock className="w-3 h-3 mr-1" />
        };
      case 'confirmed':
        return {
          label: 'Confirmed',
          variant: 'default' as const,
          className: 'bg-blue-100 text-blue-800',
          icon: <CheckCircle className="w-3 h-3 mr-1" />
        };
      case 'ready_for_pickup':
        return {
          label: 'Ready for Pickup',
          variant: 'default' as const,
          className: 'bg-green-100 text-green-800',
          icon: <Package className="w-3 h-3 mr-1" />
        };
      case 'picked_up':
        return {
          label: 'Picked Up',
          variant: 'default' as const,
          className: 'bg-emerald-100 text-emerald-800',
          icon: <Car className="w-3 h-3 mr-1" />
        };
      case 'cancelled':
        return {
          label: 'Cancelled',
          variant: 'outline' as const,
          className: 'text-red-600 border-red-600',
          icon: <X className="w-3 h-3 mr-1" />
        };
      default:
        return {
          label: 'Unknown',
          variant: 'outline' as const,
          className: 'text-gray-600 border-gray-600',
          icon: <AlertTriangle className="w-3 h-3 mr-1" />
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <Badge 
      variant={config.variant} 
      className={`${config.className} ${size === 'sm' ? 'text-xs' : ''}`}
    >
      {config.icon}
      {config.label}
    </Badge>
  );
};

export default OrderStatusBadge;
