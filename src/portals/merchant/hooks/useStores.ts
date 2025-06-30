
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Store, CreateStoreData } from '../types/store';
import { toast } from 'sonner';

export const useStores = (merchantId?: string) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Mock data for development
  const mockStores: Store[] = [
    {
      id: 'store-1',
      name: 'Downtown Electronics',
      description: 'Your one-stop shop for all electronics and gadgets',
      address: '123 Main Street',
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94102',
      contact_phone: '(555) 123-4567',
      contact_email: 'info@downtown-electronics.com',
      website: 'https://downtown-electronics.com',
      logo_url: '/placeholder.svg',
      status: 'active',
      is_verified: true,
      is_active: true, // Added this property
      merchant_id: 'debug-merchant-id',
      business_hours: {
        monday: { open: '09:00', close: '18:00' },
        tuesday: { open: '09:00', close: '18:00' },
        wednesday: { open: '09:00', close: '18:00' },
        thursday: { open: '09:00', close: '18:00' },
        friday: { open: '09:00', close: '20:00' },
        saturday: { open: '10:00', close: '20:00' },
        sunday: { closed: true, open: '', close: '' }
      },
      social_media: {
        facebook: 'https://facebook.com/downtown-electronics',
        instagram: 'https://instagram.com/downtown_electronics'
      },
      created_at: '2024-01-15T10:00:00Z',
      updated_at: '2024-06-20T15:30:00Z'
    },
    {
      id: 'store-2',
      name: 'Tech Corner',
      description: 'Specialized in laptops, phones, and accessories',
      address: '456 Tech Ave',
      city: 'San Francisco',
      state: 'CA',
      zip_code: '94103',
      contact_phone: '(555) 987-6543',
      contact_email: 'hello@techcorner.com',
      status: 'inactive',
      is_verified: false,
      is_active: false, // Added this property
      merchant_id: 'debug-merchant-id',
      business_hours: {
        monday: { open: '10:00', close: '19:00' },
        tuesday: { open: '10:00', close: '19:00' },
        wednesday: { open: '10:00', close: '19:00' },
        thursday: { open: '10:00', close: '19:00' },
        friday: { open: '10:00', close: '21:00' },
        saturday: { open: '09:00', close: '21:00' },
        sunday: { open: '11:00', close: '17:00' }
      },
      created_at: '2024-02-01T14:00:00Z',
      updated_at: '2024-06-15T09:15:00Z'
    }
  ];

  const fetchStores = async () => {
    try {
      setLoading(true);
      setError(null);
      
      // For now, use mock data
      console.log('Fetching stores for merchant:', merchantId);
      await new Promise(resolve => setTimeout(resolve, 500)); // Simulate API delay
      setStores(mockStores);
    } catch (err: any) {
      console.error('Error fetching stores:', err);
      setError(err.message);
      toast.error('Failed to load stores');
    } finally {
      setLoading(false);
    }
  };

  const createStore = async (storeData: CreateStoreData): Promise<Store> => {
    try {
      console.log('Creating store:', storeData);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const newStore: Store = {
        id: `store-${Date.now()}`,
        ...storeData,
        status: 'active',
        is_verified: false,
        is_active: true, // Added this missing property
        merchant_id: merchantId || 'debug-merchant-id',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      setStores(prev => [...prev, newStore]);
      toast.success('Store created successfully');
      return newStore;
    } catch (err: any) {
      console.error('Error creating store:', err);
      toast.error('Failed to create store');
      throw err;
    }
  };

  const updateStore = async (storeId: string, updates: Partial<Store>): Promise<Store> => {
    try {
      console.log('Updating store:', storeId, updates);
      
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const updatedStore = stores.find(s => s.id === storeId);
      if (!updatedStore) throw new Error('Store not found');
      
      const newStore = { ...updatedStore, ...updates, updated_at: new Date().toISOString() };
      setStores(prev => prev.map(s => s.id === storeId ? newStore : s));
      toast.success('Store updated successfully');
      return newStore;
    } catch (err: any) {
      console.error('Error updating store:', err);
      toast.error('Failed to update store');
      throw err;
    }
  };

  const toggleStoreStatus = async (storeId: string, newStatus: 'active' | 'inactive') => {
    try {
      await updateStore(storeId, { status: newStatus });
    } catch (err) {
      console.error('Error toggling store status:', err);
    }
  };

  useEffect(() => {
    fetchStores();
  }, [merchantId]);

  return {
    stores,
    loading,
    error,
    createStore,
    updateStore,
    toggleStoreStatus,
    refetch: fetchStores
  };
};
