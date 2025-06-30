
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Badge } from '@/components/ui/badge';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Plus, Edit, Trash2, Calendar, Percent, Tag } from 'lucide-react';
import { toast } from 'sonner';

interface Promotion {
  id: string;
  name: string;
  description: string;
  type: 'percentage' | 'fixed_amount' | 'bogo';
  value: number;
  code?: string;
  start_date: string;
  end_date: string;
  usage_limit?: number;
  usage_count: number;
  is_active: boolean;
  applicable_products: string[];
}

interface PromotionsManagerProps {
  storeId: string;
  products: Array<{ id: string; name: string; }>;
}

const PromotionsManager: React.FC<PromotionsManagerProps> = ({
  storeId,
  products
}) => {
  const [promotions, setPromotions] = useState<Promotion[]>([
    {
      id: 'promo-1',
      name: 'Summer Sale',
      description: '20% off all electronics',
      type: 'percentage',
      value: 20,
      code: 'SUMMER20',
      start_date: '2024-06-01',
      end_date: '2024-08-31',
      usage_limit: 1000,
      usage_count: 245,
      is_active: true,
      applicable_products: []
    }
  ]);

  const [showCreateForm, setShowCreateForm] = useState(false);
  const [editingPromotion, setEditingPromotion] = useState<Partial<Promotion>>({});

  const handleCreatePromotion = () => {
    const newPromotion: Promotion = {
      id: `promo-${Date.now()}`,
      name: editingPromotion.name || '',
      description: editingPromotion.description || '',
      type: editingPromotion.type || 'percentage',
      value: editingPromotion.value || 0,
      code: editingPromotion.code,
      start_date: editingPromotion.start_date || '',
      end_date: editingPromotion.end_date || '',
      usage_limit: editingPromotion.usage_limit,
      usage_count: 0,
      is_active: true,
      applicable_products: editingPromotion.applicable_products || []
    };

    setPromotions(prev => [...prev, newPromotion]);
    setEditingPromotion({});
    setShowCreateForm(false);
    toast.success('Promotion created successfully');
  };

  const togglePromotionStatus = (id: string) => {
    setPromotions(prev => prev.map(p => 
      p.id === id ? { ...p, is_active: !p.is_active } : p
    ));
    toast.success('Promotion status updated');
  };

  const deletePromotion = (id: string) => {
    if (window.confirm('Are you sure you want to delete this promotion?')) {
      setPromotions(prev => prev.filter(p => p.id !== id));
      toast.success('Promotion deleted');
    }
  };

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'percentage':
        return <Percent className="w-4 h-4" />;
      case 'fixed_amount':
        return <span className="w-4 h-4 text-sm font-bold">$</span>;
      default:
        return <Tag className="w-4 h-4" />;
    }
  };

  const formatValue = (type: string, value: number) => {
    switch (type) {
      case 'percentage':
        return `${value}%`;
      case 'fixed_amount':
        return `$${value}`;
      default:
        return value.toString();
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold">Promotions & Discounts</h3>
        <Button onClick={() => setShowCreateForm(true)}>
          <Plus className="w-4 h-4 mr-2" />
          Create Promotion
        </Button>
      </div>

      {showCreateForm && (
        <Card>
          <CardHeader>
            <CardTitle>Create New Promotion</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promo-name">Promotion Name</Label>
                <Input
                  id="promo-name"
                  value={editingPromotion.name || ''}
                  onChange={(e) => setEditingPromotion(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., Summer Sale"
                />
              </div>
              <div>
                <Label htmlFor="promo-code">Coupon Code (Optional)</Label>
                <Input
                  id="promo-code"
                  value={editingPromotion.code || ''}
                  onChange={(e) => setEditingPromotion(prev => ({ ...prev, code: e.target.value }))}
                  placeholder="e.g., SUMMER20"
                />
              </div>
            </div>

            <div>
              <Label htmlFor="promo-description">Description</Label>
              <Textarea
                id="promo-description"
                value={editingPromotion.description || ''}
                onChange={(e) => setEditingPromotion(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the promotion..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="promo-type">Discount Type</Label>
                <Select 
                  value={editingPromotion.type || 'percentage'}
                  onValueChange={(value) => setEditingPromotion(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="percentage">Percentage Off</SelectItem>
                    <SelectItem value="fixed_amount">Fixed Amount Off</SelectItem>
                    <SelectItem value="bogo">Buy One Get One</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="promo-value">Discount Value</Label>
                <Input
                  id="promo-value"
                  type="number"
                  value={editingPromotion.value || ''}
                  onChange={(e) => setEditingPromotion(prev => ({ ...prev, value: Number(e.target.value) }))}
                  placeholder="e.g., 20"
                />
              </div>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="start-date">Start Date</Label>
                <Input
                  id="start-date"
                  type="date"
                  value={editingPromotion.start_date || ''}
                  onChange={(e) => setEditingPromotion(prev => ({ ...prev, start_date: e.target.value }))}
                />
              </div>
              <div>
                <Label htmlFor="end-date">End Date</Label>
                <Input
                  id="end-date"
                  type="date"
                  value={editingPromotion.end_date || ''}
                  onChange={(e) => setEditingPromotion(prev => ({ ...prev, end_date: e.target.value }))}
                />
              </div>
            </div>

            <div>
              <Label htmlFor="usage-limit">Usage Limit (Optional)</Label>
              <Input
                id="usage-limit"
                type="number"
                value={editingPromotion.usage_limit || ''}
                onChange={(e) => setEditingPromotion(prev => ({ ...prev, usage_limit: Number(e.target.value) }))}
                placeholder="e.g., 1000"
              />
            </div>

            <div className="flex gap-2">
              <Button onClick={handleCreatePromotion}>Create Promotion</Button>
              <Button variant="outline" onClick={() => setShowCreateForm(false)}>Cancel</Button>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid gap-4">
        {promotions.map(promotion => (
          <Card key={promotion.id}>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex items-center gap-2">
                    {getTypeIcon(promotion.type)}
                    <div>
                      <h4 className="font-medium">{promotion.name}</h4>
                      <p className="text-sm text-gray-600">{promotion.description}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant={promotion.is_active ? "default" : "secondary"}>
                      {promotion.is_active ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge variant="outline">
                      {formatValue(promotion.type, promotion.value)} off
                    </Badge>
                    {promotion.code && (
                      <Badge variant="outline" className="font-mono">
                        {promotion.code}
                      </Badge>
                    )}
                  </div>
                </div>
                
                <div className="flex items-center gap-2">
                  <div className="text-right text-sm text-gray-600">
                    <div className="flex items-center gap-1">
                      <Calendar className="w-3 h-3" />
                      {new Date(promotion.start_date).toLocaleDateString()} - {new Date(promotion.end_date).toLocaleDateString()}
                    </div>
                    {promotion.usage_limit && (
                      <div className="mt-1">
                        {promotion.usage_count} / {promotion.usage_limit} used
                      </div>
                    )}
                  </div>
                  
                  <div className="flex gap-1">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => togglePromotionStatus(promotion.id)}
                    >
                      {promotion.is_active ? 'Deactivate' : 'Activate'}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => deletePromotion(promotion.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {promotions.length === 0 && !showCreateForm && (
        <div className="text-center py-8">
          <Tag className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No promotions yet</h3>
          <p className="text-gray-600 mb-4">
            Create your first promotion to boost sales and attract customers.
          </p>
          <Button onClick={() => setShowCreateForm(true)}>
            <Plus className="w-4 h-4 mr-2" />
            Create Your First Promotion
          </Button>
        </div>
      )}
    </div>
  );
};

export default PromotionsManager;
