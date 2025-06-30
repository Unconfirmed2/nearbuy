
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { Order } from '../types/order';

interface OrdersStats {
  total_orders: number;
  pending_orders: number;
  ready_orders: number;
  total_revenue: number;
  today_orders: number;
  cancelled_orders: number;
}

interface OrderWithDetails extends Order {
  order_number: string;
  customer_name: string;
  customer_email: string;
  store_name: string;
  items_count: number;
}

export const useOrders = (merchantId: string, searchTerm?: string, statusFilter?: string) => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['merchant-orders', merchantId, searchTerm, statusFilter],
    queryFn: async (): Promise<OrderWithDetails[]> => {
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

      if (statusFilter && statusFilter !== 'all') {
        query = query.eq('status', statusFilter);
      }

      const { data, error } = await query;
      
      if (error) {
        console.error('Error fetching orders:', error);
        throw error;
      }

      console.log('Orders fetched:', data);
      
      const ordersData = (data as any[]) || [];
      
      // Transform data to match expected interface
      const transformedOrders: OrderWithDetails[] = ordersData.map((order: any) => ({
        ...order,
        order_number: order.id.slice(0, 8).toUpperCase(),
        customer_name: order.profiles?.name || 'Unknown Customer',
        customer_email: order.profiles?.email || '',
        store_name: order.stores?.name || 'Unknown Store',
        items_count: order.order_items?.length || 0
      }));

      if (searchTerm) {
        const filtered = transformedOrders.filter((order: OrderWithDetails) => 
          order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
          order.customer_email.toLowerCase().includes(searchTerm.toLowerCase())
        );
        return filtered;
      }

      return transformedOrders;
    },
  });

  // Generate mock stats for now
  const stats: OrdersStats = {
    total_orders: ordersQuery.data?.length || 0,
    pending_orders: ordersQuery.data?.filter(o => o.status === 'pending').length || 0,
    ready_orders: ordersQuery.data?.filter(o => o.status === 'ready_for_pickup').length || 0,
    total_revenue: ordersQuery.data?.reduce((sum, o) => sum + (o.total_amount || 0), 0) || 0,
    today_orders: ordersQuery.data?.filter(o => {
      const today = new Date().toDateString();
      return new Date(o.created_at).toDateString() === today;
    }).length || 0,
    cancelled_orders: ordersQuery.data?.filter(o => o.status === 'cancelled').length || 0
  };

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
    loading: ordersQuery.isLoading,
    error: ordersQuery.error,
    stats,
    updateOrderStatus: (orderId: string, status: string) => 
      updateOrderStatusMutation.mutate({ orderId, status }),
  };
};
