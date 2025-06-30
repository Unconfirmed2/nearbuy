
import { useState, useEffect } from 'react';
import { toast } from 'sonner';

interface Store {
  id: string;
  name: string;
  address: string;
  phone?: string;
  description?: string;
  business_name?: string;
  business_type?: string;
  tax_id?: string;
  is_active: boolean;
  is_verified: boolean;
  created_at: string;
  merchant_id: string;
  business_hours?: any;
  social_media?: any;
  latitude?: number;
  longitude?: number;
}

export const useStores = (merchantId: string) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for demonstration
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        
        // Simulate API call
        await new Promise(resolve => setTimeout(resolve, 1000));
        
        const mockStores: Store[] = [
          {
            id: 'store-1',
            name: 'Downtown Electronics',
            address: '123 Main St, Downtown, CA 90210',
            phone: '+1 (555) 123-4567',
            description: 'Your one-stop shop for electronics and gadgets',
            business_name: 'Downtown Electronics LLC',
            business_type: 'Electronics Store',
            tax_id: '12-3456789',
            is_active: true,
            is_verified: true,
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            merchant_id: merchantId,
            latitude: 34.0522,
            longitude: -118.2437
          },
          {
            id: 'store-2',
            name: 'Westside Books',
            address: '456 Oak Ave, Westside, CA 90211',
            phone: '+1 (555) 987-6543',
            description: 'Independent bookstore with rare and new books',
            business_name: 'Westside Books Inc',
            business_type: 'Bookstore',
            is_active: false,
            is_verified: false,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            merchant_id: merchantId,
            latitude: 34.0522,
            longitude: -118.2437
          }
        ];
        
        setStores(mockStores);
      } catch (err) {
        setError('Failed to fetch stores');
        console.error('Error fetching stores:', err);
      } finally {
        setLoading(false);
      }
    };

    if (merchantId) {
      fetchStores();
    }
  }, [merchantId]);

  const createStore = async (storeData: Partial<Store>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const newStore: Store = {
        id: `store-${Date.now()}`,
        name: storeData.name || '',
        address: storeData.address || '',
        phone: storeData.phone,
        description: storeData.description,
        business_name: storeData.business_name,
        business_type: storeData.business_type,
        tax_id: storeData.tax_id,
        is_active: storeData.is_active ?? true,
        is_verified: storeData.is_verified ?? false,
        created_at: new Date().toISOString(),
        merchant_id: merchantId,
        business_hours: storeData.business_hours,
        social_media: storeData.social_media,
        latitude: storeData.latitude,
        longitude: storeData.longitude
      };
      
      setStores(prev => [...prev, newStore]);
      return newStore;
    } catch (err) {
      console.error('Error creating store:', err);
      throw new Error('Failed to create store');
    }
  };

  const updateStore = async (storeId: string, updates: Partial<Store>) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStores(prev => 
        prev.map(store => 
          store.id === storeId 
            ? { ...store, ...updates }
            : store
        )
      );
    } catch (err) {
      console.error('Error updating store:', err);
      throw new Error('Failed to update store');
    }
  };

  const deleteStore = async (storeId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setStores(prev => prev.filter(store => store.id !== storeId));
    } catch (err) {
      console.error('Error deleting store:', err);
      throw new Error('Failed to delete store');
    }
  };

  return {
    stores,
    loading,
    error,
    createStore,
    updateStore,
    deleteStore,
    refetch: () => {
      setLoading(true);
      // Re-trigger the useEffect
      setStores([]);
    }
  };
};
