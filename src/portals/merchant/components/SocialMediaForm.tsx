
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { 
  Facebook, 
  Instagram, 
  Twitter, 
  Linkedin,
  Link,
  CheckCircle,
  AlertCircle
} from 'lucide-react';
import { toast } from 'sonner';

interface SocialMediaFormProps {
  merchantId: string;
}

const SocialMediaForm: React.FC<SocialMediaFormProps> = ({ merchantId }) => {
  const [socialAccounts, setSocialAccounts] = useState({
    facebook: { url: '', connected: false, auto_post: false },
    instagram: { url: '', connected: false, auto_post: false },
    twitter: { url: '', connected: false, auto_post: false },
    linkedin: { url: '', connected: false, auto_post: false }
  });

  const [loading, setLoading] = useState(false);

  const platforms = [
    {
      key: 'facebook',
      name: 'Facebook',
      icon: <Facebook className="w-5 h-5" />,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'instagram',
      name: 'Instagram',
      icon: <Instagram className="w-5 h-5" />,
      color: 'text-pink-600',
      bgColor: 'bg-pink-50'
    },
    {
      key: 'twitter',
      name: 'Twitter',
      icon: <Twitter className="w-5 h-5" />,
      color: 'text-blue-500',
      bgColor: 'bg-blue-50'
    },
    {
      key: 'linkedin',
      name: 'LinkedIn',
      icon: <Linkedin className="w-5 h-5" />,
      color: 'text-blue-700',
      bgColor: 'bg-blue-50'
    }
  ];

  const handleConnect = async (platform: string) => {
    setLoading(true);
    try {
      // Simulate OAuth connection
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      setSocialAccounts(prev => ({
        ...prev,
        [platform]: {
          ...prev[platform as keyof typeof prev],
          connected: true
        }
      }));
      
      toast.success(`${platform} connected successfully!`);
    } catch (error) {
      toast.error(`Failed to connect ${platform}`);
    } finally {
      setLoading(false);
    }
  };

  const handleDisconnect = (platform: string) => {
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        connected: false,
        auto_post: false
      }
    }));
    toast.success(`${platform} disconnected`);
  };

  const handleAutoPostToggle = (platform: string, enabled: boolean) => {
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        auto_post: enabled
      }
    }));
  };

  const handleUrlChange = (platform: string, url: string) => {
    setSocialAccounts(prev => ({
      ...prev,
      [platform]: {
        ...prev[platform as keyof typeof prev],
        url
      }
    }));
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Link className="w-5 h-5" />
          Social Media Integration
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {platforms.map(platform => {
          const account = socialAccounts[platform.key as keyof typeof socialAccounts];
          
          return (
            <div key={platform.key} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${platform.bgColor}`}>
                    <span className={platform.color}>{platform.icon}</span>
                  </div>
                  <div>
                    <h4 className="font-medium">{platform.name}</h4>
                    <div className="flex items-center gap-2 text-sm">
                      {account.connected ? (
                        <span className="flex items-center gap-1 text-green-600">
                          <CheckCircle className="w-3 h-3" />
                          Connected
                        </span>
                      ) : (
                        <span className="flex items-center gap-1 text-gray-500">
                          <AlertCircle className="w-3 h-3" />
                          Not connected
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                {account.connected ? (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleDisconnect(platform.key)}
                  >
                    Disconnect
                  </Button>
                ) : (
                  <Button
                    size="sm"
                    onClick={() => handleConnect(platform.key)}
                    disabled={loading}
                  >
                    {loading ? 'Connecting...' : 'Connect'}
                  </Button>
                )}
              </div>
              
              <div className="space-y-3">
                <div>
                  <Label htmlFor={`${platform.key}-url`}>
                    {platform.name} Page URL
                  </Label>
                  <Input
                    id={`${platform.key}-url`}
                    placeholder={`https://${platform.key}.com/yourpage`}
                    value={account.url}
                    onChange={(e) => handleUrlChange(platform.key, e.target.value)}
                  />
                </div>
                
                {account.connected && (
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor={`${platform.key}-autopost`}>
                        Auto-post new products
                      </Label>
                      <p className="text-sm text-gray-600">
                        Automatically share new products to {platform.name}
                      </p>
                    </div>
                    <Switch
                      id={`${platform.key}-autopost`}
                      checked={account.auto_post}
                      onCheckedChange={(checked) => handleAutoPostToggle(platform.key, checked)}
                    />
                  </div>
                )}
              </div>
            </div>
          );
        })}
        
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
          <h4 className="font-medium text-blue-900 mb-2">Social Media Benefits</h4>
          <ul className="text-blue-700 text-sm space-y-1">
            <li>• Automatically promote new products</li>
            <li>• Share special offers and promotions</li>
            <li>• Increase brand visibility and engagement</li>
            <li>• Drive more traffic to your store</li>
          </ul>
        </div>
      </CardContent>
    </Card>
  );
};

export default SocialMediaForm;
