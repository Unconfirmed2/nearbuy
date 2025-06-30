
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

export const useOrders = (merchantId: string, searchTerm?: string, statusFilter?: string) => {
  const queryClient = useQueryClient();

  const ordersQuery = useQuery({
    queryKey: ['merchant-orders', merchantId, searchTerm, statusFilter],
    queryFn: async (): Promise<OrderWithDetails[]> => {
      console.log('Fetching orders for merchant:', merchantId);
      
      // For now, return mock data since we don't have real orders yet
      await new Promise(resolve => setTimeout(resolve, 500));
      
      const mockOrders: OrderWithDetails[] = [
        {
          id: 'order-1',
          order_number: 'ORD-1001',
          customer_name: 'John Doe',
          customer_email: 'john.doe@email.com',
          store_name: 'Downtown Electronics',
          items_count: 3,
          user_id: 'user-1',
          store_id: 'store-1',
          status: 'pending',
          total_amount: 299.99,
          tax_amount: 24.00,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          pickup_time: new Date(Date.now() + 86400000).toISOString(), // Tomorrow
          profiles: {
            name: 'John Doe',
            email: 'john.doe@email.com'
          },
          stores: {
            name: 'Downtown Electronics'
          },
          order_items: [
            {
              quantity: 2,
              unit_price: 149.99,
              products: {
                name: 'Wireless Headphones',
                brand: 'TechBrand'
              }
            }
          ]
        },
        {
          id: 'order-2',
          order_number: 'ORD-1002',
          customer_name: 'Jane Smith',
          customer_email: 'jane.smith@email.com',
          store_name: 'Downtown Electronics',
          items_count: 1,
          user_id: 'user-2',
          store_id: 'store-1',
          status: 'ready_for_pickup',
          total_amount: 149.99,
          tax_amount: 12.00,
          created_at: new Date(Date.now() - 86400000).toISOString(), // Yesterday
          updated_at: new Date().toISOString(),
          pickup_time: new Date(Date.now() + 43200000).toISOString(), // 12 hours from now
          profiles: {
            name: 'Jane Smith',
            email: 'jane.smith@email.com'
          },
          stores: {
            name: 'Downtown Electronics'
          },
          order_items: [
            {
              quantity: 1,
              unit_price: 149.99,
              products: {
                name: 'Bluetooth Speaker',
                brand: 'AudioTech'
              }
            }
          ]
        }
      ];
      
      return mockOrders;
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
