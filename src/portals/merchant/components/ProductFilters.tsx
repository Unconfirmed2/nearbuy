
import React from 'react';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Search, Filter, X } from 'lucide-react';
import { ProductFilters as FilterType } from '../types/product';

interface ProductFiltersProps {
  filters: FilterType;
  onFiltersChange: (filters: FilterType) => void;
  categories: Array<{ id: string; name: string }>;
  stores: Array<{ id: string; name: string }>;
}

const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFiltersChange,
  categories,
  stores
}) => {
  const handleFilterChange = (key: keyof FilterType, value: any) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  const clearFilters = () => {
    onFiltersChange({});
  };

  const activeFiltersCount = Object.values(filters).filter(Boolean).length;

  return (
    <div className="space-y-4">
      <div className="flex gap-4 items-center flex-wrap">
        <div className="relative flex-1 min-w-64">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Search products..."
            value={filters.search || ''}
            onChange={(e) => handleFilterChange('search', e.target.value)}
            className="pl-10"
          />
        </div>

        <Select value={filters.category_id || ''} onValueChange={(value) => handleFilterChange('category_id', value || undefined)}>
          <SelectTrigger className="w-48">
            <SelectValue placeholder="Category" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All Categories</SelectItem>
            {categories.map(category => (
              <SelectItem key={category.id} value={category.id}>
                {category.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {stores.length > 1 && (
          <Select value={filters.store_id || ''} onValueChange={(value) => handleFilterChange('store_id', value || undefined)}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Store" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="">All Stores</SelectItem>
              {stores.map(store => (
                <SelectItem key={store.id} value={store.id}>
                  {store.name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        )}

        <Select value={filters.is_active?.toString() || ''} onValueChange={(value) => handleFilterChange('is_active', value ? value === 'true' : undefined)}>
          <SelectTrigger className="w-32">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="">All</SelectItem>
            <SelectItem value="true">Active</SelectItem>
            <SelectItem value="false">Inactive</SelectItem>
          </SelectContent>
        </Select>

        <Button
          variant="outline"
          onClick={() => handleFilterChange('low_stock', !filters.low_stock)}
          className={filters.low_stock ? 'bg-red-50 border-red-200 text-red-700' : ''}
        >
          <Filter className="h-4 w-4 mr-2" />
          Low Stock
        </Button>

        {activeFiltersCount > 0 && (
          <Button variant="ghost" onClick={clearFilters} size="sm">
            <X className="h-4 w-4 mr-1" />
            Clear ({activeFiltersCount})
          </Button>
        )}
      </div>

      {activeFiltersCount > 0 && (
        <div className="flex gap-2 flex-wrap">
          {filters.search && (
            <Badge variant="secondary" className="gap-1">
              Search: {filters.search}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('search', undefined)} />
            </Badge>
          )}
          {filters.category_id && (
            <Badge variant="secondary" className="gap-1">
              Category: {categories.find(c => c.id === filters.category_id)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('category_id', undefined)} />
            </Badge>
          )}
          {filters.store_id && (
            <Badge variant="secondary" className="gap-1">
              Store: {stores.find(s => s.id === filters.store_id)?.name}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('store_id', undefined)} />
            </Badge>
          )}
          {filters.is_active !== undefined && (
            <Badge variant="secondary" className="gap-1">
              {filters.is_active ? 'Active' : 'Inactive'}
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('is_active', undefined)} />
            </Badge>
          )}
          {filters.low_stock && (
            <Badge variant="secondary" className="gap-1">
              Low Stock
              <X className="h-3 w-3 cursor-pointer" onClick={() => handleFilterChange('low_stock', undefined)} />
            </Badge>
          )}
        </div>
      )}
    </div>
  );
};

export default ProductFilters;
