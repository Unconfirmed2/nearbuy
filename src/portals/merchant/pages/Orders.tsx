import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShoppingCart, Clock, Bell } from 'lucide-react';
import { useOrders } from '../hooks/useOrders';
import { useAuth } from '../hooks/useAuth';
import { useStores } from '../hooks/useStores';
import OrdersFilters from '../components/OrdersFilters';
import OrdersSummaryCards from '../components/OrdersSummaryCards';
import OrdersTable from '../components/OrdersTable';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrderNotifications from '../components/OrderNotifications';
import PickupScheduling from '../components/PickupScheduling';
import { toast } from 'sonner';

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [storeFilter, setStoreFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showOrderDetails, setShowOrderDetails] = useState(false);

  const { user } = useAuth();
  const { orders, loading, stats, updateOrderStatus } = useOrders(user?.id || '', searchTerm, statusFilter);
  const { stores } = useStores(user?.id);

  const filteredOrders = orders.filter(order => {
    const matchesSearch = 
      order.order_number.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      order.customer_email.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || order.status === statusFilter;
    const matchesStore = storeFilter === 'all' || order.store_id === storeFilter;
    
    return matchesSearch && matchesStatus && matchesStore;
  });

  const handleViewDetails = (order: any) => {
    setSelectedOrder(order);
    setShowOrderDetails(true);
  };

  const handleUpdateStatus = async (orderId: string, newStatus: string) => {
    try {
      updateOrderStatus(orderId, newStatus);
    } catch (error) {
      console.error('Failed to update order status:', error);
    }
  };

  const handleRefund = (orderId: string) => {
    console.log('Process refund for order:', orderId);
    toast.success('Refund processed successfully');
    // TODO: Implement actual refund logic
  };

  const handleExport = () => {
    console.log('Export orders');
    toast.success('Orders exported successfully');
    // TODO: Implement actual export functionality
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Orders</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="h-4 bg-gray-200 rounded"></div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Orders</h1>
          <p className="text-gray-600 mt-2">
            Manage customer orders and fulfillment
          </p>
        </div>
        {stats.pending_orders > 0 && (
          <Badge variant="destructive" className="text-sm">
            {stats.pending_orders} pending orders need attention
          </Badge>
        )}
      </div>

      <Tabs defaultValue="orders" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="orders">Order Management</TabsTrigger>
          <TabsTrigger value="pickup">Pickup Scheduling</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
        </TabsList>

        <TabsContent value="orders" className="space-y-6">
          <OrdersSummaryCards stats={stats} />

          <Card>
            <CardHeader>
              <CardTitle>Order Management</CardTitle>
              <OrdersFilters
                searchTerm={searchTerm}
                onSearchChange={setSearchTerm}
                statusFilter={statusFilter}
                onStatusChange={setStatusFilter}
                storeFilter={storeFilter}
                onStoreChange={setStoreFilter}
                stores={stores}
                onExport={handleExport}
              />
            </CardHeader>
            <CardContent>
              {filteredOrders.length === 0 ? (
                <div className="text-center py-12">
                  <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2">
                    {searchTerm || statusFilter !== 'all' || storeFilter !== 'all' 
                      ? 'No orders match your filters'
                      : 'No orders yet'
                    }
                  </h3>
                  <p className="text-gray-600">
                    {searchTerm || statusFilter !== 'all' || storeFilter !== 'all'
                      ? 'Try adjusting your search criteria.'
                      : 'Orders will appear here when customers make purchases.'
                    }
                  </p>
                </div>
              ) : (
                <OrdersTable
                  orders={filteredOrders}
                  onViewDetails={handleViewDetails}
                  onUpdateStatus={handleUpdateStatus}
                />
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="pickup">
          <PickupScheduling storeId="" />
        </TabsContent>

        <TabsContent value="notifications">
          <OrderNotifications merchantId={user?.id || ''} />
        </TabsContent>
      </Tabs>

      <OrderDetailsModal
        open={showOrderDetails}
        onClose={() => {
          setShowOrderDetails(false);
          setSelectedOrder(null);
        }}
        order={selectedOrder}
        onUpdateStatus={handleUpdateStatus}
        onRefund={handleRefund}
      />
    </div>
  );
};

export default Orders;
