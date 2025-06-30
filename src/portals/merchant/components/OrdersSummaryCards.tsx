
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  DollarSign, 
  Calendar,
  XCircle
} from 'lucide-react';

interface OrdersStats {
  total_orders: number;
  pending_orders: number;
  ready_orders: number;
  total_revenue: number;
  today_orders: number;
  cancelled_orders: number;
}

interface OrdersSummaryCardsProps {
  stats: OrdersStats;
}

const OrdersSummaryCards: React.FC<OrdersSummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Orders',
      value: stats.total_orders,
      icon: ShoppingCart,
      color: 'text-blue-600'
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders,
      icon: Clock,
      color: 'text-yellow-600'
    },
    {
      title: 'Ready for Pickup',
      value: stats.ready_orders,
      icon: CheckCircle,
      color: 'text-green-600'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.total_revenue.toFixed(2)}`,
      icon: DollarSign,
      color: 'text-emerald-600'
    },
    {
      title: 'Today\'s Orders',
      value: stats.today_orders,
      icon: Calendar,
      color: 'text-purple-600'
    },
    {
      title: 'Cancelled Orders',
      value: stats.cancelled_orders,
      icon: XCircle,
      color: 'text-red-600'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-4">
      {cards.map((card, index) => {
        const Icon = card.icon;
        return (
          <Card key={index}>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {card.title}
              </CardTitle>
              <Icon className={`w-4 h-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                {card.value}
              </div>
            </CardContent>
          </Card>
        );
      })}
    </div>
  );
};

export default OrdersSummaryCards;
