
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { User, Bell, Shield, Store, Globe, CreditCard } from 'lucide-react';
import MerchantVerification from './MerchantVerification';
import BusinessHoursForm from './BusinessHoursForm';
import SocialMediaForm from './SocialMediaForm';
import NotificationSettings from './NotificationSettings';

interface MerchantSettingsProps {
  merchantId: string;
  profile: any;
}

const MerchantSettings: React.FC<MerchantSettingsProps> = ({ merchantId, profile }) => {
  return (
    <div className="space-y-6">
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-6">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="verification" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Verification
          </TabsTrigger>
          <TabsTrigger value="stores" className="flex items-center gap-2">
            <Store className="w-4 h-4" />
            Stores
          </TabsTrigger>
          <TabsTrigger value="notifications" className="flex items-center gap-2">
            <Bell className="w-4 h-4" />
            Notifications
          </TabsTrigger>
          <TabsTrigger value="social" className="flex items-center gap-2">
            <Globe className="w-4 h-4" />
            Social Media
          </TabsTrigger>
          <TabsTrigger value="billing" className="flex items-center gap-2">
            <CreditCard className="w-4 h-4" />
            Billing
          </TabsTrigger>
        </TabsList>

        <TabsContent value="profile">
          <div className="text-center py-12">
            <User className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Profile Settings Coming Soon
            </h3>
            <p className="text-gray-600">
              Manage your merchant profile information
            </p>
          </div>
        </TabsContent>

        <TabsContent value="verification">
          <MerchantVerification merchantId={merchantId} verificationStatus="pending" />
        </TabsContent>

        <TabsContent value="stores">
          <div className="space-y-6">
            <BusinessHoursForm />
            <SocialMediaForm />
          </div>
        </TabsContent>

        <TabsContent value="notifications">
          <NotificationSettings merchantId={merchantId} />
        </TabsContent>

        <TabsContent value="social">
          <SocialMediaForm />
        </TabsContent>

        <TabsContent value="billing">
          <div className="text-center py-12">
            <CreditCard className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              Billing Settings Coming Soon
            </h3>
            <p className="text-gray-600">
              Manage your billing and payment methods
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MerchantSettings;
