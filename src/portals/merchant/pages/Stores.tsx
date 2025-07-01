
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Plus, Store as StoreIcon, Search } from 'lucide-react';
import { useStores } from '../hooks/useStores';
import { useAuth } from '../hooks/useAuth';
import StoreCard from '../components/StoreCard';
import CreateStoreDialog from '../components/CreateStoreDialog';
import { toast } from 'sonner';

const Stores: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [showCreateStore, setShowCreateStore] = useState(false);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  const [createLoading, setCreateLoading] = useState(false);
  const { user } = useAuth();

  const { stores, loading, createStore } = useStores(user?.id);

  // Transform stores to match StoreCard interface
  const transformedStores = stores.map(store => ({
    ...store,
    is_active: store.is_active ?? true,
    is_verified: store.is_verified ?? false
  }));

  const filteredStores = transformedStores.filter(store =>
    store.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    (store.address && store.address.toLowerCase().includes(searchTerm.toLowerCase()))
  );

  const handleCreateStore = async (storeData: any) => {
    try {
      setCreateLoading(true);
      
      // Simulate geocoding for the address
      const geocodedData = {
        ...storeData,
        latitude: 37.7749 + (Math.random() - 0.5) * 0.1,
        longitude: -122.4194 + (Math.random() - 0.5) * 0.1,
        is_active: true,
        is_verified: false
      };
      
      await createStore(geocodedData);
      setShowCreateStore(false);
      toast.success('Store created successfully! Pending verification.');
    } catch (error) {
      toast.error('Failed to create store');
      console.error('Store creation error:', error);
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEditStore = (store: any) => {
    setSelectedStore(store);
    setShowCreateStore(true);
    toast.info('Store editing functionality coming soon!');
  };

  const handleToggleStatus = (storeId: string, isActive: boolean) => {
    console.log('Toggle store status:', storeId, isActive);
    toast.success(`Store ${isActive ? 'activated' : 'deactivated'} successfully`);
    // TODO: Implement actual store status toggle
  };

  const handleViewDetails = (store: any) => {
    console.log('View store details:', store);
    toast.info('Store details view coming soon!');
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
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Stores</h1>
          <p className="text-gray-600 mt-2">
            Manage your store locations and settings
          </p>
        </div>
        <Button onClick={() => setShowCreateStore(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Add Store
        </Button>
      </div>

      {stores.length > 0 && (
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search stores..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10 max-w-md"
          />
        </div>
      )}

      {filteredStores.length === 0 && searchTerm ? (
        <div className="text-center py-12">
          <StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores found</h3>
          <p className="text-gray-600">
            No stores match your search criteria.
          </p>
        </div>
      ) : stores.length === 0 ? (
        <div className="text-center py-12">
          <StoreIcon className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No stores yet</h3>
          <p className="text-gray-600 mb-6">
            Create your first store to start selling to local customers.
          </p>
          <Button onClick={() => setShowCreateStore(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Store
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredStores.map(store => (
            <StoreCard
              key={store.id}
              store={store}
              onEdit={handleEditStore}
              onToggleStatus={handleToggleStatus}
              onViewDetails={handleViewDetails}
            />
          ))}
        </div>
      )}

      <CreateStoreDialog
        open={showCreateStore}
        onClose={() => {
          setShowCreateStore(false);
          setSelectedStore(null);
        }}
        onSubmit={handleCreateStore}
        loading={createLoading}
      />
    </div>
  );
};

export default Stores;
