
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { AlertTriangle, Package, TrendingDown, TrendingUp } from 'lucide-react';
import { toast } from 'sonner';

interface InventoryItem {
  id: string;
  product_id: string;
  product_name: string;
  sku: string;
  quantity: number;
  low_stock_threshold: number;
  reserved_quantity: number;
  store_id: string;
  store_name: string;
}

interface InventoryManagerProps {
  inventory: InventoryItem[];
  onUpdateQuantity: (itemId: string, quantity: number) => void;
  onSetLowStockThreshold: (itemId: string, threshold: number) => void;
}

const InventoryManager: React.FC<InventoryManagerProps> = ({
  inventory,
  onUpdateQuantity,
  onSetLowStockThreshold
}) => {
  const [editingItem, setEditingItem] = useState<string | null>(null);
  const [newQuantity, setNewQuantity] = useState<number>(0);
  const [newThreshold, setNewThreshold] = useState<number>(0);

  const lowStockItems = inventory.filter(item => 
    item.quantity <= item.low_stock_threshold
  );

  const handleQuantityUpdate = (itemId: string) => {
    onUpdateQuantity(itemId, newQuantity);
    setEditingItem(null);
    toast.success('Inventory quantity updated');
  };

  const handleThresholdUpdate = (itemId: string) => {
    onSetLowStockThreshold(itemId, newThreshold);
    toast.success('Low stock threshold updated');
  };

  const getStockStatus = (item: InventoryItem) => {
    const availableQuantity = item.quantity - item.reserved_quantity;
    
    if (availableQuantity <= 0) {
      return { label: 'Out of Stock', color: 'bg-red-100 text-red-800', icon: AlertTriangle };
    } else if (availableQuantity <= item.low_stock_threshold) {
      return { label: 'Low Stock', color: 'bg-yellow-100 text-yellow-800', icon: TrendingDown };
    } else {
      return { label: 'In Stock', color: 'bg-green-100 text-green-800', icon: TrendingUp };
    }
  };

  return (
    <div className="space-y-6">
      {lowStockItems.length > 0 && (
        <Card className="border-yellow-200 bg-yellow-50">
          <CardHeader>
            <CardTitle className="flex items-center gap-2 text-yellow-800">
              <AlertTriangle className="w-5 h-5" />
              Low Stock Alert
            </CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-yellow-700 mb-4">
              {lowStockItems.length} item{lowStockItems.length > 1 ? 's' : ''} running low on stock
            </p>
            <div className="space-y-2">
              {lowStockItems.map(item => (
                <div key={item.id} className="flex items-center justify-between p-2 bg-white rounded">
                  <span className="font-medium">{item.product_name}</span>
                  <Badge variant="outline" className="text-yellow-800">
                    {item.quantity - item.reserved_quantity} left
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
            {inventory.map(item => {
              const status = getStockStatus(item);
              const StatusIcon = status.icon;
              const availableQuantity = item.quantity - item.reserved_quantity;

              return (
                <div key={item.id} className="border rounded-lg p-4">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <h4 className="font-medium">{item.product_name}</h4>
                      <p className="text-sm text-gray-600">SKU: {item.sku}</p>
                      <p className="text-sm text-gray-600">Store: {item.store_name}</p>
                    </div>
                    <Badge className={status.color}>
                      <StatusIcon className="w-3 h-3 mr-1" />
                      {status.label}
                    </Badge>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                    <div>
                      <Label>Total Quantity</Label>
                      <p className="font-medium">{item.quantity}</p>
                    </div>
                    <div>
                      <Label>Reserved</Label>
                      <p className="font-medium">{item.reserved_quantity}</p>
                    </div>
                    <div>
                      <Label>Available</Label>
                      <p className="font-medium">{availableQuantity}</p>
                    </div>
                    <div>
                      <Label>Low Stock Threshold</Label>
                      <p className="font-medium">{item.low_stock_threshold}</p>
                    </div>
                  </div>

                  {editingItem === item.id ? (
                    <div className="mt-4 space-y-3">
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={newQuantity}
                          onChange={(e) => setNewQuantity(Number(e.target.value))}
                          placeholder="New quantity"
                          className="flex-1"
                        />
                        <Button onClick={() => handleQuantityUpdate(item.id)}>
                          Update
                        </Button>
                        <Button variant="outline" onClick={() => setEditingItem(null)}>
                          Cancel
                        </Button>
                      </div>
                      <div className="flex gap-2">
                        <Input
                          type="number"
                          value={newThreshold}
                          onChange={(e) => setNewThreshold(Number(e.target.value))}
                          placeholder="Low stock threshold"
                          className="flex-1"
                        />
                        <Button variant="outline" onClick={() => handleThresholdUpdate(item.id)}>
                          Set Threshold
                        </Button>
                      </div>
                    </div>
                  ) : (
                    <div className="mt-4">
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => {
                          setEditingItem(item.id);
                          setNewQuantity(item.quantity);
                          setNewThreshold(item.low_stock_threshold);
                        }}
                      >
                        Edit Inventory
                      </Button>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default InventoryManager;
