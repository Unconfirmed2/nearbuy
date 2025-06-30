
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { 
  User, 
  MapPin, 
  Phone, 
  Mail, 
  Clock, 
  Package,
  DollarSign,
  RefreshCw
} from 'lucide-react';
import OrderStatusBadge from './OrderStatusBadge';

interface OrderDetailsModalProps {
  open: boolean;
  onClose: () => void;
  order: any;
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

  const getNextActions = (status: string) => {
    switch (status) {
      case 'pending':
        return [
          { label: 'Confirm Order', status: 'confirmed', variant: 'default' as const },
          { label: 'Cancel Order', status: 'cancelled', variant: 'destructive' as const }
        ];
      case 'confirmed':
        return [
          { label: 'Mark Ready for Pickup', status: 'ready_for_pickup', variant: 'default' as const },
          { label: 'Cancel Order', status: 'cancelled', variant: 'destructive' as const }
        ];
      case 'ready_for_pickup':
        return [
          { label: 'Mark as Picked Up', status: 'picked_up', variant: 'default' as const }
        ];
      default:
        return [];
    }
  };

  const actions = getNextActions(order.status);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.order_number}</span>
            <OrderStatusBadge status={order.status} />
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-6">
          {/* Customer Information */}
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <User className="w-4 h-4" />
              Customer Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="font-medium">{order.customer_name}</div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="w-4 h-4" />
                {order.customer_email}
              </div>
              {order.customer_phone && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Phone className="w-4 h-4" />
                  {order.customer_phone}
                </div>
              )}
            </div>
          </div>

          {/* Store & Pickup Information */}
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <MapPin className="w-4 h-4" />
              Pickup Information
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="font-medium">{order.store_name}</div>
              {order.store_address && (
                <div className="text-sm text-gray-600">{order.store_address}</div>
              )}
              {order.pickup_time && (
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <Clock className="w-4 h-4" />
                  Scheduled: {new Date(order.pickup_time).toLocaleString()}
                </div>
              )}
            </div>
          </div>

          {/* Order Items */}
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <Package className="w-4 h-4" />
              Order Items
            </h3>
            <div className="space-y-2">
              {order.items?.map((item: any, index: number) => (
                <div key={index} className="flex justify-between items-center p-3 border rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.product_name}</div>
                    {item.variant && (
                      <div className="text-sm text-gray-600">{item.variant}</div>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <Badge variant="outline">Qty: {item.quantity}</Badge>
                    <div className="font-medium">${(item.price * item.quantity).toFixed(2)}</div>
                  </div>
                </div>
              )) || (
                <div className="text-center py-4 text-gray-500">
                  No items details available
                </div>
              )}
            </div>
          </div>

          {/* Order Summary */}
          <div>
            <h3 className="font-medium flex items-center gap-2 mb-3">
              <DollarSign className="w-4 h-4" />
              Order Summary
            </h3>
            <div className="bg-gray-50 p-4 rounded-lg space-y-2">
              <div className="flex justify-between text-sm">
                <span>Subtotal:</span>
                <span>${(order.total_amount - (order.tax_amount || 0)).toFixed(2)}</span>
              </div>
              {order.tax_amount > 0 && (
                <div className="flex justify-between text-sm">
                  <span>Tax:</span>
                  <span>${order.tax_amount.toFixed(2)}</span>
                </div>
              )}
              <Separator />
              <div className="flex justify-between font-medium">
                <span>Total:</span>
                <span>${order.total_amount.toFixed(2)}</span>
              </div>
            </div>
          </div>

          {/* Order Timeline */}
          <div>
            <h3 className="font-medium mb-3">Order Timeline</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span>Order Placed:</span>
                <span>{new Date(order.created_at).toLocaleString()}</span>
              </div>
              {order.updated_at && order.updated_at !== order.created_at && (
                <div className="flex justify-between">
                  <span>Last Updated:</span>
                  <span>{new Date(order.updated_at).toLocaleString()}</span>
                </div>
              )}
            </div>
          </div>

          {/* Actions */}
          {actions.length > 0 && (
            <div className="flex gap-3 pt-4 border-t">
              {actions.map((action, index) => (
                <Button
                  key={index}
                  variant={action.variant}
                  onClick={() => {
                    onUpdateStatus(order.id, action.status);
                    onClose();
                  }}
                >
                  {action.label}
                </Button>
              ))}
              {(order.status === 'picked_up' || order.status === 'cancelled') && (
                <Button
                  variant="outline"
                  onClick={() => {
                    onRefund(order.id);
                    onClose();
                  }}
                >
                  <RefreshCw className="w-4 h-4 mr-2" />
                  Process Refund
                </Button>
              )}
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
