
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

interface ProductFiltersProps {
  categories: string[];
  stores: any[];
  selectedCategory: string;
  selectedStore: string;
  onCategoryChange: (category: string) => void;
  onStoreChange: (store: string) => void;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  categories,
  stores,
  selectedCategory,
  selectedStore,
  onCategoryChange,
  onStoreChange
}) => {
  return (
    <div className="flex gap-4">
      <Select value={selectedCategory} onValueChange={onCategoryChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map(category => (
            <SelectItem key={category} value={category}>
              {category}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={selectedStore} onValueChange={onStoreChange}>
        <SelectTrigger className="w-48">
          <SelectValue placeholder="Store" />
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

export default ProductFilters;
