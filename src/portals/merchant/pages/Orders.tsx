
import React, { useState } from 'react';
import OrderDetailsModal from '../components/OrderDetailsModal';
import OrdersFilters from '../components/OrdersFilters';
import OrdersSummaryCards from '../components/OrdersSummaryCards';
import OrdersTable from '../components/OrdersTable';
import { useOrders } from '../hooks/useOrders';
import { Order } from '../types/order';

const Orders: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);

  const { orders, isLoading, error, updateOrderStatus } = useOrders(searchTerm, statusFilter);

  const handleStatusChange = (orderId: string, newStatus: string) => {
    updateOrderStatus({ orderId, status: newStatus });
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="flex items-center justify-center h-64">
          <div className="text-gray-500">Loading orders...</div>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="text-center text-red-600">
          Failed to load orders. Please try again.
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Orders</h1>
        <div className="text-sm text-gray-500">
          {orders.length} order{orders.length !== 1 ? 's' : ''} found
        </div>
      </div>

      <OrdersSummaryCards orders={orders} />

      <OrdersFilters
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        statusFilter={statusFilter}
        onStatusFilterChange={setStatusFilter}
      />

      <OrdersTable
        orders={orders}
        onViewOrder={setSelectedOrder}
        onStatusChange={handleStatusChange}
      />

      {selectedOrder && (
        <OrderDetailsModal
          order={selectedOrder}
          open={!!selectedOrder}
          onClose={() => setSelectedOrder(null)}
          onStatusUpdate={(orderId, status) => {
            handleStatusChange(orderId, status);
            setSelectedOrder(null);
          }}
        />
      )}
    </div>
  );
};

export default Orders;
