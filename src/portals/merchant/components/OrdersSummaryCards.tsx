
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { 
  ShoppingCart, 
  Clock, 
  CheckCircle, 
  DollarSign,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

interface OrdersSummaryCardsProps {
  stats: {
    total_orders: number;
    pending_orders: number;
    ready_orders: number;
    total_revenue: number;
    today_orders: number;
    cancelled_orders: number;
  };
}

const OrdersSummaryCards: React.FC<OrdersSummaryCardsProps> = ({ stats }) => {
  const cards = [
    {
      title: 'Total Orders',
      value: stats.total_orders,
      icon: <ShoppingCart className="w-5 h-5 text-blue-600" />,
      bgColor: 'bg-blue-50'
    },
    {
      title: 'Pending Orders',
      value: stats.pending_orders,
      icon: <Clock className="w-5 h-5 text-yellow-600" />,
      bgColor: 'bg-yellow-50',
      badge: stats.pending_orders > 0 ? 'urgent' : null
    },
    {
      title: 'Ready for Pickup',
      value: stats.ready_orders,
      icon: <CheckCircle className="w-5 h-5 text-green-600" />,
      bgColor: 'bg-green-50'
    },
    {
      title: 'Total Revenue',
      value: `$${stats.total_revenue.toLocaleString()}`,
      icon: <DollarSign className="w-5 h-5 text-emerald-600" />,
      bgColor: 'bg-emerald-50'
    },
    {
      title: 'Today\'s Orders',
      value: stats.today_orders,
      icon: <TrendingUp className="w-5 h-5 text-purple-600" />,
      bgColor: 'bg-purple-50'
    },
    {
      title: 'Cancelled Orders',
      value: stats.cancelled_orders,
      icon: <AlertCircle className="w-5 h-5 text-red-600" />,
      bgColor: 'bg-red-50'
    }
  ];

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
      {cards.map((card, index) => (
        <Card key={index}>
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg ${card.bgColor}`}>
                {card.icon}
              </div>
              {card.badge && (
                <Badge variant="destructive" className="text-xs">
                  Action Required
                </Badge>
              )}
            </div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{card.value}</div>
            <p className="text-xs text-gray-600">{card.title}</p>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default OrdersSummaryCards;
