
import React from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Eye, MoreVertical } from 'lucide-react';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import OrderStatusBadge from './OrderStatusBadge';

interface Order {
  id: string;
  order_number: string;
  customer_name: string;
  customer_email: string;
  store_name: string;
  total_amount: number;
  status: string;
  created_at: string;
  pickup_time?: string;
  items_count: number;
}

interface OrdersTableProps {
  orders: Order[];
  onViewDetails: (order: Order) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({
  orders,
  onViewDetails,
  onUpdateStatus
}) => {
  const getNextStatus = (currentStatus: string) => {
    switch (currentStatus) {
      case 'pending':
        return 'confirmed';
      case 'confirmed':
        return 'ready_for_pickup';
      case 'ready_for_pickup':
        return 'picked_up';
      default:
        return null;
    }
  };

  const getStatusAction = (status: string) => {
    switch (status) {
      case 'pending':
        return 'Confirm Order';
      case 'confirmed':
        return 'Mark Ready';
      case 'ready_for_pickup':
        return 'Mark Picked Up';
      default:
        return null;
    }
  };

  return (
    <div className="border rounded-lg">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Order</TableHead>
            <TableHead>Customer</TableHead>
            <TableHead>Store</TableHead>
            <TableHead>Items</TableHead>
            <TableHead>Amount</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Date</TableHead>
            <TableHead>Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {orders.map((order) => (
            <TableRow key={order.id}>
              <TableCell>
                <div>
                  <div className="font-medium">#{order.order_number}</div>
                  {order.pickup_time && (
                    <div className="text-xs text-gray-500">
                      Pickup: {new Date(order.pickup_time).toLocaleString()}
                    </div>
                  )}
                </div>
              </TableCell>
              <TableCell>
                <div>
                  <div className="font-medium">{order.customer_name}</div>
                  <div className="text-sm text-gray-500">{order.customer_email}</div>
                </div>
              </TableCell>
              <TableCell>{order.store_name}</TableCell>
              <TableCell>
                <Badge variant="outline">{order.items_count} items</Badge>
              </TableCell>
              <TableCell>${order.total_amount.toFixed(2)}</TableCell>
              <TableCell>
                <OrderStatusBadge status={order.status} />
              </TableCell>
              <TableCell>
                {new Date(order.created_at).toLocaleDateString()}
              </TableCell>
              <TableCell>
                <div className="flex items-center gap-2">
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => onViewDetails(order)}
                  >
                    <Eye className="w-4 h-4" />
                  </Button>
                  
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreVertical className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem onClick={() => onViewDetails(order)}>
                        View Details
                      </DropdownMenuItem>
                      {getNextStatus(order.status) && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(order.id, getNextStatus(order.status)!)}
                        >
                          {getStatusAction(order.status)}
                        </DropdownMenuItem>
                      )}
                      {order.status !== 'cancelled' && (
                        <DropdownMenuItem
                          onClick={() => onUpdateStatus(order.id, 'cancelled')}
                          className="text-red-600"
                        >
                          Cancel Order
                        </DropdownMenuItem>
                      )}
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default OrdersTable;
