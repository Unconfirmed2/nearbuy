
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { 
  CreditCard, 
  ShoppingCart, 
  Package, 
  Zap, 
  Settings,
  CheckCircle,
  AlertCircle,
  ExternalLink
} from 'lucide-react';
import { toast } from 'sonner';

const Integrations: React.FC = () => {
  const [stripeConnected, setStripeConnected] = useState(false);
  const [posConnections, setPosConnections] = useState({
    shopify: false,
    square: false,
    lightspeed: false,
    clover: false
  });

  const [webhookSettings, setWebhookSettings] = useState({
    inventory_sync: true,
    order_updates: true,
    price_changes: false
  });

  const handleStripeConnect = () => {
    // Simulate Stripe connection
    setTimeout(() => {
      setStripeConnected(true);
      toast.success('Stripe account connected successfully');
    }, 1500);
  };

  const handlePosConnect = (platform: string) => {
    setPosConnections(prev => ({
      ...prev,
      [platform]: !prev[platform as keyof typeof prev]
    }));
    toast.success(`${platform} ${posConnections[platform as keyof typeof posConnections] ? 'disconnected' : 'connected'}`);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold flex items-center gap-3">
          <Zap className="w-8 h-8" />
          Integrations
        </h1>
        <p className="text-gray-600 mt-2">
          Connect your external systems and automate your workflow
        </p>
      </div>

      {/* Payment Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <CreditCard className="w-5 h-5" />
            Payment Processing
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between p-4 border rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <CreditCard className="w-6 h-6 text-purple-600" />
              </div>
              <div>
                <h4 className="font-medium">Stripe</h4>
                <p className="text-sm text-gray-600">Accept payments and manage payouts</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              {stripeConnected ? (
                <Badge className="bg-green-100 text-green-800">
                  <CheckCircle className="w-3 h-3 mr-1" />
                  Connected
                </Badge>
              ) : (
                <Badge className="bg-gray-100 text-gray-800">
                  <AlertCircle className="w-3 h-3 mr-1" />
                  Not Connected
                </Badge>
              )}
              <Button
                onClick={handleStripeConnect}
                disabled={stripeConnected}
                size="sm"
              >
                {stripeConnected ? 'Manage' : 'Connect'}
              </Button>
            </div>
          </div>

          {stripeConnected && (
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <div className="flex items-center gap-2 text-green-800 mb-2">
                <CheckCircle className="w-4 h-4" />
                <span className="font-medium">Stripe Account Active</span>
              </div>
              <p className="text-green-700 text-sm">
                Your Stripe account is connected and ready to process payments. 
                Commission: 2.9% + 30¢ per transaction.
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* POS Integration */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <ShoppingCart className="w-5 h-5" />
            Point of Sale (POS) Systems
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          {[
            { key: 'shopify', name: 'Shopify POS', description: 'Sync products and inventory with Shopify' },
            { key: 'square', name: 'Square POS', description: 'Connect your Square terminal and inventory' },
            { key: 'lightspeed', name: 'Lightspeed', description: 'Integrate with Lightspeed Retail' },
            { key: 'clover', name: 'Clover', description: 'Connect your Clover POS system' }
          ].map(pos => (
            <div key={pos.key} className="flex items-center justify-between p-4 border rounded-lg">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <ShoppingCart className="w-6 h-6 text-blue-600" />
                </div>
                <div>
                  <h4 className="font-medium">{pos.name}</h4>
                  <p className="text-sm text-gray-600">{pos.description}</p>
                </div>
              </div>
              <div className="flex items-center gap-3">
                {posConnections[pos.key as keyof typeof posConnections] ? (
                  <Badge className="bg-green-100 text-green-800">
                    <CheckCircle className="w-3 h-3 mr-1" />
                    Connected
                  </Badge>
                ) : (
                  <Badge className="bg-gray-100 text-gray-800">
                    Not Connected
                  </Badge>
                )}
                <Button
                  onClick={() => handlePosConnect(pos.key)}
                  variant={posConnections[pos.key as keyof typeof posConnections] ? "outline" : "default"}
                  size="sm"
                >
                  {posConnections[pos.key as keyof typeof posConnections] ? 'Disconnect' : 'Connect'}
                </Button>
              </div>
            </div>
          ))}
        </CardContent>
      </Card>

      {/* Inventory Management */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="inventory-sync">Real-time Inventory Sync</Label>
                <p className="text-sm text-gray-600">Automatically sync inventory changes</p>
              </div>
              <Switch
                id="inventory-sync"
                checked={webhookSettings.inventory_sync}
                onCheckedChange={(checked) => 
                  setWebhookSettings(prev => ({ ...prev, inventory_sync: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="order-updates">Order Status Updates</Label>
                <p className="text-sm text-gray-600">Push order status changes to POS</p>
              </div>
              <Switch
                id="order-updates"
                checked={webhookSettings.order_updates}
                onCheckedChange={(checked) => 
                  setWebhookSettings(prev => ({ ...prev, order_updates: checked }))
                }
              />
            </div>

            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="price-changes">Price Change Notifications</Label>
                <p className="text-sm text-gray-600">Get notified when prices change in POS</p>
              </div>
              <Switch
                id="price-changes"
                checked={webhookSettings.price_changes}
                onCheckedChange={(checked) => 
                  setWebhookSettings(prev => ({ ...prev, price_changes: checked }))
                }
              />
            </div>
          </div>

          <div className="border-t pt-4">
            <Label htmlFor="webhook-url">Webhook URL</Label>
            <Input
              id="webhook-url"
              value="https://api.nearbuy.com/webhooks/merchant/inventory"
              readOnly
              className="mt-2 bg-gray-50"
            />
            <p className="text-xs text-gray-500 mt-1">
              Use this URL in your POS system to send inventory updates
            </p>
          </div>
        </CardContent>
      </Card>

      {/* API Access */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Settings className="w-5 h-5" />
            API Access
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h4 className="font-medium text-blue-900 mb-2">Developer API</h4>
            <p className="text-blue-700 text-sm mb-3">
              Build custom integrations with our REST API. Perfect for connecting 
              custom POS systems or building automated workflows.
            </p>
            <div className="flex gap-2">
              <Button variant="outline" size="sm">
                <ExternalLink className="w-4 h-4 mr-2" />
                View Documentation
              </Button>
              <Button variant="outline" size="sm">
                Generate API Key
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default Integrations;
