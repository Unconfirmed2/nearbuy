
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  CreditCard, 
  Zap, 
  Package, 
  BarChart3, 
  Mail, 
  MessageSquare,
  ShoppingCart,
  Webhook,
  Settings
} from 'lucide-react';
import POSIntegration from '../components/POSIntegration';

const Integrations: React.FC = () => {
  const paymentIntegrations = [
    {
      name: 'Stripe',
      description: 'Accept credit cards and process payments',
      icon: CreditCard,
      status: 'available',
      connected: false
    },
    {
      name: 'PayPal',
      description: 'PayPal payment processing',
      icon: CreditCard,
      status: 'available',
      connected: false
    },
    {
      name: 'Square',
      description: 'Square payment processing and POS',
      icon: CreditCard,
      status: 'available',
      connected: false
    }
  ];

  const marketingIntegrations = [
    {
      name: 'Mailchimp',
      description: 'Email marketing and automation',
      icon: Mail,
      status: 'available',
      connected: false
    },
    {
      name: 'Google Analytics',
      description: 'Track website and store performance',
      icon: BarChart3,
      status: 'available',
      connected: false
    },
    {
      name: 'Facebook Pixel',
      description: 'Track conversions and retarget customers',
      icon: MessageSquare,
      status: 'available',
      connected: false
    }
  ];

  const inventoryIntegrations = [
    {
      name: 'TradeGecko',
      description: 'Inventory management system',
      icon: Package,
      status: 'available',
      connected: false
    },
    {
      name: 'Cin7',
      description: 'Inventory and order management',
      icon: Package,
      status: 'available',
      connected: false
    },
    {
      name: 'Stocky',
      description: 'Inventory planning and forecasting',
      icon: Package,
      status: 'coming_soon',
      connected: false
    }
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'connected':
        return <Badge className="bg-green-100 text-green-800">Connected</Badge>;
      case 'available':
        return <Badge variant="outline">Available</Badge>;
      case 'coming_soon':
        return <Badge className="bg-blue-100 text-blue-800">Coming Soon</Badge>;
      default:
        return <Badge variant="outline">Unknown</Badge>;
    }
  };

  const IntegrationCard: React.FC<{
    integration: any;
    onConnect: () => void;
  }> = ({ integration, onConnect }) => {
    const Icon = integration.icon;
    
    return (
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <div className="flex items-center gap-3">
            <Icon className="w-6 h-6" />
            <div>
              <CardTitle className="text-base">{integration.name}</CardTitle>
              <p className="text-sm text-gray-600">{integration.description}</p>
            </div>
          </div>
          {getStatusBadge(integration.status)}
        </CardHeader>
        <CardContent>
          <Button 
            onClick={onConnect}
            disabled={integration.status === 'coming_soon'}
            className="w-full"
            variant={integration.connected ? "outline" : "default"}
          >
            {integration.connected ? 'Configure' : 'Connect'}
          </Button>
        </CardContent>
      </Card>
    );
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Integrations</h1>
        <p className="text-gray-600 mt-2">
          Connect your favorite tools and services to streamline your business
        </p>
      </div>

      <Tabs defaultValue="pos" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="pos">POS Systems</TabsTrigger>
          <TabsTrigger value="payments">Payments</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="marketing">Marketing</TabsTrigger>
          <TabsTrigger value="webhooks">Webhooks</TabsTrigger>
        </TabsList>

        <TabsContent value="pos">
          <POSIntegration 
            merchantId="debug-merchant-id" 
            storeId="debug-store-id" 
          />
        </TabsContent>

        <TabsContent value="payments">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Payment Processing</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {paymentIntegrations.map(integration => (
                <IntegrationCard
                  key={integration.name}
                  integration={integration}
                  onConnect={() => console.log(`Connect ${integration.name}`)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="inventory">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Inventory Management</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {inventoryIntegrations.map(integration => (
                <IntegrationCard
                  key={integration.name}
                  integration={integration}
                  onConnect={() => console.log(`Connect ${integration.name}`)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="marketing">
          <div className="space-y-4">
            <h3 className="text-lg font-medium">Marketing & Analytics</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {marketingIntegrations.map(integration => (
                <IntegrationCard
                  key={integration.name}
                  integration={integration}
                  onConnect={() => console.log(`Connect ${integration.name}`)}
                />
              ))}
            </div>
          </div>
        </TabsContent>

        <TabsContent value="webhooks">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Webhook className="w-5 h-5" />
                Webhook Configuration
              </CardTitle>
              <p className="text-sm text-gray-600">
                Set up webhooks to receive real-time notifications about events in your store
              </p>
            </CardHeader>
            <CardContent>
              <div className="text-center py-12">
                <Webhook className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  Webhook Configuration Coming Soon
                </h3>
                <p className="text-gray-600 mb-6">
                  Configure webhooks to integrate with your existing systems
                </p>
                <Button disabled>
                  <Settings className="w-4 h-4 mr-2" />
                  Configure Webhooks
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Integrations;
