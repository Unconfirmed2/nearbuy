import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Plus, Search, Package, Upload, Copy } from 'lucide-react';
import { useProducts } from '../hooks/useProducts';
import { useStores } from '../hooks/useStores';
import ProductCard from '../components/ProductCard';
import ProductForm from '../components/ProductForm';
import ProductFilters from '../components/ProductFilters';
import BulkProductUpload from '../components/BulkProductUpload';
import DuplicateProductDialog from '../components/DuplicateProductDialog';
import InventoryManager from '../components/InventoryManager';
import { toast } from 'sonner';

const Products: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedStore, setSelectedStore] = useState('all');
  const [showProductForm, setShowProductForm] = useState(false);
  const [showBulkUpload, setShowBulkUpload] = useState(false);
  const [showDuplicateDialog, setShowDuplicateDialog] = useState(false);
  const [editingProduct, setEditingProduct] = useState<any>(null);
  const [duplicatingProduct, setDuplicatingProduct] = useState<any>(null);

  const { products, loading, createProduct, updateProduct, deleteProduct } = useProducts('debug-merchant-id');
  const { stores } = useStores('debug-merchant-id');

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         product.sku.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = selectedCategory === 'all' || product.category === selectedCategory;
    const matchesStore = selectedStore === 'all' || product.store_id === selectedStore;
    
    return matchesSearch && matchesCategory && matchesStore;
  });

  const categories = Array.from(new Set(products.map(p => p.category))).filter(Boolean);

  const handleCreateProduct = async (productData: any) => {
    try {
      await createProduct(productData);
      setShowProductForm(false);
      setEditingProduct(null);
      toast.success('Product created successfully');
    } catch (error) {
      toast.error('Failed to create product');
      console.error('Product creation error:', error);
    }
  };

  const handleUpdateProduct = async (productData: any) => {
    if (!editingProduct) return;
    
    try {
      await updateProduct(editingProduct.id, productData);
      setShowProductForm(false);
      setEditingProduct(null);
      toast.success('Product updated successfully');
    } catch (error) {
      toast.error('Failed to update product');
      console.error('Product update error:', error);
    }
  };

  const handleDeleteProduct = async (productId: string) => {
    try {
      await deleteProduct(productId);
      toast.success('Product deleted successfully');
    } catch (error) {
      toast.error('Failed to delete product');
      console.error('Product deletion error:', error);
    }
  };

  const handleEditProduct = (product: any) => {
    setEditingProduct(product);
    setShowProductForm(true);
  };

  const handleDuplicateProduct = (product: any) => {
    setDuplicatingProduct(product);
    setShowDuplicateDialog(true);
  };

  const handleDuplicateSubmit = (productData: any) => {
    handleCreateProduct(productData);
  };

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold">Products</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <div key={i} className="bg-white p-6 rounded-lg shadow-sm animate-pulse">
              <div className="h-32 bg-gray-200 rounded mb-4"></div>
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
          <h1 className="text-3xl font-bold">Products</h1>
          <p className="text-gray-600 mt-2">
            Manage your product catalog and inventory
          </p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowBulkUpload(true)}>
            <Upload className="w-4 h-4 mr-2" />
            Bulk Upload
          </Button>
          <Button onClick={() => setShowProductForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Product
          </Button>
        </div>
      </div>

      <Tabs defaultValue="products" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="products">Product Catalog</TabsTrigger>
          <TabsTrigger value="inventory">Inventory</TabsTrigger>
          <TabsTrigger value="bulk-upload">Bulk Operations</TabsTrigger>
        </TabsList>

        <TabsContent value="products" className="space-y-6">
          {products.length > 0 && (
            <div className="flex flex-col lg:flex-row gap-4">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <ProductFilters
                categories={categories}
                stores={stores}
                selectedCategory={selectedCategory}
                selectedStore={selectedStore}
                onCategoryChange={setSelectedCategory}
                onStoreChange={setSelectedStore}
              />
            </div>
          )}

          {filteredProducts.length === 0 && (searchTerm || selectedCategory !== 'all' || selectedStore !== 'all') ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                No products match your search criteria. Try adjusting your filters.
              </p>
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-12">
              <Package className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products yet</h3>
              <p className="text-gray-600 mb-6">
                Start building your product catalog by adding your first product.
              </p>
              <Button onClick={() => setShowProductForm(true)}>
                <Plus className="w-4 h-4 mr-2" />
                Add Your First Product
              </Button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onEdit={handleEditProduct}
                  onDelete={handleDeleteProduct}
                  onDuplicate={handleDuplicateProduct}
                />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="inventory">
          <InventoryManager />
        </TabsContent>

        <TabsContent value="bulk-upload">
          <BulkProductUpload 
            storeId="debug-store-id"
            onUploadComplete={(results) => {
              console.log('Upload completed:', results);
              toast.success(`Bulk upload completed: ${results.successful} successful, ${results.failed} failed`);
            }}
          />
        </TabsContent>
      </Tabs>

      <ProductForm
        open={showProductForm}
        onClose={() => {
          setShowProductForm(false);
          setEditingProduct(null);
        }}
        onSubmit={editingProduct ? handleUpdateProduct : handleCreateProduct}
        product={editingProduct}
        stores={stores}
      />

      <DuplicateProductDialog
        open={showDuplicateDialog}
        onClose={() => {
          setShowDuplicateDialog(false);
          setDuplicatingProduct(null);
        }}
        product={duplicatingProduct}
        onDuplicate={handleDuplicateSubmit}
      />
    </div>
  );
};

export default Products;
