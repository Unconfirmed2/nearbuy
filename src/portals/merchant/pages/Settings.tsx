
import React, { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MerchantSettings from '../components/MerchantSettings';
import NotificationSettings from '../components/NotificationSettings';
import SupportTicketSystem from '../components/SupportTicketSystem';
import MerchantProfileForm from '../components/MerchantProfileForm';
import SecuritySettings from '../components/SecuritySettings';

const Settings: React.FC = () => {
  // Mock notification preferences
  const [notificationPreferences, setNotificationPreferences] = useState({
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
  });

  // Mock support tickets
  const [supportTickets, setSupportTickets] = useState([
    {
      id: 'ticket-1',
      subject: 'Issue with product upload',
      description: 'Having trouble uploading product images',
      category: 'technical',
      priority: 'medium' as const,
      status: 'open' as const,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      merchant_id: 'debug-merchant-id'
    }
  ]);

  // Mock merchant profile data
  const [merchantProfile, setMerchantProfile] = useState({
    name: 'Debug Merchant',
    email: 'merchant@example.com',
    phone: '+1-555-0123',
    business_name: 'Debug Store',
    business_description: 'A test store for debugging purposes',
    business_address: '123 Main St, City, State 12345'
  });

  const handleSaveNotifications = (preferences: any) => {
    setNotificationPreferences(preferences);
    console.log('Notification preferences saved:', preferences);
  };

  const handleCreateTicket = (ticket: any) => {
    const newTicket = {
      ...ticket,
      id: `ticket-${Date.now()}`,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      merchant_id: 'debug-merchant-id'
    };
    setSupportTickets([newTicket, ...supportTickets]);
  };

  const handleUpdateTicket = (ticketId: string, updates: any) => {
    setSupportTickets(tickets =>
      tickets.map(ticket =>
        ticket.id === ticketId
          ? { ...ticket, ...updates, updated_at: new Date().toISOString() }
          : ticket
      )
    );
  };

  const handleSaveProfile = (profile: any) => {
    setMerchantProfile(profile);
    console.log('Profile saved:', profile);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account preferences and business settings
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="business">Business</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="support">Support</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <MerchantProfileForm
            profile={merchantProfile}
            onSave={handleSaveProfile}
          />
        </TabsContent>

        <TabsContent value="business">
          <MerchantSettings
            merchantId="debug-merchant-id"
            profile={merchantProfile}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            merchantId="debug-merchant-id"
            preferences={notificationPreferences}
            onSave={handleSaveNotifications}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings merchantId="debug-merchant-id" />
        </TabsContent>

        <TabsContent value="support">
          <SupportTicketSystem
            merchantId="debug-merchant-id"
            tickets={supportTickets}
            onCreateTicket={handleCreateTicket}
            onUpdateTicket={handleUpdateTicket}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Settings;
