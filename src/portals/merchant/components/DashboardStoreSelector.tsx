
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store, Building } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';
import { useStoreFilter } from '../contexts/StoreFilterContext';

const DashboardStoreSelector: React.FC = () => {
  const { stores, selectedStoreId, setSelectedStoreId, loading } = useStoreFilter();

  if (loading) {
    return (
      <Card className="mb-6">
        <CardContent className="p-4">
          <div className="flex items-center gap-3 animate-pulse">
            <Building className="w-5 h-5 text-gray-400" />
            <div className="h-4 bg-gray-200 rounded w-32"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!stores || stores.length === 0) {
    return null;
  }

  return (
    <Card className="mb-6 bg-blue-50 border-blue-200">
      <CardContent className="p-4">
        <div className="flex items-center gap-3">
          <Building className="w-5 h-5 text-blue-600" />
          <div className="flex-1">
            <p className="text-sm font-medium text-blue-900 mb-1">Store Data View</p>
            <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
              <SelectTrigger className="w-64 bg-white border-blue-300">
                <SelectValue placeholder="Select store view..." />
              </SelectTrigger>
              <SelectContent>
                {stores.length > 1 && (
                  <SelectItem value="all">
                    <div className="flex items-center gap-2">
                      <Store className="w-4 h-4" />
                      All Stores (Aggregated)
                    </div>
                  </SelectItem>
                )}
                {stores.map(store => (
                  <SelectItem key={store.id} value={store.id}>
                    <div className="flex items-center gap-2">
                      <Building className="w-4 h-4" />
                      {store.name}
                    </div>
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="text-right">
            <p className="text-xs text-blue-600">
              {selectedStoreId === 'all' ? 'Viewing all stores' : `Filtered to: ${stores.find(s => s.id === selectedStoreId)?.name}`}
            </p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default DashboardStoreSelector;
