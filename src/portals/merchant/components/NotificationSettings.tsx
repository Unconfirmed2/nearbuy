
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Bell, Mail, MessageSquare, Save } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreferences {
  email: {
    newOrders: boolean;
    lowStock: boolean;
    reviews: boolean;
    promotions: boolean;
  };
  inApp: {
    newOrders: boolean;
    lowStock: boolean;
    reviews: boolean;
    promotions: boolean;
  };
  sms: {
    newOrders: boolean;
    urgentAlerts: boolean;
  };
}

interface NotificationSettingsProps {
  merchantId?: string;
  initialSettings?: NotificationPreferences;
  preferences?: any;
  onSave?: (preferences: any) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({ 
  merchantId, 
  initialSettings,
  preferences: externalPreferences,
  onSave
}) => {
  const [settings, setSettings] = useState<NotificationPreferences>(
    initialSettings || {
      email: {
        newOrders: externalPreferences?.email_new_orders ?? true,
        lowStock: externalPreferences?.email_low_stock ?? true,
        reviews: externalPreferences?.email_customer_reviews ?? true,
        promotions: externalPreferences?.email_marketing_updates ?? false
      },
      inApp: {
        newOrders: externalPreferences?.push_new_orders ?? true,
        lowStock: externalPreferences?.push_low_stock ?? true,
        reviews: externalPreferences?.push_order_updates ?? true,
        promotions: externalPreferences?.in_app_all ?? true
      },
      sms: {
        newOrders: externalPreferences?.sms_order_confirmations ?? false,
        urgentAlerts: externalPreferences?.sms_urgent_alerts ?? true
      }
    }
  );

  const updateSetting = (
    category: keyof NotificationPreferences,
    setting: string,
    value: boolean
  ) => {
    const newSettings = {
      ...settings,
      [category]: {
        ...settings[category],
        [setting]: value
      }
    };
    setSettings(newSettings);
    
    if (onSave) {
      // Convert to external format
      const externalFormat = {
        email_new_orders: newSettings.email.newOrders,
        email_low_stock: newSettings.email.lowStock,
        email_customer_reviews: newSettings.email.reviews,
        email_marketing_updates: newSettings.email.promotions,
        push_new_orders: newSettings.inApp.newOrders,
        push_order_updates: newSettings.inApp.reviews,
        push_low_stock: newSettings.inApp.lowStock,
        sms_urgent_alerts: newSettings.sms.urgentAlerts,
        sms_order_confirmations: newSettings.sms.newOrders,
        in_app_all: newSettings.inApp.promotions
      };
      onSave(externalFormat);
    }
  };

  const handleSave = () => {
    console.log('Saving notification settings:', settings);
    toast.success('Notification settings updated successfully');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
        <p className="text-sm text-gray-600">
          Choose how you want to be notified about important events
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <Label className="font-medium">Email Notifications</Label>
          </div>
          <div className="space-y-3 ml-6">
            {Object.entries(settings.email).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateSetting('email', key, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* In-App Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            <Label className="font-medium">In-App Notifications</Label>
          </div>
          <div className="space-y-3 ml-6">
            {Object.entries(settings.inApp).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateSetting('inApp', key, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {/* SMS Notifications */}
        <div className="space-y-4">
          <div className="flex items-center gap-2">
            <MessageSquare className="w-4 h-4" />
            <Label className="font-medium">SMS Notifications</Label>
          </div>
          <div className="space-y-3 ml-6">
            {Object.entries(settings.sms).map(([key, value]) => (
              <div key={key} className="flex items-center justify-between">
                <Label className="capitalize">
                  {key.replace(/([A-Z])/g, ' $1').trim()}
                </Label>
                <Switch
                  checked={value}
                  onCheckedChange={(checked) => updateSetting('sms', key, checked)}
                />
              </div>
            ))}
          </div>
        </div>

        {!onSave && (
          <Button onClick={handleSave} className="w-full">
            <Save className="w-4 h-4 mr-2" />
            Save Notification Settings
          </Button>
        )}
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
