import React, { useEffect, useState } from 'react';
import { useAuth } from '../hooks/useAuth';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MerchantSettings from '../components/MerchantSettings';
import NotificationSettings from '../components/NotificationSettings';
import SupportTicketSystem from '../components/SupportTicketSystem';
import MerchantProfileForm from '../components/MerchantProfileForm';
import SecuritySettings from '../components/SecuritySettings';
import { supabase } from '@/integrations/supabase/client';

const Settings: React.FC = () => {
  const { user } = useAuth();
  const [notificationPreferences, setNotificationPreferences] = useState<any>(null);
  const [supportTickets, setSupportTickets] = useState<any[]>([]);
  const [merchantProfile, setMerchantProfile] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  // Fetch all settings and tickets from Supabase
  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      if (!user?.id) return;
      // Fetch notification preferences
      const { data: notifData } = await supabase
        .from('notification_preferences')
        .select('*')
        .eq('merchant_id', user.id)
        .single();
      setNotificationPreferences(notifData || {});
      // Fetch support tickets
      const { data: ticketsData } = await supabase
        .from('support_tickets')
        .select('*')
        .eq('merchant_id', user.id)
        .order('created_at', { ascending: false });
      setSupportTickets(ticketsData || []);
      // Fetch merchant profile
      const { data: profileData } = await supabase
        .from('merchants')
        .select('*')
        .eq('id', user.id)
        .single();
      setMerchantProfile(profileData || {});
      setLoading(false);
    };
    fetchData();
  }, [user?.id]);

  const handleSaveNotifications = async (preferences: any) => {
    setNotificationPreferences(preferences);
    if (!user?.id) return;
    await supabase.from('notification_preferences').upsert({
      ...preferences,
      merchant_id: user.id
    });
  };

  const handleCreateTicket = async (ticket: any) => {
    if (!user?.id) return;
    const { data: newTicket } = await supabase.from('support_tickets').insert({
      ...ticket,
      merchant_id: user.id
    }).select('*').single();
    if (newTicket) setSupportTickets([newTicket, ...supportTickets]);
  };

  const handleUpdateTicket = async (ticketId: string, updates: any) => {
    const { data: updated } = await supabase.from('support_tickets').update({
      ...updates,
      updated_at: new Date().toISOString()
    }).eq('id', ticketId).select('*').single();
    if (updated) setSupportTickets(tickets =>
      tickets.map(ticket => ticket.id === ticketId ? updated : ticket)
    );
  };

  const handleSaveProfile = async (profile: any) => {
    setMerchantProfile(profile);
    if (!user?.id) return;
    await supabase.from('merchants').update(profile).eq('id', user.id);
  };

  if (loading) {
    return <div>Loading...</div>;
  }

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
            merchantId={user?.id || ''}
            profile={merchantProfile}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings
            merchantId={user?.id || ''}
            preferences={notificationPreferences}
            onSave={handleSaveNotifications}
          />
        </TabsContent>

        <TabsContent value="security">
          <SecuritySettings merchantId={user?.id || ''} />
        </TabsContent>

        <TabsContent value="support">
          <SupportTicketSystem
            merchantId={user?.id || ''}
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
