
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Store } from 'lucide-react';

interface StoreSelectorProps {
  stores: { id: string; name: string }[];
  selectedStoreId: string | 'all';
  onStoreChange: (storeId: string) => void;
  label?: string;
  placeholder?: string;
  disabled?: boolean;
  showAllOption?: boolean;
}

const StoreSelector: React.FC<StoreSelectorProps> = ({
  stores,
  selectedStoreId,
  onStoreChange,
  label = "Select Store",
  placeholder = "Choose a store...",
  disabled = false,
  showAllOption = true
}) => {
  if (disabled) {
    return null;
  }

  return (
    <div className="flex items-center gap-2">
      <Store className="w-4 h-4 text-gray-500" />
      <Select value={selectedStoreId} onValueChange={onStoreChange}>
        <SelectTrigger className="w-64">
          <SelectValue placeholder={placeholder} />
        </SelectTrigger>
        <SelectContent>
          {showAllOption && stores.length > 1 && (
            <SelectItem value="all">All Stores</SelectItem>
          )}
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
