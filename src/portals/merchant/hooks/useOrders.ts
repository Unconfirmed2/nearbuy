
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { OrderWithDetails } from '../types/order';

interface OrdersStats {
  total_orders: number;
  pending_orders: number;
  ready_orders: number;
  total_revenue: number;
  today_orders: number;
  cancelled_orders: number;
}

export const useOrders = (merchantId: string, searchTerm: string = '', statusFilter: string = 'all') => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['merchant-orders', merchantId, searchTerm, statusFilter],
    queryFn: async (): Promise<OrderWithDetails[]> => {
      console.log('Fetching orders for merchant:', merchantId);
      
      if (!merchantId) return [];

      // Get store IDs for this merchant
      const { data: storeData, error: storeError } = await supabase
        .from('stores')
        .select('id, name')
        .eq('merchant_id', merchantId);

      if (storeError) {
        console.error('Error fetching stores:', storeError);
        throw new Error('Failed to fetch orders');
      }

      if (!storeData || storeData.length === 0) {
        return [];
      }

      const storeIds = storeData.map(s => s.id);

      // Fetch orders for merchant's stores
      const { data: ordersData, error: ordersError } = await supabase
        .from('orders')
        .select(`
          id,
          user_id,
          store_id,
          total_amount,
          pickup_time,
          created_at,
          status,
          users (
            name,
            email
          ),
          stores (
            name
          ),
          order_items (
            quantity,
            unit_price,
            products (
              name,
              brand
            )
          )
        `)
        .in('store_id', storeIds);

      if (ordersError) {
        console.error('Error fetching orders:', ordersError);
        throw new Error('Failed to fetch orders');
      }

      // Transform to OrderWithDetails format
      const transformedOrders: OrderWithDetails[] = (ordersData || []).map((order, index) => ({
        id: order.id,
        order_number: `ORD-${(index + 1).toString().padStart(4, '0')}`,
        customer_name: order.users?.name || 'Unknown Customer',
        customer_email: order.users?.email || '',
        store_name: order.stores?.name || 'Unknown Store',
        items_count: order.order_items?.length || 0,
        user_id: order.user_id,
        store_id: order.store_id,
        status: order.status,
        total_amount: order.total_amount || 0,
        tax_amount: (order.total_amount || 0) * 0.08, // Assuming 8% tax
        created_at: order.created_at,
        updated_at: order.created_at,
        pickup_time: order.pickup_time,
        profiles: {
          name: order.users?.name || 'Unknown Customer',
          email: order.users?.email || ''
        },
        stores: {
          name: order.stores?.name || 'Unknown Store'
        },
        order_items: order.order_items || []
      }));

      return transformedOrders;
    },
  });

  const orders = ordersQuery.data || [];

  // Calculate stats from orders
  const stats: OrdersStats = {
    total_orders: orders.length,
    pending_orders: orders.filter(o => o.status === 'pending').length,
    ready_orders: orders.filter(o => o.status === 'ready_for_pickup').length,
    total_revenue: orders.reduce((sum, o) => sum + (o.total_amount || 0), 0),
    today_orders: orders.filter(o => {
      const today = new Date().toDateString();
      return new Date(o.created_at).toDateString() === today;
    }).length,
    cancelled_orders: orders.filter(o => o.status === 'cancelled').length
  };

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }: { orderId: string; status: string }) => {
      console.log('Updating order status:', orderId, status);
      
      // Mock update for now
      await new Promise(resolve => setTimeout(resolve, 500));
      
      // In real implementation, update via Supabase
      // const { error } = await supabase
      //   .from('orders')
      //   .update({ status })
      //   .eq('id', orderId);
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
    orders,
    loading: ordersQuery.isLoading,
    error: ordersQuery.error,
    stats,
    updateOrderStatus: (orderId: string, status: string) => 
      updateOrderStatusMutation.mutate({ orderId, status }),
  };
};
