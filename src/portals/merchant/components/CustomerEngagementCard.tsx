
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Heart, MessageSquare, Star, TrendingUp, Users } from 'lucide-react';

interface CustomerEngagementData {
  total_favorites: number;
  recent_favorites: number;
  pending_reviews: number;
  average_rating: number;
  total_reviews: number;
  repeat_customers: number;
  new_customers: number;
}

interface CustomerEngagementCardProps {
  data: CustomerEngagementData;
  onViewFavorites: () => void;
  onViewReviews: () => void;
  onViewCustomers: () => void;
}

const CustomerEngagementCard: React.FC<CustomerEngagementCardProps> = ({
  data,
  onViewFavorites,
  onViewReviews,
  onViewCustomers
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Product Favorites</CardTitle>
          <Heart className="h-4 w-4 text-red-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{data.total_favorites || 0}</div>
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <TrendingUp className="h-3 w-3" />
            +{data.recent_favorites || 0} this week
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={onViewFavorites}>
            View Details
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Reviews</CardTitle>
          <MessageSquare className="h-4 w-4 text-blue-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold flex items-center gap-2">
            {(data.average_rating || 0).toFixed(1)}
            <Star className="h-5 w-5 fill-yellow-400 text-yellow-400" />
          </div>
          <div className="text-xs text-muted-foreground">
            {data.total_reviews || 0} total reviews
          </div>
          {(data.pending_reviews || 0) > 0 && (
            <Badge variant="outline" className="mt-2">
              {data.pending_reviews} pending responses
            </Badge>
          )}
          <Button variant="outline" size="sm" className="mt-3" onClick={onViewReviews}>
            Manage Reviews
          </Button>
        </CardContent>
      </Card>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Customer Base</CardTitle>
          <Users className="h-4 w-4 text-green-500" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">{(data.repeat_customers || 0) + (data.new_customers || 0)}</div>
          <div className="text-xs text-muted-foreground">
            {data.repeat_customers || 0} repeat • {data.new_customers || 0} new
          </div>
          <div className="text-xs text-green-600 mt-1">
            {data.repeat_customers || data.new_customers ? 
              Math.round(((data.repeat_customers || 0) / ((data.repeat_customers || 0) + (data.new_customers || 0))) * 100) 
              : 0}% retention rate
          </div>
          <Button variant="outline" size="sm" className="mt-3" onClick={onViewCustomers}>
            View Customers
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default CustomerEngagementCard;
