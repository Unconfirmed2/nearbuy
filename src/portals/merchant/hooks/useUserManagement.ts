
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export interface TeamUser {
  id: string;
  email: string;
  name?: string;
  user_role: string;
  merchant_id?: string;
  all_stores_access: boolean;
  created_at: string;
  store_permissions?: {
    store_id: string;
    store_name: string;
  }[];
}

export interface Invitation {
  id: string;
  email: string;
  role: string;
  store_ids: string[];
  expires_at: string;
  accepted_at?: string;
  created_at: string;
}

export const useUserManagement = (merchantId: string) => {
  const [users, setUsers] = useState<TeamUser[]>([]);
  const [invitations, setInvitations] = useState<Invitation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchUsers = async () => {
    if (!merchantId) return;

    try {
      // Fetch users associated with this merchant
      const { data: usersData, error: usersError } = await supabase
        .from('users')
        .select(`
          id,
          email,
          name,
          user_role,
          merchant_id,
          all_stores_access,
          created_at
        `)
        .eq('merchant_id', merchantId);

      if (usersError) throw usersError;

      // Fetch store permissions for each user
      const usersWithPermissions = await Promise.all(
        (usersData || []).map(async (user) => {
          const { data: permissions } = await supabase
            .from('user_store_permissions')
            .select(`
              store_id,
              stores:stores(name)
            `)
            .eq('user_id', user.id);

          return {
            ...user,
            store_permissions: permissions?.map(p => ({
              store_id: p.store_id,
              store_name: (p.stores as any)?.name || 'Unknown Store'
            })) || []
          };
        })
      );

      setUsers(usersWithPermissions);
    } catch (error) {
      console.error('Error fetching users:', error);
      toast.error('Failed to fetch users');
    }
  };

  const fetchInvitations = async () => {
    if (!merchantId) return;

    try {
      const { data, error } = await supabase
        .from('invitations')
        .select('*')
        .eq('merchant_id', merchantId)
        .is('accepted_at', null)
        .gt('expires_at', new Date().toISOString());

      if (error) throw error;
      setInvitations(data || []);
    } catch (error) {
      console.error('Error fetching invitations:', error);
      toast.error('Failed to fetch invitations');
    }
  };

  const sendInvitation = async (
    email: string,
    role: string,
    storeIds: string[],
    inviterName: string,
    companyName?: string
  ) => {
    try {
      const { data: { session } } = await supabase.auth.getSession();
      if (!session) throw new Error('Not authenticated');

      const response = await supabase.functions.invoke('send-invitation', {
        body: {
          email,
          role,
          storeIds,
          inviterName,
          companyName
        }
      });

      if (response.error) {
        console.error('Supabase function error:', response.error);
        throw new Error(response.error.message || 'Failed to send invitation');
      }

      const result = response.data;
      if (!result || !result.success) {
        console.error('Function response:', result);
        throw new Error(result?.error || 'Failed to send invitation');
      }

      toast.success('Invitation sent successfully!');
      await fetchInvitations();
      return true;
    } catch (error: any) {
      console.error('Error sending invitation:', error);
      toast.error(`Failed to send invitation: ${error.message}`);
      return false;
    }
  };

  const removeUser = async (userId: string) => {
    try {
      // Remove user's store permissions
      await supabase
        .from('user_store_permissions')
        .delete()
        .eq('user_id', userId);

      // Update user to remove merchant association
      const { error } = await supabase
        .from('users')
        .update({
          user_role: 'customer' as any,
          merchant_id: null,
          all_stores_access: false
        })
        .eq('id', userId);

      if (error) throw error;

      toast.success('User removed successfully');
      await fetchUsers();
    } catch (error) {
      console.error('Error removing user:', error);
      toast.error('Failed to remove user');
    }
  };

  const updateUserPermissions = async (
    userId: string,
    role: string,
    storeIds: string[]
  ) => {
    try {
      // Update user role
      const { error: roleError } = await supabase
        .from('users')
        .update({
          user_role: role as any,
          all_stores_access: role === 'super_merchant'
        })
        .eq('id', userId);

      if (roleError) throw roleError;

      // Remove existing permissions
      await supabase
        .from('user_store_permissions')
        .delete()
        .eq('user_id', userId);

      // Add new permissions if not super merchant
      if (role !== 'super_merchant' && storeIds.length > 0) {
        const permissions = storeIds.map(storeId => ({
          user_id: userId,
          store_id: storeId,
          merchant_id: merchantId,
          granted_by: merchantId
        }));

        const { error: permError } = await supabase
          .from('user_store_permissions')
          .insert(permissions);

        if (permError) throw permError;
      }

      toast.success('User permissions updated');
      await fetchUsers();
    } catch (error) {
      console.error('Error updating permissions:', error);
      toast.error('Failed to update permissions');
    }
  };

  const cancelInvitation = async (invitationId: string) => {
    try {
      const { error } = await supabase
        .from('invitations')
        .delete()
        .eq('id', invitationId);

      if (error) throw error;

      toast.success('Invitation cancelled');
      await fetchInvitations();
    } catch (error) {
      console.error('Error cancelling invitation:', error);
      toast.error('Failed to cancel invitation');
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      await Promise.all([fetchUsers(), fetchInvitations()]);
      setLoading(false);
    };

    fetchData();
  }, [merchantId]);

  return {
    users,
    invitations,
    loading,
    sendInvitation,
    removeUser,
    updateUserPermissions,
    cancelInvitation,
    refetch: () => Promise.all([fetchUsers(), fetchInvitations()])
  };
};
