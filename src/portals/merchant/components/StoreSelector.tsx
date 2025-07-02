import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store } from 'lucide-react';

interface StoreSelectorProps {
  stores: any[];
  selectedStoreId: string | 'all';
  onStoreChange: (storeId: string) => void;
  label?: string;
  placeholder?: string;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  stores,
  selectedStoreId,
  onStoreChange,
  label = "Select Store",
  placeholder = "Choose a store..."
}) => {
  return (
    <div className="flex items-center gap-2">
      <Store className="w-4 h-4 text-gray-500" />
      <Select value={selectedStoreId} onValueChange={onStoreChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Stores</SelectItem>
          {stores.map(store => (
            <SelectItem key={store.id} value={store.id}>
              {store.name}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
};

export default StoreSelector;