
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus, TrendingUp, Target, Percent, Megaphone } from 'lucide-react';
import PromotionsManager from '../components/PromotionsManager';
import CouponManager from '../components/CouponManager';

const Marketing: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Marketing & Promotions</h1>
        <p className="text-gray-600 mt-2">
          Create campaigns, manage promotions, and boost your sales
        </p>
      </div>

      <Tabs defaultValue="promotions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="promotions">Promotions</TabsTrigger>
          <TabsTrigger value="coupons">Coupons</TabsTrigger>
          <TabsTrigger value="sponsored">Sponsored</TabsTrigger>
          <TabsTrigger value="referrals">Referrals</TabsTrigger>
        </TabsList>

        <TabsContent value="promotions">
          <PromotionsManager merchantId="debug-merchant-id" />
        </TabsContent>

        <TabsContent value="coupons">
          <CouponManager merchantId="debug-merchant-id" />
        </TabsContent>

        <TabsContent value="sponsored">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Target className="w-5 h-5" />
                Sponsored Listings
              </CardTitle>
              <p className="text-sm text-gray-600">
                Boost your product visibility with sponsored placements
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <TrendingUp className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Sponsored Listings Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  Feature your products at the top of search results and category pages
                </p>
                <Button disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Sponsored Campaign
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="referrals">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Megaphone className="w-5 h-5" />
                Referral Program
              </CardTitle>
              <p className="text-sm text-gray-600">
                Reward customers for bringing in new business
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Megaphone className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Referral Program Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  Set up rewards for customers who refer friends to your store
                </p>
                <Button disabled>
                  <Plus className="w-4 h-4 mr-2" />
                  Create Referral Program
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
