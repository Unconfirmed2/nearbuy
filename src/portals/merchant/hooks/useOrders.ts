
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order } from '../types/order';

export const useOrders = (searchTerm: string, statusFilter: string) => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['merchant-orders', searchTerm, statusFilter],
    queryFn: async (): Promise<Order[]> => {
      console.log('Fetching orders...');
      
      let query = supabase
        .from('orders')
        .select(`
          *,
          profiles!orders_user_id_fkey (name, email),
          stores (name),
          order_items (
            quantity,
            unit_price,
            products (name, brand)
          )
        `)
        .order('created_at', { ascending: false });

      if (statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Orders fetched:', data);
      
      const ordersData = (data as any[]) || [];
      
      if (searchTerm) {
        const filtered = ordersData.filter((order: any) => 
          order.id.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.profiles?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.profiles?.email?.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filtered;
      }

      return ordersData;
    },
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      console.log('Updating order status:', orderId, status);
      
      const { error } = await supabase
        .from('orders')
        .update({ status })
        .eq('id', orderId);

      if (error) {
        console.error('Error updating order status:', error);
        throw error;
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['merchant-orders'] });
      toast.success('Order status updated successfully');
    },
    onError: (error) => {
      console.error('Failed to update order status:', error);
      toast.error('Failed to update order status');
    },
  });

  return {
    orders: ordersQuery.data || [],
    isLoading: ordersQuery.isLoading,
    error: ordersQuery.error,
    updateOrderStatus: updateOrderStatusMutation.mutate,
  };
};
