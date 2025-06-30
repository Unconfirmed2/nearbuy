
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Package, AlertTriangle, TrendingDown, Search, Edit } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  store_name: string;
  current_stock: number;
  min_stock_level: number;
  max_stock_level: number;
  price: number;
  last_updated: string;
}

interface InventoryManagerProps {
  storeId?: string;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ storeId }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{ [key: string]: number }>({});

  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: 'inv-1',
      product_name: 'Premium Skinny Jeans',
      sku: 'PSJ-001',
      store_name: 'Downtown Store',
      current_stock: 5,
      min_stock_level: 10,
      max_stock_level: 100,
      price: 89.99,
      last_updated: new Date().toISOString()
    },
    {
      id: 'inv-2',
      product_name: 'Classic T-Shirt',
      sku: 'CTS-002',
      store_name: 'Downtown Store',
      current_stock: 25,
      min_stock_level: 15,
      max_stock_level: 200,
      price: 24.99,
      last_updated: new Date().toISOString()
    },
    {
      id: 'inv-3',
      product_name: 'Denim Jacket',
      sku: 'DJ-003',
      store_name: 'Mall Location',
      current_stock: 2,
      min_stock_level: 5,
      max_stock_level: 50,
      price: 129.99,
      last_updated: new Date().toISOString()
    }
  ]);

  const filteredInventory = inventory.filter(item =>
    item.product_name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    item.sku.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const lowStockItems = inventory.filter(item => item.current_stock <= item.min_stock_level);

  const getStockStatus = (item: InventoryItem) => {
    if (item.current_stock === 0) {
      return { color: 'bg-red-100 text-red-800', label: 'Out of Stock' };
    } else if (item.current_stock <= item.min_stock_level) {
      return { color: 'bg-yellow-100 text-yellow-800', label: 'Low Stock' };
    } else if (item.current_stock >= item.max_stock_level * 0.8) {
      return { color: 'bg-blue-100 text-blue-800', label: 'High Stock' };
    }
    return { color: 'bg-green-100 text-green-800', label: 'In Stock' };
  };

  const handleEdit = (itemId: string, field: string, value: number) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, [field]: value, last_updated: new Date().toISOString() }
        : item
    ));
    setEditingItem(null);
    setEditValues({});
    toast.success('Inventory updated successfully');
  };

  const startEditing = (itemId: string, currentValue: number) => {
    setEditingItem(itemId);
    setEditValues({ [itemId]: currentValue });
  };

  const handleBulkStockUpdate = () => {
    toast.info('Bulk stock update functionality coming soon');
  };

  return (
    <div className="space-y-6">
      {/* Low Stock Alert */}
      {lowStockItems.length > 0 && (
        <Alert variant="destructive">
          <AlertTriangle className="h-4 w-4" />
          <AlertDescription>
            <div className="flex items-center justify-between">
              <span>
                {lowStockItems.length} product{lowStockItems.length > 1 ? 's' : ''} running low on stock
              </span>
              <Button variant="outline" size="sm">
                View Low Stock Items
              </Button>
            </div>
          </AlertDescription>
        </Alert>
      )}

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Products</p>
                <p className="text-2xl font-bold">{inventory.length}</p>
              </div>
              <Package className="w-8 h-8 text-blue-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Low Stock</p>
                <p className="text-2xl font-bold text-yellow-600">{lowStockItems.length}</p>
              </div>
              <AlertTriangle className="w-8 h-8 text-yellow-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Out of Stock</p>
                <p className="text-2xl font-bold text-red-600">
                  {inventory.filter(item => item.current_stock === 0).length}
                </p>
              </div>
              <TrendingDown className="w-8 h-8 text-red-500" />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Value</p>
                <p className="text-2xl font-bold">
                  ${inventory.reduce((sum, item) => sum + (item.current_stock * item.price), 0).toFixed(2)}
                </p>
              </div>
              <Package className="w-8 h-8 text-green-500" />
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Inventory Table */}
      <Card>
        <CardHeader>
          <div className="flex justify-between items-center">
            <CardTitle>Inventory Management</CardTitle>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                <Input
                  placeholder="Search products..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 w-64"
                />
              </div>
              <Button variant="outline" onClick={handleBulkStockUpdate}>
                Bulk Update
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-3">Product</th>
                  <th className="text-left p-3">SKU</th>
                  <th className="text-left p-3">Store</th>
                  <th className="text-left p-3">Current Stock</th>
                  <th className="text-left p-3">Min/Max</th>
                  <th className="text-left p-3">Status</th>
                  <th className="text-left p-3">Value</th>
                  <th className="text-left p-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredInventory.map(item => {
                  const status = getStockStatus(item);
                  return (
                    <tr key={item.id} className="border-b">
                      <td className="p-3 font-medium">{item.product_name}</td>
                      <td className="p-3 text-gray-600">{item.sku}</td>
                      <td className="p-3 text-gray-600">{item.store_name}</td>
                      <td className="p-3">
                        {editingItem === item.id ? (
                          <div className="flex items-center gap-2">
                            <Input
                              type="number"
                              value={editValues[item.id] || item.current_stock}
                              onChange={(e) => setEditValues(prev => ({
                                ...prev,
                                [item.id]: parseInt(e.target.value) || 0
                              }))}
                              className="w-20"
                            />
                            <Button
                              size="sm"
                              onClick={() => handleEdit(item.id, 'current_stock', editValues[item.id])}
                            >
                              Save
                            </Button>
                          </div>
                        ) : (
                          <span className="font-medium">{item.current_stock}</span>
                        )}
                      </td>
                      <td className="p-3 text-gray-600">
                        {item.min_stock_level} / {item.max_stock_level}
                      </td>
                      <td className="p-3">
                        <Badge className={status.color}>
                          {status.label}
                        </Badge>
                      </td>
                      <td className="p-3">
                        ${(item.current_stock * item.price).toFixed(2)}
                      </td>
                      <td className="p-3">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => startEditing(item.id, item.current_stock)}
                        >
                          <Edit className="w-4 h-4" />
                        </Button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
