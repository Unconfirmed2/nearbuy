
import React from 'react';
import { useAuth } from '../hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Star, MessageSquare, Heart, TrendingUp } from 'lucide-react';
import ReviewManager from '../components/ReviewManager';
import CustomerEngagement from '../components/CustomerEngagement';

const Reviews: React.FC = () => {
  const { user } = useAuth();
  
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Reviews & Customer Engagement</h1>
        <p className="text-gray-600 mt-2">
          Manage customer reviews and track engagement metrics
        </p>
      </div>

      <Tabs defaultValue="reviews" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="reviews" className="flex items-center gap-2">
            <Star className="w-4 h-4" />
            Reviews
          </TabsTrigger>
          <TabsTrigger value="engagement" className="flex items-center gap-2">
            <Heart className="w-4 h-4" />
            Customer Engagement
          </TabsTrigger>
          <TabsTrigger value="analytics" className="flex items-center gap-2">
            <TrendingUp className="w-4 h-4" />
            Review Analytics
          </TabsTrigger>
        </TabsList>

        <TabsContent value="reviews">
          <ReviewManager merchantId={user?.id || ''} />
        </TabsContent>

        <TabsContent value="engagement">
          <CustomerEngagement merchantId={user?.id || ''} />
        </TabsContent>

        <TabsContent value="analytics">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <TrendingUp className="w-5 h-5" />
                Review Analytics
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <MessageSquare className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Advanced Review Analytics Coming Soon
                </h3>
                <p className="text-gray-600">
                  Detailed insights into customer feedback trends and sentiment analysis
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Reviews;
