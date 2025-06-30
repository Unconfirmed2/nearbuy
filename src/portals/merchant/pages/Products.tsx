
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Plus, Package, LayoutGrid, List } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useStores } from '../hooks/useStores';
import ProductCard from '../components/ProductCard';
import ProductFilters from '../components/ProductFilters';
import { ProductFilters as FilterType, Product } from '../types/product';

const Products: React.FC = () => {
  const [filters, setFilters] = useState<FilterType>({});
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  const { 
    products, 
    loading, 
    toggleProductStatus, 
    duplicateProduct, 
    deleteProduct,
    refetch 
  } = useProducts('debug-merchant-id');
  
  const { stores } = useStores('debug-merchant-id');

  // Mock categories for development
  const mockCategories = [
    { id: 'cat-1', name: 'Smartphones' },
    { id: 'cat-2', name: 'Laptops' },
    { id: 'cat-3', name: 'Audio' },
    { id: 'cat-4', name: 'Accessories' }
  ];

  const handleFiltersChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    refetch(newFilters);
  };

  const handleEditProduct = (product: Product) => {
    console.log('Edit product:', product);
    // TODO: Implement edit dialog
  };

  const handleDeleteProduct = async (productId: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      await deleteProduct(productId);
    }
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-4 rounded-lg shadow-sm animate-pulse">
              <div className="aspect-square bg-gray-200 rounded-lg mb-4"></div>
              <div className="space-y-2">
                <div className="h-4 bg-gray-200 rounded"></div>
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-6 bg-gray-200 rounded w-1/2"></div>
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
            <Package className="w-8 h-8" />
            Products
          </h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center border rounded-lg">
            <Button
              variant={viewMode === 'grid' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('grid')}
              className="rounded-r-none"
            >
              <LayoutGrid className="w-4 h-4" />
            </Button>
            <Button
              variant={viewMode === 'list' ? 'default' : 'ghost'}
              size="sm"
              onClick={() => setViewMode('list')}
              className="rounded-l-none"
            >
              <List className="w-4 h-4" />
            </Button>
          </div>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <ProductFilters
        filters={filters}
        onFiltersChange={handleFiltersChange}
        categories={mockCategories}
        stores={stores}
      />

      {products.length === 0 ? (
        <div className="text-center py-12">
          <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">
            {Object.keys(filters).length > 0 ? 'No products match your filters' : 'No products yet'}
          </h3>
          <p className="text-gray-600 mb-6">
            {Object.keys(filters).length > 0 
              ? 'Try adjusting your search criteria or filters.'
              : 'Start building your product catalog by adding your first product.'
            }
          </p>
          {Object.keys(filters).length === 0 && (
            <Button>
              <Plus className="w-4 h-4 mr-2" />
              Add Your First Product
            </Button>
          )}
        </div>
      ) : (
        <>
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{products.length} product{products.length !== 1 ? 's' : ''}</span>
            <div className="flex items-center gap-4">
              <span>{products.filter(p => p.is_active).length} active</span>
              <span>{products.filter(p => !p.is_active).length} inactive</span>
              <span>{products.filter(p => {
                const inventory = p.inventory?.[0];
                return inventory && inventory.quantity <= inventory.low_stock_threshold;
              }).length} low stock</span>
            </div>
          </div>

          <div className={viewMode === 'grid' 
            ? 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6'
            : 'space-y-4'
          }>
            {products.map(product => (
              <ProductCard
                key={product.id}
                product={product}
                onEdit={handleEditProduct}
                onDuplicate={duplicateProduct}
                onDelete={handleDeleteProduct}
                onToggleStatus={toggleProductStatus}
              />
            ))}
          </div>

          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <h3 className="font-medium text-blue-900 mb-2">Product Management Tips</h3>
            <ul className="text-blue-700 text-sm space-y-1">
              <li>• Keep your product images high-quality and consistent</li>
              <li>• Use descriptive SKUs for better inventory tracking</li>
              <li>• Set up low stock alerts to avoid running out</li>
              <li>• Add relevant tags to help customers find your products</li>
            </ul>
          </div>
        </>
      )}
    </div>
  );
};

export default Products;
