
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Store as StoreIcon } from 'lucide-react';
import { useStores } from '../hooks/useStores';
import StoreCard from '../components/StoreCard';
import CreateStoreDialog from '../components/CreateStoreDialog';
import { Store, CreateStoreData } from '../types/store';

const Stores: React.FC = () => {
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedStore, setSelectedStore] = useState<Store | null>(null);
  const [createLoading, setCreateLoading] = useState(false);
  
  const { stores, loading, createStore, toggleStoreStatus } = useStores('debug-merchant-id');

  const handleCreateStore = async (data: CreateStoreData) => {
    try {
      setCreateLoading(true);
      await createStore(data);
      setShowCreateDialog(false);
    } catch (error) {
      console.error('Error creating store:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditStore = (store: Store) => {
    setSelectedStore(store);
    // TODO: Implement edit dialog
    console.log('Edit store:', store);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Stores</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-6 bg-gray-200 rounded mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold flex items-center gap-3">
            <StoreIcon className="w-8 h-8" />
            Stores
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your store locations and settings
          </p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </Button>
      </div>

      {stores.length === 0 ? (
        <div className="text-center py-12">
          <StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first store to start selling products to customers.
          </p>
          <Button onClick={() => setShowCreateDialog(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Store
          </Button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {stores.map(store => (
              <StoreCard
                key={store.id}
                store={store}
                onEdit={handleEditStore}
                onToggleStatus={toggleStoreStatus}
              />
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Need help setting up your store?</h3>
            <p className="text-blue-700 text-sm mb-3">
              Make sure to complete your store verification to start accepting orders.
            </p>
            <Button variant="outline" size="sm" className="text-blue-700 border-blue-300">
              View Setup Guide
            </Button>
          </div>
        </>
      )}

      <CreateStoreDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onSubmit={handleCreateStore}
        loading={createLoading}
      />
    </div>
  );
};

export default Stores;
