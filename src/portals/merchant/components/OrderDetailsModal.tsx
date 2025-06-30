
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Clock, User, MapPin, Phone, Mail, Package } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

interface OrderDetailsModalProps {
  order: {
    id: string;
    user_id: string;
    status: string;
    total_amount: number;
    pickup_time: string;
    created_at: string;
    profiles: {
      name: string;
      email: string;
    };
    stores: {
      name: string;
    };
    order_items: Array<{
      quantity: number;
      unit_price: number;
      products: {
        name: string;
        brand: string;
      };
    }>;
  };
  open: boolean;
  onClose: () => void;
  onStatusUpdate: (orderId: string, status: string) => void;
}

const OrderDetailsModal: React.FC<OrderDetailsModalProps> = ({
  order,
  open,
  onClose,
  onStatusUpdate,
}) => {
  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800',
      confirmed: 'bg-blue-100 text-blue-800',
      ready: 'bg-green-100 text-green-800',
      completed: 'bg-gray-100 text-gray-800',
      cancelled: 'bg-red-100 text-red-800',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const subtotal = order.order_items?.reduce(
    (sum, item) => sum + (item.quantity * item.unit_price),
    0
  ) || 0;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Order #{order.id.slice(0, 8)}</span>
            <Badge className={getStatusColor(order.status)}>
              {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
            </Badge>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Order Info */}
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Clock className="h-4 w-4" />
                <span>Order Date</span>
              </div>
              <div className="font-medium">
                {new Date(order.created_at).toLocaleString()}
              </div>
            </div>
            <div className="space-y-2">
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Package className="h-4 w-4" />
                <span>Pickup Time</span>
              </div>
              <div className="font-medium">
                {order.pickup_time ? 
                  new Date(order.pickup_time).toLocaleString() : 
                  'Not scheduled'
                }
              </div>
            </div>
          </div>

          <Separator />

          {/* Customer Info */}
          <div>
            <h3 className="font-semibold mb-3 flex items-center gap-2">
              <User className="h-4 w-4" />
              Customer Information
            </h3>
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <span className="font-medium">{order.profiles?.name || 'Unknown Customer'}</span>
              </div>
              <div className="flex items-center gap-2 text-sm text-gray-600">
                <Mail className="h-4 w-4" />
                <span>{order.profiles?.email}</span>
              </div>
            </div>
          </div>

          <Separator />

          {/* Order Items */}
          <div>
            <h3 className="font-semibold mb-3">Order Items</h3>
            <div className="space-y-3">
              {order.order_items?.map((item, index) => (
                <div key={index} className="flex justify-between items-start p-3 bg-gray-50 rounded-lg">
                  <div className="flex-1">
                    <div className="font-medium">{item.products?.name}</div>
                    {item.products?.brand && (
                      <div className="text-sm text-gray-600">{item.products.brand}</div>
                    )}
                    <div className="text-sm text-gray-600">
                      Quantity: {item.quantity}
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="font-medium">{formatCurrency(item.unit_price)}</div>
                    <div className="text-sm text-gray-600">each</div>
                  </div>
                </div>
              )) || (
                <div className="text-gray-500 text-center py-4">No items found</div>
              )}
            </div>
          </div>

          <Separator />

          {/* Order Summary */}
          <div className="space-y-2">
            <div className="flex justify-between">
              <span>Subtotal:</span>
              <span>{formatCurrency(subtotal)}</span>
            </div>
            <div className="flex justify-between font-semibold text-lg">
              <span>Total:</span>
              <span>{formatCurrency(order.total_amount || 0)}</span>
            </div>
          </div>

          <Separator />

          {/* Status Update */}
          <div className="space-y-3">
            <h3 className="font-semibold">Update Order Status</h3>
            <div className="flex gap-3">
              <Select
                value={order.status}
                onValueChange={(status) => onStatusUpdate(order.id, status)}
              >
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="ready">Ready for Pickup</SelectItem>
                  <SelectItem value="completed">Completed</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
              <Button variant="outline" onClick={onClose}>
                Close
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default OrderDetailsModal;
