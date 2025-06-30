
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { Switch } from '@/components/ui/switch';
import { Zap, CheckCircle, AlertCircle, RefreshCw, Settings } from 'lucide-react';
import { toast } from 'sonner';

interface POSIntegration {
  id: string;
  provider: string;
  logo: string;
  name: string;
  description: string;
  connected: boolean;
  last_sync?: string;
  config?: {
    api_key?: string;
    store_id?: string;
    sync_frequency?: string;
    auto_sync?: boolean;
  };
}

interface POSIntegrationProps {
  storeId: string;
}

const POSIntegration: React.FC<POSIntegrationProps> = ({ storeId }) => {
  const [integrations, setIntegrations] = useState<POSIntegration[]>([
    {
      id: '1',
      provider: 'shopify',
      logo: '🛍️',
      name: 'Shopify',
      description: 'Sync products and inventory with your Shopify store',
      connected: true,
      last_sync: '2024-01-15T10:30:00Z',
      config: {
        store_id: 'my-store.myshopify.com',
        sync_frequency: 'hourly',
        auto_sync: true
      }
    },
    {
      id: '2',
      provider: 'square',
      logo: '⬜',
      name: 'Square',
      description: 'Connect your Square POS system',
      connected: false
    },
    {
      id: '3',
      provider: 'lightspeed',
      logo: '⚡',
      name: 'Lightspeed',
      description: 'Sync with Lightspeed Retail POS',
      connected: false
    },
    {
      id: '4',
      provider: 'clover',
      logo: '🍀',
      name: 'Clover',
      description: 'Integrate with Clover POS',
      connected: false
    }
  ]);

  const [connectionData, setConnectionData] = useState<{[key: string]: any}>({});
  const [showConnectionForm, setShowConnectionForm] = useState<{[key: string]: boolean}>({});
  const [syncing, setSyncing] = useState<{[key: string]: boolean}>({});

  const handleConnect = (integrationId: string) => {
    const data = connectionData[integrationId];
    if (!data?.api_key || !data?.store_id) {
      toast.error('Please fill in all required fields');
      return;
    }

    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? {
            ...integration,
            connected: true,
            config: {
              ...data,
              sync_frequency: 'hourly',
              auto_sync: true
            },
            last_sync: new Date().toISOString()
          }
        : integration
    ));

    setShowConnectionForm(prev => ({ ...prev, [integrationId]: false }));
    setConnectionData(prev => ({ ...prev, [integrationId]: {} }));
    toast.success('Integration connected successfully');
  };

  const handleDisconnect = (integrationId: string) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, connected: false, config: undefined, last_sync: undefined }
        : integration
    ));
    toast.success('Integration disconnected');
  };

  const handleSync = async (integrationId: string) => {
    setSyncing(prev => ({ ...prev, [integrationId]: true }));
    
    // Simulate sync process
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? { ...integration, last_sync: new Date().toISOString() }
        : integration
    ));
    
    setSyncing(prev => ({ ...prev, [integrationId]: false }));
    toast.success('Sync completed successfully');
  };

  const updateIntegrationConfig = (integrationId: string, key: string, value: any) => {
    setIntegrations(prev => prev.map(integration =>
      integration.id === integrationId
        ? {
            ...integration,
            config: { ...integration.config, [key]: value }
          }
        : integration
    ));
  };

  const renderConnectionForm = (integration: POSIntegration) => {
    if (!showConnectionForm[integration.id]) return null;

    return (
      <div className="mt-4 p-4 border rounded-lg space-y-4">
        <h4 className="font-medium">Connect {integration.name}</h4>
        
        <div className="grid grid-cols-1 gap-4">
          <div>
            <Label>API Key *</Label>
            <Input
              type="password"
              placeholder="Enter your API key"
              value={connectionData[integration.id]?.api_key || ''}
              onChange={(e) => setConnectionData(prev => ({
                ...prev,
                [integration.id]: { ...prev[integration.id], api_key: e.target.value }
              }))}
            />
          </div>
          
          <div>
            <Label>Store ID *</Label>
            <Input
              placeholder="Enter your store ID"
              value={connectionData[integration.id]?.store_id || ''}
              onChange={(e) => setConnectionData(prev => ({
                ...prev,
                [integration.id]: { ...prev[integration.id], store_id: e.target.value }
              }))}
            />
          </div>
        </div>
        
        <div className="flex gap-2">
          <Button onClick={() => handleConnect(integration.id)}>
            Connect
          </Button>
          <Button 
            variant="outline" 
            onClick={() => setShowConnectionForm(prev => ({ ...prev, [integration.id]: false }))}
          >
            Cancel
          </Button>
        </div>
      </div>
    );
  };

  const renderConnectedIntegration = (integration: POSIntegration) => {
    if (!integration.connected) return null;

    return (
      <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <CheckCircle className="w-4 h-4 text-green-600" />
            <span className="text-green-800 font-medium">Connected</span>
          </div>
          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleSync(integration.id)}
              disabled={syncing[integration.id]}
            >
              {syncing[integration.id] ? (
                <RefreshCw className="w-3 h-3 mr-1 animate-spin" />
              ) : (
                <RefreshCw className="w-3 h-3 mr-1" />
              )}
              Sync Now
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleDisconnect(integration.id)}
              className="text-red-600 hover:text-red-800"
            >
              Disconnect
            </Button>
          </div>
        </div>

        {integration.last_sync && (
          <p className="text-sm text-green-700">
            Last synced: {new Date(integration.last_sync).toLocaleString()}
          </p>
        )}

        <Separator />

        <div className="space-y-3">
          <h5 className="font-medium flex items-center gap-2">
            <Settings className="w-4 h-4" />
            Sync Settings
          </h5>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <Label>Sync Frequency</Label>
              <Select
                value={integration.config?.sync_frequency || 'hourly'}
                onValueChange={(value) => updateIntegrationConfig(integration.id, 'sync_frequency', value)}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="realtime">Real-time</SelectItem>
                  <SelectItem value="hourly">Every Hour</SelectItem>
                  <SelectItem value="daily">Daily</SelectItem>
                  <SelectItem value="manual">Manual Only</SelectItem>
                </SelectContent>
              </Select>
            </div>
            
            <div className="flex items-center space-x-2">
              <Switch
                checked={integration.config?.auto_sync || false}
                onCheckedChange={(checked) => updateIntegrationConfig(integration.id, 'auto_sync', checked)}
              />
              <Label>Auto Sync</Label>
            </div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Zap className="w-5 h-5" />
          POS Integrations
        </CardTitle>
        <p className="text-sm text-gray-600">
          Connect your Point of Sale system to sync products and inventory automatically
        </p>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {integrations.map(integration => (
            <div key={integration.id} className="border rounded-lg p-4">
              <div className="flex items-start justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className="text-2xl">{integration.logo}</div>
                  <div>
                    <h3 className="font-medium flex items-center gap-2">
                      {integration.name}
                      {integration.connected && (
                        <Badge className="bg-green-100 text-green-800">Connected</Badge>
                      )}
                    </h3>
                    <p className="text-sm text-gray-600">{integration.description}</p>
                  </div>
                </div>
                
                {!integration.connected && (
                  <Button
                    variant="outline"
                    onClick={() => setShowConnectionForm(prev => ({ ...prev, [integration.id]: true }))}
                    disabled={showConnectionForm[integration.id]}
                  >
                    Connect
                  </Button>
                )}
              </div>

              {renderConnectionForm(integration)}
              {renderConnectedIntegration(integration)}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default POSIntegration;
