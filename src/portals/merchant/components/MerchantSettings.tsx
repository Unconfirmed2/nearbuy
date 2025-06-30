
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Switch } from '@/components/ui/switch';
import { Textarea } from '@/components/ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { User, Bell, Shield, CreditCard, Trash2, AlertTriangle } from 'lucide-react';
import { toast } from 'sonner';
import MerchantVerification from './MerchantVerification';

interface MerchantSettingsProps {
  merchantId: string;
  profile: any;
}

const MerchantSettings: React.FC<MerchantSettingsProps> = ({
  merchantId,
  profile
}) => {
  const [profileData, setProfileData] = useState({
    name: profile?.name || '',
    email: profile?.email || '',
    phone: profile?.phone || '',
    business_name: profile?.business_name || '',
    business_description: profile?.business_description || '',
    business_address: profile?.business_address || ''
  });

  const [notifications, setNotifications] = useState({
    email_orders: true,
    email_low_stock: true,
    email_reviews: false,
    sms_orders: false,
    sms_urgent: true,
    push_orders: true,
    push_promotions: false
  });

  const [security, setSecurity] = useState({
    two_factor_enabled: false,
    login_notifications: true,
    session_timeout: 30
  });

  const [loading, setLoading] = useState(false);
  const [verificationStatus, setVerificationStatus] = useState<'pending' | 'verified' | 'rejected' | 'not_started'>('not_started');

  const handleProfileUpdate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 1000));
      toast.success('Profile updated successfully');
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setLoading(false);
    }
  };

  const handleNotificationUpdate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Notification preferences updated');
    } catch (error) {
      toast.error('Failed to update notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleSecurityUpdate = async () => {
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Security settings updated');
    } catch (error) {
      toast.error('Failed to update security settings');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAccount = () => {
    if (window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
      // Implement account deletion logic
      toast.error('Account deletion is not implemented yet. Please contact support.');
    }
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold">Settings</h1>
        <p className="text-gray-600 mt-2">
          Manage your account settings and preferences
        </p>
      </div>

      <Tabs defaultValue="profile" className="space-y-4">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile">Profile</TabsTrigger>
          <TabsTrigger value="verification">Verification</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="security">Security</TabsTrigger>
          <TabsTrigger value="billing">Billing</TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Business Profile
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Full Name</Label>
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, name: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={profileData.email}
                    onChange={(e) => setProfileData(prev => ({ ...prev, email: e.target.value }))}
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="phone">Phone</Label>
                  <Input
                    id="phone"
                    type="tel"
                    value={profileData.phone}
                    onChange={(e) => setProfileData(prev => ({ ...prev, phone: e.target.value }))}
                  />
                </div>
                <div>
                  <Label htmlFor="business_name">Business Name</Label>
                  <Input
                    id="business_name"
                    value={profileData.business_name}
                    onChange={(e) => setProfileData(prev => ({ ...prev, business_name: e.target.value }))}
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="business_description">Business Description</Label>
                <Textarea
                  id="business_description"
                  value={profileData.business_description}
                  onChange={(e) => setProfileData(prev => ({ ...prev, business_description: e.target.value }))}
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="business_address">Business Address</Label>
                <Input
                  id="business_address"
                  value={profileData.business_address}
                  onChange={(e) => setProfileData(prev => ({ ...prev, business_address: e.target.value }))}
                />
              </div>

              <Button onClick={handleProfileUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Update Profile'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="verification">
          <MerchantVerification
            merchantId={merchantId}
            verificationStatus={verificationStatus}
            onStatusChange={(status) => setVerificationStatus(status as any)}
          />
        </TabsContent>

        <TabsContent value="notifications">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Bell className="w-5 h-5" />
                Notification Preferences
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div>
                <h4 className="font-medium mb-4">Email Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-orders">New Orders</Label>
                      <p className="text-sm text-gray-600">Get notified when new orders are placed</p>
                    </div>
                    <Switch
                      id="email-orders"
                      checked={notifications.email_orders}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_orders: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-low-stock">Low Stock Alerts</Label>
                      <p className="text-sm text-gray-600">Get notified when products are running low</p>
                    </div>
                    <Switch
                      id="email-low-stock"
                      checked={notifications.email_low_stock}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_low_stock: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="email-reviews">Customer Reviews</Label>
                      <p className="text-sm text-gray-600">Get notified about new customer reviews</p>
                    </div>
                    <Switch
                      id="email-reviews"
                      checked={notifications.email_reviews}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, email_reviews: checked }))}
                    />
                  </div>
                </div>
              </div>

              <div>
                <h4 className="font-medium mb-4">SMS Notifications</h4>
                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-orders">New Orders</Label>
                      <p className="text-sm text-gray-600">SMS alerts for new orders</p>
                    </div>
                    <Switch
                      id="sms-orders"
                      checked={notifications.sms_orders}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms_orders: checked }))}
                    />
                  </div>
                  <div className="flex items-center justify-between">
                    <div>
                      <Label htmlFor="sms-urgent">Urgent Alerts</Label>
                      <p className="text-sm text-gray-600">Critical notifications only</p>
                    </div>
                    <Switch
                      id="sms-urgent"
                      checked={notifications.sms_urgent}
                      onCheckedChange={(checked) => setNotifications(prev => ({ ...prev, sms_urgent: checked }))}
                    />
                  </div>
                </div>
              </div>

              <Button onClick={handleNotificationUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Update Preferences'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="security">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Security Settings
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="two-factor">Two-Factor Authentication</Label>
                  <p className="text-sm text-gray-600">Add an extra layer of security to your account</p>
                </div>
                <div className="flex items-center gap-2">
                  {security.two_factor_enabled && (
                    <Badge className="bg-green-100 text-green-800">Enabled</Badge>
                  )}
                  <Switch
                    id="two-factor"
                    checked={security.two_factor_enabled}
                    onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, two_factor_enabled: checked }))}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <div>
                  <Label htmlFor="login-notifications">Login Notifications</Label>
                  <p className="text-sm text-gray-600">Get notified of new login attempts</p>
                </div>
                <Switch
                  id="login-notifications"
                  checked={security.login_notifications}
                  onCheckedChange={(checked) => setSecurity(prev => ({ ...prev, login_notifications: checked }))}
                />
              </div>

              <div>
                <Label htmlFor="session-timeout">Session Timeout (minutes)</Label>
                <Input
                  id="session-timeout"
                  type="number"
                  value={security.session_timeout}
                  onChange={(e) => setSecurity(prev => ({ ...prev, session_timeout: Number(e.target.value) }))}
                  className="w-32 mt-2"
                />
              </div>

              <Button onClick={handleSecurityUpdate} disabled={loading}>
                {loading ? 'Updating...' : 'Update Security Settings'}
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <CreditCard className="w-5 h-5" />
                  Payment Methods
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-center py-8">
                  <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">No payment methods</h3>
                  <p className="text-gray-600 mb-4">
                    Connect your Stripe account to start accepting payments.
                  </p>
                  <Button>Connect Stripe Account</Button>
                </div>
              </CardContent>
            </Card>

            <Card className="border-red-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                  <Trash2 className="w-5 h-5" />
                  Danger Zone
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                  <div className="flex items-start gap-3">
                    <AlertTriangle className="w-5 h-5 text-red-600 mt-0.5" />
                    <div className="flex-1">
                      <h4 className="font-medium text-red-800 mb-1">Delete Account</h4>
                      <p className="text-red-700 text-sm mb-4">
                        Permanently delete your merchant account and all associated data. This action cannot be undone.
                      </p>
                      <Button
                        variant="destructive"
                        onClick={handleDeleteAccount}
                        className="bg-red-600 hover:bg-red-700"
                      >
                        Delete Account
                      </Button>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantSettings;
