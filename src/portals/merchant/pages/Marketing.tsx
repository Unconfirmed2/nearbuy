
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { TrendingUp, Target, Star, Users, Megaphone, Gift } from 'lucide-react';
import { useStores } from '../hooks/useStores';
import { useProducts } from '../hooks/useProducts';
import PromotionsManager from '../components/PromotionsManager';
import BulkProductUpload from '../components/BulkProductUpload';

const Marketing: React.FC = () => {
  const { stores } = useStores('debug-merchant-id');
  const { products, refetch } = useProducts('debug-merchant-id');
  const [activeTab, setActiveTab] = useState('promotions');

  const mockReviews = [
    {
      id: 'review-1',
      customer: 'John Doe',
      product: 'iPhone 15 Pro',
      rating: 5,
      comment: 'Great product, fast pickup service!',
      date: '2024-06-25',
      responded: false
    },
    {
      id: 'review-2',
      customer: 'Jane Smith',
      product: 'MacBook Air',
      rating: 4,
      comment: 'Good experience, would recommend.',
      date: '2024-06-20',
      responded: true
    }
  ];

  const mockSponsoredListings = [
    {
      id: 'sponsored-1',
      product: 'iPhone 15 Pro',
      bid_amount: 2.50,
      impressions: 1250,
      clicks: 45,
      orders: 3,
      spend: 112.50,
      revenue: 2697.00,
      status: 'active'
    }
  ];

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <Megaphone className="w-8 h-8" />
            Marketing
          </h1>
          <p className="text-gray-600 mt-2">
            Manage promotions, reviews, and marketing campaigns
          </p>
        </div>
      </div>

      {/* Marketing Overview */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                <TrendingUp className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">3</div>
                <div className="text-sm text-gray-600">Active Promotions</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center">
                <Star className="w-5 h-5 text-green-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">4.7</div>
                <div className="text-sm text-gray-600">Avg Rating</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-purple-100 rounded-full flex items-center justify-center">
                <Target className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">$112</div>
                <div className="text-sm text-gray-600">Ad Spend</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-6">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-orange-100 rounded-full flex items-center justify-center">
                <Users className="w-5 h-5 text-orange-600" />
              </div>
              <div>
                <div className="text-2xl font-bold">24</div>
                <div className="text-sm text-gray-600">New Reviews</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="reviews">Reviews</TabsTrigger>
          <TabsTrigger value="sponsored">Sponsored</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions" className="space-y-6">
          <PromotionsManager 
            storeId={stores[0]?.id || 'store-1'}
            products={products.map(p => ({ id: p.id, name: p.name }))}
          />
        </TabsContent>

        <TabsContent value="reviews" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Customer Reviews</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockReviews.map(review => (
                  <div key={review.id} className="border rounded-lg p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <span className="font-medium">{review.customer}</span>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <Star
                                key={i}
                                className={`w-4 h-4 ${
                                  i < review.rating
                                    ? 'text-yellow-400 fill-current'
                                    : 'text-gray-300'
                                }`}
                              />
                            ))}
                          </div>
                          <span className="text-sm text-gray-500">
                            {new Date(review.date).toLocaleDateString()}
                          </span>
                        </div>
                        <div className="text-sm text-gray-600 mb-2">{review.product}</div>
                        <p className="text-sm">{review.comment}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        {review.responded && (
                          <Badge className="bg-green-100 text-green-800">Responded</Badge>
                        )}
                        <Button variant="outline" size="sm">
                          {review.responded ? 'View Response' : 'Respond'}
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="sponsored" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Sponsored Product Listings</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockSponsoredListings.map(listing => (
                  <div key={listing.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h4 className="font-medium">{listing.product}</h4>
                        <div className="text-sm text-gray-600 mt-1">
                          Bid: ${listing.bid_amount}/click
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-sm">
                        <div className="text-center">
                          <div className="font-medium">{listing.impressions}</div>
                          <div className="text-gray-600">Impressions</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{listing.clicks}</div>
                          <div className="text-gray-600">Clicks</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">{listing.orders}</div>
                          <div className="text-gray-600">Orders</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium">${listing.spend}</div>
                          <div className="text-gray-600">Spend</div>
                        </div>
                        <div className="text-center">
                          <div className="font-medium text-green-600">${listing.revenue}</div>
                          <div className="text-gray-600">Revenue</div>
                        </div>
                        <Badge className={listing.status === 'active' ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                          {listing.status}
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 text-center">
                <Button>
                  <Target className="w-4 h-4 mr-2" />
                  Create Sponsored Listing
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="bulk-upload" className="space-y-6">
          <BulkProductUpload 
            storeId={stores[0]?.id || 'store-1'}
            onUploadComplete={refetch}
          />
        </TabsContent>

        <TabsContent value="referrals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gift className="w-5 h-5" />
                Referral Program
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center py-8">
                <Gift className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">Referral Program Coming Soon</h3>
                <p className="text-gray-600 mb-4">
                  Set up referral incentives to reward customers who bring in new business.
                </p>
                <Button disabled>
                  Set Up Referrals
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Marketing;
