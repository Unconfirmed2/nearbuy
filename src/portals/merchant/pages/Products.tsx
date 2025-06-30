
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Package, Upload } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import DuplicateProductDialog from '../components/DuplicateProductDialog';
import BulkProductUpload from '../components/BulkProductUpload';
import InventoryManager from '../components/InventoryManager';
import { toast } from 'sonner';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [sortBy, setSortBy] = useState('name');
  const [showCreateProduct, setShowCreateProduct] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState<any>(null);
  const [createLoading, setCreateLoading] = useState(false);

  const { products, loading, createProduct } = useProducts('debug-merchant-id');

  const categories = [
    'Electronics', 'Clothing', 'Home & Garden', 'Sports', 'Books',
    'Health & Beauty', 'Automotive', 'Toys', 'Food & Beverage', 'Other'
  ];

  const sortOptions = [
    { label: 'Name', value: 'name' },
    { label: 'Price', value: 'price' },
    { label: 'Date Added', value: 'created_at' }
  ];

  const filteredProducts = products
    .filter(product =>
      product.name.toLowerCase().includes(searchTerm.toLowerCase()) &&
      (categoryFilter === 'all' || product.category_id === categoryFilter)
    )
    .sort((a, b) => {
      if (sortBy === 'name') {
        return a.name.localeCompare(b.name);
      } else if (sortBy === 'price') {
        return a.price - b.price;
      } else if (sortBy === 'created_at') {
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime();
      }
      return 0;
    });

  const handleCreateProduct = async (productData: any) => {
    try {
      setCreateLoading(true);
      await createProduct(productData);
      setShowCreateProduct(false);
      toast.success('Product created successfully');
    } catch (error) {
      toast.error('Failed to create product');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleDuplicateProduct = async (productData: any) => {
    try {
      setCreateLoading(true);
      await createProduct(productData);
      setShowDuplicateDialog(false);
      setSelectedProduct(null);
      toast.success('Product duplicated successfully');
    } catch (error) {
      toast.error('Failed to duplicate product');
    } finally {
      setCreateLoading(false);
    }
  };

  const handleEdit = (product: any) => {
    setSelectedProduct(product);
    setShowCreateProduct(true);
  };

  const handleDuplicate = (product: any) => {
    setSelectedProduct(product);
    setShowDuplicateDialog(true);
  };

  const handleDelete = (productId: string) => {
    console.log('Delete product:', productId);
    // TODO: Implement delete functionality
  };

  const handleToggleStatus = (productId: string, isActive: boolean) => {
    console.log('Toggle product status:', productId, isActive);
    // TODO: Implement toggle status functionality
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {[1, 2, 3, 4].map(i => (
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

  if (!products) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
        </div>
        <div className="text-center text-red-600">
          Failed to load products. Please try again.
        </div>
      </div>
    );
  }

  const ProductFilters: React.FC<{
    searchTerm: string;
    onSearchChange: (term: string) => void;
    categoryFilter: string;
    onCategoryChange: (category: string) => void;
    sortBy: string;
    onSortChange: (sortBy: string) => void;
  }> = ({ searchTerm, onSearchChange, categoryFilter, onCategoryChange, sortBy, onSortChange }) => (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      <Input
        type="search"
        placeholder="Search products..."
        value={searchTerm}
        onChange={(e) => onSearchChange(e.target.value)}
      />
      <Select value={categoryFilter} onValueChange={onCategoryChange}>
        <SelectTrigger>
          <SelectValue placeholder="Select category" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="all">All Categories</SelectItem>
          {categories.map(cat => (
            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
          ))}
        </SelectContent>
      </Select>
      <Select value={sortBy} onValueChange={onSortChange}>
        <SelectTrigger>
          <SelectValue placeholder="Sort by" />
        </SelectTrigger>
        <SelectContent>
          {sortOptions.map(option => (
            <SelectItem key={option.value} value={option.value}>{option.label}</SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => {}}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setShowCreateProduct(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList>
          <TabsTrigger value="products">Products</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Upload</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          <ProductFilters
            searchTerm={searchTerm}
            onSearchChange={setSearchTerm}
            categoryFilter={categoryFilter}
            onCategoryChange={setCategoryFilter}
            sortBy={sortBy}
            onSortChange={setSortBy}
          />

          {filteredProducts.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600 mb-6">
                Add your first product to start selling to customers.
              </p>
              <Button onClick={() => setShowCreateProduct(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Create Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEdit}
                  onDuplicate={handleDuplicate}
                  onDelete={handleDelete}
                  onToggleStatus={handleToggleStatus}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryManager merchantId="debug-merchant-id" />
        </TabsContent>

        <TabsContent value="bulk-upload">
          <BulkProductUpload merchantId="debug-merchant-id" />
        </TabsContent>
      </Tabs>

      <ProductForm
        open={showCreateProduct}
        onClose={() => {
          setShowCreateProduct(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleCreateProduct}
        product={selectedProduct}
        loading={createLoading}
      />

      <DuplicateProductDialog
        open={showDuplicateDialog}
        onClose={() => {
          setShowDuplicateDialog(false);
          setSelectedProduct(null);
        }}
        onSubmit={handleDuplicateProduct}
        product={selectedProduct}
        loading={createLoading}
      />
    </div>
  );
};

export default Products;
