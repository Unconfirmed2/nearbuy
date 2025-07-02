
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Package, Calendar, MapPin, Receipt, RefreshCw } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'completed' | 'pending' | 'cancelled';
  total: number;
  items: Array<{
    name: string;
    quantity: number;
    price: number;
  }>;
  store: string;
  pickupDate?: string;
}

const OrderHistory: React.FC = () => {
  const navigate = useNavigate();
  const [orders] = useState<Order[]>([
    {
      id: '1',
      orderNumber: 'NB-2024-001',
      date: '2024-01-15',
      status: 'completed',
      total: 24.97,
      items: [
        { name: 'Organic Bananas', quantity: 2, price: 2.49 },
        { name: 'Artisan Bread', quantity: 1, price: 4.99 },
        { name: 'Local Honey', quantity: 1, price: 12.99 }
      ],
      store: 'Fresh Market',
      pickupDate: '2024-01-15'
    },
    {
      id: '2',
      orderNumber: 'NB-2024-002',
      date: '2024-01-10',
      status: 'completed',
      total: 15.48,
      items: [
        { name: 'Free-Range Eggs', quantity: 2, price: 5.49 },
        { name: 'Artisan Bread', quantity: 1, price: 4.99 }
      ],
      store: 'Green Grocer',
      pickupDate: '2024-01-10'
    }
  ]);

  const getStatusColor = (status: Order['status']) => {
    switch (status) {
      case 'completed':
        return 'bg-green-100 text-green-800';
      case 'pending':
        return 'bg-yellow-100 text-yellow-800';
      case 'cancelled':
        return 'bg-red-100 text-red-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  const handleReorder = (order: Order) => {
    // In a real app, this would add items back to cart
    
    navigate('/consumer/cart');
  };

  if (orders.length === 0) {
    return (
      <div className="text-center py-12">
        <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-4">No orders yet</h1>
        <p className="text-gray-600 mb-6">
          When you place orders, they'll appear here.
        </p>
        <Button onClick={() => navigate('/consumer')}>
          Start Shopping
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Order History</h1>
        <Badge variant="secondary">{orders.length} orders</Badge>
      </div>

      <div className="space-y-4">
        {orders.map((order) => (
          <Card key={order.id}>
            <CardHeader>
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg">{order.orderNumber}</CardTitle>
                  <div className="flex items-center space-x-4 mt-2 text-sm text-gray-600">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(order.date).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <MapPin className="h-4 w-4 mr-1" />
                      {order.store}
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <Badge className={getStatusColor(order.status)}>
                    {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                  </Badge>
                  <p className="text-lg font-bold mt-1">${order.total.toFixed(2)}</p>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                <div>
                  <h4 className="font-medium mb-2">Items ({order.items.length})</h4>
                  <div className="space-y-1">
                    {order.items.map((item, index) => (
                      <div key={index} className="flex justify-between text-sm">
                        <span>{item.quantity}x {item.name}</span>
                        <span>${(item.quantity * item.price).toFixed(2)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                
                {order.pickupDate && (
                  <div className="text-sm text-gray-600">
                    <strong>Pickup Date:</strong> {new Date(order.pickupDate).toLocaleDateString()}
                  </div>
                )}

                <div className="flex space-x-2 pt-3">
                  <Button size="sm" variant="outline" onClick={() => handleReorder(order)}>
                    <RefreshCw className="h-4 w-4 mr-2" />
                    Reorder
                  </Button>
                  <Button size="sm" variant="outline">
                    <Receipt className="h-4 w-4 mr-2" />
                    View Receipt
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
