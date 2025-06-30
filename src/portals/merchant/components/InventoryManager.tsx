
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Package, AlertTriangle, Edit, Save, X } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  product_name: string;
  sku: string;
  quantity: number;
  price: number;
  low_stock_threshold: number;
  store_name: string;
}

interface InventoryManagerProps {
  merchantId: string;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({ merchantId }) => {
  const [inventory, setInventory] = useState<InventoryItem[]>([
    {
      id: '1',
      product_name: 'Premium Coffee Beans',
      sku: 'COFFEE-001',
      quantity: 15,
      price: 12.99,
      low_stock_threshold: 10,
      store_name: 'Downtown Cafe'
    },
    {
      id: '2',
      product_name: 'Organic Green Tea',
      sku: 'TEA-002',
      quantity: 5,
      price: 8.99,
      low_stock_threshold: 8,
      store_name: 'Downtown Cafe'
    }
  ]);

  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [editValues, setEditValues] = useState<{quantity: number; price: number}>({
    quantity: 0,
    price: 0
  });

  const isLowStock = (item: InventoryItem) => {
    return item.quantity <= item.low_stock_threshold;
  };

  const handleEdit = (item: InventoryItem) => {
    setEditingItem(item.id);
    setEditValues({
      quantity: item.quantity,
      price: item.price
    });
  };

  const handleSave = (itemId: string) => {
    setInventory(prev => prev.map(item => 
      item.id === itemId 
        ? { ...item, quantity: editValues.quantity, price: editValues.price }
        : item
    ));
    setEditingItem(null);
    toast.success('Inventory updated successfully');
  };

  const handleCancel = () => {
    setEditingItem(null);
    setEditValues({ quantity: 0, price: 0 });
  };

  const lowStockItems = inventory.filter(isLowStock);

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Card className="border-orange-200 bg-orange-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-orange-800">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alerts ({lowStockItems.length})
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="font-medium">{item.product_name}</span>
                  <Badge variant="destructive">
                    {item.quantity} left (threshold: {item.low_stock_threshold})
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Package className="w-5 h-5" />
            Inventory Management
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {inventory.map(item => (
              <div key={item.id} className="border rounded-lg p-4">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium">{item.product_name}</h4>
                        <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                        <p className="text-sm text-gray-600">Store: {item.store_name}</p>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-4">
                    {editingItem === item.id ? (
                      <div className="flex items-center gap-2">
                        <div>
                          <label className="text-xs text-gray-600">Quantity</label>
                          <Input
                            type="number"
                            value={editValues.quantity}
                            onChange={(e) => setEditValues(prev => ({ ...prev, quantity: parseInt(e.target.value) || 0 }))}
                            className="w-20"
                          />
                        </div>
                        <div>
                          <label className="text-xs text-gray-600">Price ($)</label>
                          <Input
                            type="number"
                            step="0.01"
                            value={editValues.price}
                            onChange={(e) => setEditValues(prev => ({ ...prev, price: parseFloat(e.target.value) || 0 }))}
                            className="w-24"
                          />
                        </div>
                        <div className="flex gap-1">
                          <Button
                            size="sm"
                            onClick={() => handleSave(item.id)}
                          >
                            <Save className="w-3 h-3" />
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={handleCancel}
                          >
                            <X className="w-3 h-3" />
                          </Button>
                        </div>
                      </div>
                    ) : (
                      <div className="flex items-center gap-4">
                        <div className="text-right">
                          <div className="font-medium">Qty: {item.quantity}</div>
                          <div className="text-sm text-gray-600">${item.price}</div>
                        </div>
                        <Badge 
                          variant={isLowStock(item) ? "destructive" : "default"}
                        >
                          {isLowStock(item) ? 'Low Stock' : 'In Stock'}
                        </Badge>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleEdit(item)}
                        >
                          <Edit className="w-3 h-3" />
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
            
            {inventory.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <Package className="w-12 h-12 mx-auto mb-4 text-gray-400" />
                <p>No inventory items found</p>
                <p className="text-sm">Add products to your stores to manage inventory</p>
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
