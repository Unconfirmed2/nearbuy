
import React from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from '@/components/ui/select';
import { Eye } from 'lucide-react';
import { Order } from '../types/order';

interface OrderWithDetails extends Order {
  order_number: string;
  customer_name: string;
  customer_email: string;
  store_name: string;
  items_count: number;
}

interface OrdersTableProps {
  orders: OrderWithDetails[];
  onViewDetails: (order: OrderWithDetails) => void;
  onUpdateStatus: (orderId: string, status: string) => void;
}

const OrdersTable: React.FC<OrdersTableProps> = ({ 
  orders, 
  onViewDetails, 
  onUpdateStatus 
}) => {
  const getStatusBadge = (status: string) => {
    const statusConfig = {
      pending: { color: 'bg-yellow-100 text-yellow-800', label: 'Pending' },
      confirmed: { color: 'bg-blue-100 text-blue-800', label: 'Confirmed' },
      ready_for_pickup: { color: 'bg-green-100 text-green-800', label: 'Ready' },
      picked_up: { color: 'bg-gray-100 text-gray-800', label: 'Picked Up' },
      cancelled: { color: 'bg-red-100 text-red-800', label: 'Cancelled' }
    };
    
    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.pending;
    return <Badge className={config.color}>{config.label}</Badge>;
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  return (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Order #</TableHead>
          <TableHead>Customer</TableHead>
          <TableHead>Store</TableHead>
          <TableHead>Items</TableHead>
          <TableHead>Total</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Date</TableHead>
          <TableHead>Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {orders.map((order) => (
          <TableRow key={order.id}>
            <TableCell className="font-medium">
              {order.order_number}
            </TableCell>
            <TableCell>
              <div>
                <div className="font-medium">{order.customer_name}</div>
                <div className="text-sm text-gray-500">{order.customer_email}</div>
              </div>
            </TableCell>
            <TableCell>{order.store_name}</TableCell>
            <TableCell>{order.items_count}</TableCell>
            <TableCell>${order.total_amount?.toFixed(2) || '0.00'}</TableCell>
            <TableCell>
              <Select
                value={order.status}
                onValueChange={(value) => onUpdateStatus(order.id, value)}
              >
                <SelectTrigger className="w-32">
                  <SelectValue>
                    {getStatusBadge(order.status)}
                  </SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="pending">Pending</SelectItem>
                  <SelectItem value="confirmed">Confirmed</SelectItem>
                  <SelectItem value="ready_for_pickup">Ready</SelectItem>
                  <SelectItem value="picked_up">Picked Up</SelectItem>
                  <SelectItem value="cancelled">Cancelled</SelectItem>
                </SelectContent>
              </Select>
            </TableCell>
            <TableCell>{formatDate(order.created_at)}</TableCell>
            <TableCell>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onViewDetails(order)}
              >
                <Eye className="w-4 h-4" />
              </Button>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default OrdersTable;
