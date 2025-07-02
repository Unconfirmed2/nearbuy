
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { Store } from '../types/store';
import { supabase } from '@/integrations/supabase/client';

export const useStores = (merchantId?: string) => {
  const [stores, setStores] = useState<Store[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Fetch stores from Supabase
  useEffect(() => {
    const fetchStores = async () => {
      try {
        setLoading(true);
        
        if (!merchantId) {
          setStores([]);
          setLoading(false);
          return;
        }

        const { data, error } = await supabase
          .from('stores')
          .select('*')
          .eq('merchant_id', merchantId);

        if (error) {
          console.error('Error fetching stores:', error);
          setError('Failed to fetch stores');
          return;
        }

        // Transform Supabase data to Store type
        const transformedStores: Store[] = (data || []).map(store => ({
          id: store.id,
          name: store.name,
          description: store.description || '',
          address: store.address || '',
          city: '',
          state: '',
          zip_code: '',
          latitude: undefined,
          longitude: undefined,
          phone: store.phone,
          email: store.contact_email,
          website: undefined,
          logo_url: store.logo_url,
          contact_phone: store.contact_phone,
          contact_email: store.contact_email,
          status: store.verification_status === 'approved' ? 'active' : 'pending_verification',
          is_verified: store.is_verified,
          is_active: store.is_active ?? true,
          business_hours: undefined,
          social_media: undefined,
          merchant_id: store.merchant_id,
          created_at: store.created_at,
          updated_at: store.created_at
        }));
        
        setStores(transformedStores);
      } catch (err) {
        setError('Failed to fetch stores');
        console.error('Error fetching stores:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchStores();
  }, [merchantId]);

  const createStore = async (storeData: any) => {
    if (!merchantId) {
      throw new Error('No merchant ID provided');
    }

    try {
      console.log('Creating store with data:', storeData);
      console.log('Merchant ID:', merchantId);

      // Parse address parts from the full address
      const addressParts = (storeData.address || '').split(',');
      const city = addressParts[1]?.trim() || '';
      const stateZip = addressParts[2]?.trim() || '';
      const stateParts = stateZip.split(' ');
      const state = stateParts[0] || '';
      const zip_code = stateParts[1] || '';

      // Insert store into Supabase
      const insertData = {
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
        verification_status: 'pending' as const
      };

      console.log('Inserting store data:', insertData);

      const { data, error } = await supabase
        .from('stores')
        .insert(insertData)
        .select()
        .single();

      if (error) {
        console.error('Supabase error:', error);
        throw error;
      }

      console.log('Store created successfully:', data);

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
      const { error } = await supabase
        .from('stores')
        .update({
          name: updates.name,
          description: updates.description,
          address: updates.address,
          contact_phone: updates.contact_phone,
          contact_email: updates.contact_email,
          phone: updates.phone,
          is_active: updates.is_active
        })
        .eq('id', storeId);

      if (error) throw error;
      
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
      const { error } = await supabase
        .from('stores')
        .delete()
        .eq('id', storeId);

      if (error) throw error;
      
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
