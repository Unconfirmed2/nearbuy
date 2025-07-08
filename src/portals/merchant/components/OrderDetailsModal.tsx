import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Calendar,
  Package,
  DollarSign
} from 'lucide-react';
import { OrderWithDetails } from '../types/order';

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: OrderWithDetails | null;
  onUpdateStatus: (orderId: string, status: string) => void;
  onRefund: (orderId: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  open,
  onClose,
  order,
  onUpdateStatus,
  onRefund
}) => {
  if (!order) return null;

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      ready_for_pickup: { color: 'bg-green-100 text-green-800', label: 'Ready for Pickup' },
      picked_up: { color: 'bg-gray-100 text-gray-800', label: 'Picked Up' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <DialogTitle>Order #{order.order_number}</DialogTitle>
            {getStatusBadge(order.status)}
          </div>
          <DialogDescription>
            View and manage order details, including customer information and order items.
          </DialogDescription>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <User className="w-5 h-5" />
              Customer Information
            </h3>
            <div className="grid grid-cols-2 gap-4 text-sm">
              <div>
                <span className="font-medium">Name:</span> {order.customer_name}
              </div>
              <div>
                <span className="font-medium">Email:</span> {order.customer_email}
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Details */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <Package className="w-5 h-5" />
              Order Details
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Store:</span>
                <span>{order.store_name}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Items:</span>
                <span>{order.items_count} items</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Order Date:</span>
                <span>{formatDate(order.created_at)}</span>
              </div>
              {order.pickup_time && (
                <div className="flex justify-between">
                  <span className="font-medium">Pickup Time:</span>
                  <span>{formatDate(order.pickup_time)}</span>
                </div>
              )}
            </div>
          </div>

          <Separator />

          {/* Payment Information */}
          <div>
            <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
              <DollarSign className="w-5 h-5" />
              Payment Information
            </h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="font-medium">Subtotal:</span>
                <span>${(order.total_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between">
                <span className="font-medium">Tax:</span>
                <span>${(order.tax_amount || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between font-bold text-base">
                <span>Total:</span>
                <span>${((order.total_amount || 0) + (order.tax_amount || 0)).toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-2 pt-4 border-t">
            {order.status === 'pending' && (
              <Button onClick={() => onUpdateStatus(order.id, 'confirmed')}>
                Confirm Order
              </Button>
            )}
            {order.status === 'confirmed' && (
              <Button onClick={() => onUpdateStatus(order.id, 'ready_for_pickup')}>
                Mark Ready
              </Button>
            )}
            {order.status === 'ready_for_pickup' && (
              <Button onClick={() => onUpdateStatus(order.id, 'picked_up')}>
                Mark Picked Up
              </Button>
            )}
            {['pending', 'confirmed'].includes(order.status) && (
              <>
                <Button 
                  variant="outline" 
                  onClick={() => onUpdateStatus(order.id, 'cancelled')}
                >
                  Cancel Order
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => onRefund(order.id)}
                >
                  Process Refund
                </Button>
              </>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
