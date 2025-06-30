
import React, { useEffect } from 'react';
import { toast } from 'sonner';
import { Bell, ShoppingCart, AlertCircle } from 'lucide-react';

interface OrderNotificationsProps {
  orders: any[];
  lastOrderCount: number;
  onOrderCountChange: (count: number) => void;
}

const OrderNotifications: React.FC<OrderNotificationsProps> = ({
  orders,
  lastOrderCount,
  onOrderCountChange
}) => {
  useEffect(() => {
    const currentOrderCount = orders.length;
    const pendingOrders = orders.filter(order => order.status === 'pending').length;

    // Check for new orders
    if (currentOrderCount > lastOrderCount) {
      const newOrdersCount = currentOrderCount - lastOrderCount;
      toast.success(
        `${newOrdersCount} new order${newOrdersCount > 1 ? 's' : ''} received!`,
        {
          icon: <ShoppingCart className="w-4 h-4" />,
          duration: 5000,
        }
      );
    }

    // Alert for pending orders that need attention
    if (pendingOrders > 0) {
      const oldPendingOrders = Math.max(0, lastOrderCount - (currentOrderCount - pendingOrders));
      if (pendingOrders > oldPendingOrders) {
        toast.warning(
          `${pendingOrders} order${pendingOrders > 1 ? 's' : ''} need${pendingOrders === 1 ? 's' : ''} attention`,
          {
            icon: <AlertCircle className="w-4 h-4" />,
            duration: 8000,
          }
        );
      }
    }

    onOrderCountChange(currentOrderCount);
  }, [orders, lastOrderCount, onOrderCountChange]);

  return null; // This component only handles notifications
};

export default OrderNotifications;
