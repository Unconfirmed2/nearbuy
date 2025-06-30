
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare, Smartphone } from 'lucide-react';
import { toast } from 'sonner';

interface NotificationPreferences {
  email_new_orders: boolean;
  email_low_stock: boolean;
  email_customer_reviews: boolean;
  email_marketing_updates: boolean;
  push_new_orders: boolean;
  push_order_updates: boolean;
  push_low_stock: boolean;
  sms_urgent_alerts: boolean;
  sms_order_confirmations: boolean;
  in_app_all: boolean;
}

interface NotificationSettingsProps {
  preferences: NotificationPreferences;
  onSave: (preferences: NotificationPreferences) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  preferences,
  onSave
}) => {
  const [settings, setSettings] = useState<NotificationPreferences>(preferences);

  const handleToggle = (key: keyof NotificationPreferences) => {
    setSettings(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    onSave(settings);
    toast.success('Notification preferences saved');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Preferences
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        {/* Email Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Mail className="w-4 h-4" />
            <h3 className="font-medium">Email Notifications</h3>
          </div>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="email_new_orders">New Orders</Label>
              <Switch
                id="email_new_orders"
                checked={settings.email_new_orders}
                onCheckedChange={() => handleToggle('email_new_orders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email_low_stock">Low Stock Alerts</Label>
              <Switch
                id="email_low_stock"
                checked={settings.email_low_stock}
                onCheckedChange={() => handleToggle('email_low_stock')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email_customer_reviews">Customer Reviews</Label>
              <Switch
                id="email_customer_reviews"
                checked={settings.email_customer_reviews}
                onCheckedChange={() => handleToggle('email_customer_reviews')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="email_marketing_updates">Marketing Updates</Label>
              <Switch
                id="email_marketing_updates"
                checked={settings.email_marketing_updates}
                onCheckedChange={() => handleToggle('email_marketing_updates')}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* Push Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Bell className="w-4 h-4" />
            <h3 className="font-medium">Push Notifications</h3>
          </div>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="push_new_orders">New Orders</Label>
              <Switch
                id="push_new_orders"
                checked={settings.push_new_orders}
                onCheckedChange={() => handleToggle('push_new_orders')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push_order_updates">Order Status Updates</Label>
              <Switch
                id="push_order_updates"
                checked={settings.push_order_updates}
                onCheckedChange={() => handleToggle('push_order_updates')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="push_low_stock">Low Stock Alerts</Label>
              <Switch
                id="push_low_stock"
                checked={settings.push_low_stock}
                onCheckedChange={() => handleToggle('push_low_stock')}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* SMS Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <Smartphone className="w-4 h-4" />
            <h3 className="font-medium">SMS Notifications</h3>
          </div>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="sms_urgent_alerts">Urgent Alerts Only</Label>
              <Switch
                id="sms_urgent_alerts"
                checked={settings.sms_urgent_alerts}
                onCheckedChange={() => handleToggle('sms_urgent_alerts')}
              />
            </div>
            <div className="flex items-center justify-between">
              <Label htmlFor="sms_order_confirmations">Order Confirmations</Label>
              <Switch
                id="sms_order_confirmations"
                checked={settings.sms_order_confirmations}
                onCheckedChange={() => handleToggle('sms_order_confirmations')}
              />
            </div>
          </div>
        </div>

        <Separator />

        {/* In-App Notifications */}
        <div>
          <div className="flex items-center gap-2 mb-4">
            <MessageSquare className="w-4 h-4" />
            <h3 className="font-medium">In-App Notifications</h3>
          </div>
          <div className="space-y-3 pl-6">
            <div className="flex items-center justify-between">
              <Label htmlFor="in_app_all">All Notifications</Label>
              <Switch
                id="in_app_all"
                checked={settings.in_app_all}
                onCheckedChange={() => handleToggle('in_app_all')}
              />
            </div>
          </div>
        </div>

        <div className="pt-4">
          <Button onClick={handleSave} className="w-full">
            Save Preferences
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
