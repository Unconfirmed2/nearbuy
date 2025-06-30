
import React from 'react';
import { useStores } from '../hooks/useStores';
import MerchantSettings from '../components/MerchantSettings';

const Settings: React.FC = () => {
  const { stores } = useStores('debug-merchant-id');
  
  const mockProfile = {
    id: 'debug-merchant-id',
    name: 'Debug Merchant',
    email: 'merchant@example.com',
    phone: '(555) 123-4567',
    business_name: 'Debug Electronics Store',
    business_description: 'Your trusted electronics retailer',
    business_address: '123 Main St, San Francisco, CA 94102'
  };

  return (
    <MerchantSettings 
      merchantId="debug-merchant-id"
      profile={mockProfile}
    />
  );
};

export default Settings;
