
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Zap, Settings, Plus, RefreshCw } from 'lucide-react';
import { toast } from 'sonner';

interface POSIntegrationProps {
  merchantId?: string;
  storeId?: string;
  integrations?: any[];
  onConnect?: (provider: string, credentials: any) => void;
  onSync?: (integrationId: string) => void;
}

const POSIntegration: React.FC<POSIntegrationProps> = ({
  merchantId,
  storeId,
  integrations: externalIntegrations,
  onConnect,
  onSync
}) => {
  const [showConnectDialog, setShowConnectDialog] = useState(false);
  const [selectedProvider, setSelectedProvider] = useState('');
  const [credentials, setCredentials] = useState<any>({});
  const [connecting, setConnecting] = useState(false);

  // Mock integrations data
  const [integrations, setIntegrations] = useState(externalIntegrations || []);

  const posProviders = [
    {
      id: 'square',
      name: 'Square',
      description: 'Connect your Square POS system',
      fields: [
        { key: 'applicationId', label: 'Application ID', type: 'text' },
        { key: 'accessToken', label: 'Access Token', type: 'password' }
      ]
    },
    {
      id: 'shopify',
      name: 'Shopify',
      description: 'Sync with your Shopify store',
      fields: [
        { key: 'shopName', label: 'Shop Name', type: 'text' },
        { key: 'apiKey', label: 'API Key', type: 'password' },
        { key: 'apiSecret', label: 'API Secret', type: 'password' }
      ]
    },
    {
      id: 'lightspeed',
      name: 'Lightspeed',
      description: 'Connect to Lightspeed Retail',
      fields: [
        { key: 'accountId', label: 'Account ID', type: 'text' },
        { key: 'clientId', label: 'Client ID', type: 'text' },
        { key: 'clientSecret', label: 'Client Secret', type: 'password' }
      ]
    },
    {
      id: 'clover',
      name: 'Clover',
      description: 'Integrate with Clover POS',
      fields: [
        { key: 'merchantId', label: 'Merchant ID', type: 'text' },
        { key: 'accessToken', label: 'Access Token', type: 'password' }
      ]
    }
  ];

  const handleConnect = async () => {
    if (!selectedProvider || !credentials) return;

    try {
      setConnecting(true);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      const newIntegration = {
        id: `integration-${Date.now()}`,
        provider: selectedProvider,
        status: 'connected',
        lastSynced: new Date().toISOString(),
        credentials: credentials
      };

      if (onConnect) {
        onConnect(selectedProvider, credentials);
      } else {
        setIntegrations([...integrations, newIntegration]);
      }

      setShowConnectDialog(false);
      setSelectedProvider('');
      setCredentials({});
      toast.success(`${posProviders.find(p => p.id === selectedProvider)?.name} connected successfully`);
    } catch (error) {
      toast.error('Failed to connect POS system');
    } finally {
      setConnecting(false);
    }
  };

  const handleSync = async (integrationId: string) => {
    try {
      if (onSync) {
        onSync(integrationId);
      } else {
        // Update last synced time
        setIntegrations(prev => 
          prev.map(integration =>
            integration.id === integrationId
              ? { ...integration, lastSynced: new Date().toISOString() }
              : integration
          )
        );
      }
      toast.success('Sync completed successfully');
    } catch (error) {
      toast.error('Sync failed');
    }
  };

  const selectedProviderInfo = posProviders.find(p => p.id === selectedProvider);

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Store className="w-5 h-5" />
            POS Integrations
          </CardTitle>
          <Dialog open={showConnectDialog} onOpenChange={setShowConnectDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Connect POS
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Connect POS System</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>POS Provider</Label>
                  <Select value={selectedProvider} onValueChange={setSelectedProvider}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select POS provider" />
                    </SelectTrigger>
                    <SelectContent>
                      {posProviders.map(provider => (
                        <SelectItem key={provider.id} value={provider.id}>
                          {provider.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                {selectedProviderInfo && (
                  <div className="space-y-3">
                    <p className="text-sm text-gray-600">{selectedProviderInfo.description}</p>
                    {selectedProviderInfo.fields.map(field => (
                      <div key={field.key}>
                        <Label>{field.label}</Label>
                        <Input
                          type={field.type}
                          value={credentials[field.key] || ''}
                          onChange={(e) => setCredentials(prev => ({
                            ...prev,
                            [field.key]: e.target.value
                          }))}
                          placeholder={`Enter ${field.label.toLowerCase()}`}
                        />
                      </div>
                    ))}
                  </div>
                )}

                <div className="flex gap-2">
                  <Button 
                    onClick={handleConnect} 
                    disabled={!selectedProvider || connecting}
                    className="flex-1"
                  >
                    {connecting ? 'Connecting...' : 'Connect'}
                  </Button>
                  <Button 
                    variant="outline" 
                    onClick={() => setShowConnectDialog(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
        <p className="text-sm text-gray-600">
          Connect your Point of Sale system to sync inventory and orders
        </p>
      </CardHeader>
      <CardContent>
        {integrations.length === 0 ? (
          <div className="text-center py-8">
            <Store className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No POS integrations</h3>
            <p className="text-gray-600 mb-4">Connect your POS system to sync products and inventory</p>
            <Button onClick={() => setShowConnectDialog(true)}>
              <Plus className="w-4 h-4 mr-2" />
              Connect Your First POS
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {integrations.map(integration => {
              const provider = posProviders.find(p => p.id === integration.provider);
              return (
                <div key={integration.id} className="flex items-center justify-between p-4 border rounded-lg">
                  <div className="flex items-center gap-3">
                    <Zap className="w-5 h-5 text-green-600" />
                    <div>
                      <h4 className="font-medium">{provider?.name || integration.provider}</h4>
                      <p className="text-sm text-gray-600">
                        Last synced: {new Date(integration.lastSynced).toLocaleString()}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge className="bg-green-100 text-green-800">Connected</Badge>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => handleSync(integration.id)}
                    >
                      <RefreshCw className="w-4 h-4 mr-1" />
                      Sync
                    </Button>
                    <Button variant="outline" size="sm">
                      <Settings className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default POSIntegration;
