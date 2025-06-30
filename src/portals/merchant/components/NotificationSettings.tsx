
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Separator } from '@/components/ui/separator';
import { Bell, Mail, MessageSquare, Smartphone, Save } from 'lucide-react';
import { toast } from 'sonner';

export interface NotificationPreferences {
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
  merchantId?: string;
  preferences?: NotificationPreferences;
  onSave?: (preferences: NotificationPreferences) => void;
}

const NotificationSettings: React.FC<NotificationSettingsProps> = ({
  merchantId,
  preferences: externalPreferences,
  onSave
}) => {
  const defaultPreferences: NotificationPreferences = {
    email_new_orders: true,
    email_low_stock: true,
    email_customer_reviews: false,
    email_marketing_updates: false,
    push_new_orders: true,
    push_order_updates: true,
    push_low_stock: true,
    sms_urgent_alerts: false,
    sms_order_confirmations: false,
    in_app_all: true
  };

  const [preferences, setPreferences] = useState<NotificationPreferences>(
    externalPreferences || defaultPreferences
  );

  const handleToggle = (key: keyof NotificationPreferences) => {
    setPreferences(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleSave = () => {
    onSave?.(preferences);
    toast.success('Notification preferences updated successfully');
  };

  const notificationSections = [
    {
      title: 'Email Notifications',
      icon: Mail,
      items: [
        { key: 'email_new_orders', label: 'New Orders', description: 'Get notified when you receive new orders' },
        { key: 'email_low_stock', label: 'Low Stock Alerts', description: 'Alerts when inventory is running low' },
        { key: 'email_customer_reviews', label: 'Customer Reviews', description: 'When customers leave reviews' },
        { key: 'email_marketing_updates', label: 'Marketing Updates', description: 'Platform updates and marketing tips' }
      ]
    },
    {
      title: 'Push Notifications',
      icon: Bell,
      items: [
        { key: 'push_new_orders', label: 'New Orders', description: 'Instant notifications for new orders' },
        { key: 'push_order_updates', label: 'Order Updates', description: 'When order status changes' },
        { key: 'push_low_stock', label: 'Low Stock', description: 'Push alerts for low inventory' }
      ]
    },
    {
      title: 'SMS Notifications',
      icon: MessageSquare,
      items: [
        { key: 'sms_urgent_alerts', label: 'Urgent Alerts Only', description: 'Critical issues requiring immediate attention' },
        { key: 'sms_order_confirmations', label: 'Order Confirmations', description: 'SMS confirmation for each new order' }
      ]
    },
    {
      title: 'In-App Notifications',
      icon: Smartphone,
      items: [
        { key: 'in_app_all', label: 'All Notifications', description: 'Show all notifications within the app' }
      ]
    }
  ];

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Bell className="w-5 h-5" />
          Notification Settings
        </CardTitle>
        <p className="text-sm text-gray-600">
          Manage how you receive notifications about your business
        </p>
      </CardHeader>
      <CardContent className="space-y-6">
        {notificationSections.map((section, index) => {
          const Icon = section.icon;
          return (
            <div key={section.title}>
              <div className="flex items-center gap-2 mb-4">
                <Icon className="w-5 h-5 text-gray-600" />
                <h3 className="font-medium text-gray-900">{section.title}</h3>
              </div>
              
              <div className="space-y-3 ml-7">
                {section.items.map(item => (
                  <div key={item.key} className="flex items-center justify-between">
                    <div className="flex-1">
                      <Label className="font-medium">{item.label}</Label>
                      <p className="text-sm text-gray-600">{item.description}</p>
                    </div>
                    <Switch
                      checked={preferences[item.key as keyof NotificationPreferences]}
                      onCheckedChange={() => handleToggle(item.key as keyof NotificationPreferences)}
                    />
                  </div>
                ))}
              </div>
              
              {index < notificationSections.length - 1 && <Separator className="mt-6" />}
            </div>
          );
        })}

        <Button onClick={handleSave} className="w-full">
          <Save className="w-4 h-4 mr-2" />
          Save Notification Settings
        </Button>
      </CardContent>
    </Card>
  );
};

export default NotificationSettings;
