
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Zap, CreditCard, Package, Webhook } from 'lucide-react';
import POSIntegration from '../components/POSIntegration';

const Integrations: React.FC = () => {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-gray-600 mt-2">
          Connect your store with external systems and services
        </p>
      </div>

      <Tabs defaultValue="pos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="pos">POS Systems</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="pos">
          <POSIntegration storeId="debug-store-id" />
        </TabsContent>

        <TabsContent value="payments">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CreditCard className="w-5 h-5" />
                Payment Integration
              </CardTitle>
              <p className="text-sm text-gray-600">
                Connect payment processors for order attribution and payouts
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Payment Integration Coming Soon
                </h3>
                <p className="text-gray-600">
                  Connect Stripe, PayPal, and other payment processors
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="inventory">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Package className="w-5 h-5" />
                Inventory Management Systems
              </CardTitle>
              <p className="text-sm text-gray-600">
                Sync inventory with external management systems
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  IMS Integration Coming Soon
                </h3>
                <p className="text-gray-600">
                  Real-time inventory sync with your management system
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Webhooks
              </CardTitle>
              <p className="text-sm text-gray-600">
                Set up webhooks for real-time event notifications
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Webhook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Webhooks Coming Soon
                </h3>
                <p className="text-gray-600">
                  Receive real-time notifications for orders, inventory changes, and more
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
