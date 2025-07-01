
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Store } from '../types/store';
import { supabase } from '@/integrations/supabase/client';

export const useStores = (merchantId?: string) => {
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
            description: 'Your one-stop shop for electronics and gadgets',
            address: '123 Main St',
            city: 'Downtown',
            state: 'CA',
            zip_code: '90210',
            latitude: 34.0522,
            longitude: -118.2437,
            phone: '+1 (555) 123-4567',
            contact_phone: '+1 (555) 123-4567',
            contact_email: 'store@downtown-electronics.com',
            status: 'active',
            is_verified: true,
            is_active: true,
            merchant_id: merchantId,
            created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
          },
          {
            id: 'store-2',
            name: 'Westside Books',
            description: 'Independent bookstore with rare and new books',
            address: '456 Oak Ave',
            city: 'Westside',
            state: 'CA',
            zip_code: '90211',
            latitude: 34.0522,
            longitude: -118.2437,
            phone: '+1 (555) 987-6543',
            contact_phone: '+1 (555) 987-6543',
            contact_email: 'info@westside-books.com',
            status: 'pending_verification',
            is_verified: false,
            is_active: false,
            merchant_id: merchantId,
            created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
            updated_at: new Date().toISOString()
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
    } else {
      setLoading(false);
      setStores([]);
    }
  }, [merchantId]);

  const createStore = async (storeData: any) => {
    if (!merchantId) {
      throw new Error('No merchant ID provided');
    }

    try {
      // Parse address parts from the full address
      const addressParts = (storeData.address || '').split(',');
      const city = addressParts[1]?.trim() || '';
      const stateZip = addressParts[2]?.trim() || '';
      const stateParts = stateZip.split(' ');
      const state = stateParts[0] || '';
      const zip_code = stateParts[1] || '';

      // Insert store into Supabase
      const { data, error } = await supabase
        .from('stores')
        .insert({
          name: storeData.name,
          description: storeData.description,
          address: storeData.address,
          business_name: storeData.business_name,
          business_type: storeData.business_type,
          contact_phone: storeData.contact_phone,
          contact_email: storeData.contact_email,
          phone: storeData.phone,
          tax_id: storeData.tax_id,
          merchant_id: merchantId,
          owner_id: merchantId,
          is_verified: false,
          is_active: true,
          verification_status: 'pending'
        })
        .select()
        .single();

      if (error) throw error;

      const newStore: Store = {
        id: data.id,
        name: data.name,
        description: data.description,
        address: data.address || '',
        city: city,
        state: state,
        zip_code: zip_code,
        latitude: undefined,
        longitude: undefined,
        phone: data.phone,
        email: data.contact_email,
        website: undefined,
        logo_url: data.logo_url,
        contact_phone: data.contact_phone,
        contact_email: data.contact_email,
        status: 'pending_verification',
        is_verified: data.is_verified,
        is_active: data.is_active,
        business_hours: storeData.business_hours,
        social_media: storeData.social_media,
        merchant_id: data.merchant_id,
        created_at: data.created_at,
        updated_at: data.created_at
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
            ? { ...store, ...updates, updated_at: new Date().toISOString() }
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
