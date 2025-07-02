import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Plus, Copy, Edit, Trash2, Calendar, Percent } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Coupon {
  id: string;
  code: string;
  discount_type: 'percentage' | 'fixed';
  discount_value: number;
  min_order_amount?: number;
  max_uses?: number;
  used_count: number;
  expires_at?: string;
  is_active: boolean;
  created_at: string;
}

interface CouponManagerProps {
  merchantId: string;
  storeId: string;
}

const CouponManager: React.FC<CouponManagerProps> = ({ merchantId, storeId }) => {
  const [coupons, setCoupons] = useState<Coupon[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch coupons from database
  useEffect(() => {
    const fetchCoupons = async () => {
      if (!storeId) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('coupons')
          .select('*')
          .eq('store_id', storeId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setCoupons((data || []).map(item => ({
          ...item,
          discount_type: item.discount_type as 'percentage' | 'fixed'
        })));
      } catch (error) {
        console.error('Error fetching coupons:', error);
        toast.error('Failed to load coupons');
      } finally {
        setLoading(false);
      }
    };

    fetchCoupons();
  }, [storeId]);

  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newCoupon, setNewCoupon] = useState({
    code: '',
    discount_type: 'percentage' as 'percentage' | 'fixed',
    discount_value: 0,
    min_order_amount: '',
    max_uses: '',
    expires_at: ''
  });

  const generateRandomCode = () => {
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
    let result = '';
    for (let i = 0; i < 8; i++) {
      result += chars.charAt(Math.floor(Math.random() * chars.length));
    }
    setNewCoupon(prev => ({ ...prev, code: result }));
  };

  const handleCreateCoupon = async () => {
    if (!storeId) return;

    try {
      const couponData = {
        store_id: storeId,
        code: newCoupon.code,
        discount_type: newCoupon.discount_type,
        discount_value: newCoupon.discount_value,
        min_order_amount: newCoupon.min_order_amount ? parseFloat(newCoupon.min_order_amount) : null,
        max_uses: newCoupon.max_uses ? parseInt(newCoupon.max_uses) : null,
        expires_at: newCoupon.expires_at || null,
        is_active: true
      };

      const { data, error } = await supabase
        .from('coupons')
        .insert(couponData)
        .select()
        .single();

      if (error) throw error;

      setCoupons(prev => [{
        ...data,
        discount_type: data.discount_type as 'percentage' | 'fixed'
      }, ...prev]);
      setShowCreateDialog(false);
      setNewCoupon({
        code: '',
        discount_type: 'percentage',
        discount_value: 0,
        min_order_amount: '',
        max_uses: '',
        expires_at: ''
      });
      toast.success('Coupon created successfully');
    } catch (error) {
      console.error('Error creating coupon:', error);
      toast.error('Failed to create coupon');
    }
  };

  const copyCouponCode = (code: string) => {
    navigator.clipboard.writeText(code);
    toast.success('Coupon code copied to clipboard');
  };

  const toggleCouponStatus = async (id: string) => {
    try {
      const coupon = coupons.find(c => c.id === id);
      if (!coupon) return;

      const { error } = await supabase
        .from('coupons')
        .update({ is_active: !coupon.is_active })
        .eq('id', id);

      if (error) throw error;

      setCoupons(prev => prev.map(coupon =>
        coupon.id === id ? { ...coupon, is_active: !coupon.is_active } : coupon
      ));
      toast.success('Coupon status updated');
    } catch (error) {
      console.error('Error updating coupon:', error);
      toast.error('Failed to update coupon status');
    }
  };

  const deleteCoupon = async (id: string) => {
    try {
      const { error } = await supabase
        .from('coupons')
        .delete()
        .eq('id', id);

      if (error) throw error;

      setCoupons(prev => prev.filter(coupon => coupon.id !== id));
      toast.success('Coupon deleted');
    } catch (error) {
      console.error('Error deleting coupon:', error);
      toast.error('Failed to delete coupon');
    }
  };

  const getDiscountDisplay = (coupon: Coupon) => {
    return coupon.discount_type === 'percentage' 
      ? `${coupon.discount_value}% off`
      : `$${coupon.discount_value} off`;
  };

  const isExpired = (expiresAt?: string) => {
    if (!expiresAt) return false;
    return new Date(expiresAt) < new Date();
  };

  const isMaxedOut = (coupon: Coupon) => {
    return coupon.max_uses ? coupon.used_count >= coupon.max_uses : false;
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Percent className="w-5 h-5" />
            Coupon Codes
          </CardTitle>
          <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
            <DialogTrigger asChild>
              <Button>
                <Plus className="w-4 h-4 mr-2" />
                Create Coupon
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Coupon</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label>Coupon Code</Label>
                  <div className="flex gap-2">
                    <Input
                      value={newCoupon.code}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, code: e.target.value.toUpperCase() }))}
                      placeholder="Enter coupon code"
                    />
                    <Button type="button" variant="outline" onClick={generateRandomCode}>
                      Generate
                    </Button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Discount Type</Label>
                    <Select 
                      value={newCoupon.discount_type} 
                      onValueChange={(value: 'percentage' | 'fixed') => 
                        setNewCoupon(prev => ({ ...prev, discount_type: value }))
                      }
                    >
                      <SelectTrigger>
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="percentage">Percentage</SelectItem>
                        <SelectItem value="fixed">Fixed Amount</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label>
                      Discount Value {newCoupon.discount_type === 'percentage' ? '(%)' : '($)'}
                    </Label>
                    <Input
                      type="number"
                      value={newCoupon.discount_value}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, discount_value: parseFloat(e.target.value) || 0 }))}
                    />
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label>Min Order Amount ($)</Label>
                    <Input
                      type="number"
                      value={newCoupon.min_order_amount}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, min_order_amount: e.target.value }))}
                      placeholder="Optional"
                    />
                  </div>
                  <div>
                    <Label>Max Uses</Label>
                    <Input
                      type="number"
                      value={newCoupon.max_uses}
                      onChange={(e) => setNewCoupon(prev => ({ ...prev, max_uses: e.target.value }))}
                      placeholder="Unlimited"
                    />
                  </div>
                </div>

                <div>
                  <Label>Expires At</Label>
                  <Input
                    type="date"
                    value={newCoupon.expires_at}
                    onChange={(e) => setNewCoupon(prev => ({ ...prev, expires_at: e.target.value }))}
                  />
                </div>

                <div className="flex justify-end gap-2">
                  <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
                    Cancel
                  </Button>
                  <Button onClick={handleCreateCoupon} disabled={!newCoupon.code || !newCoupon.discount_value}>
                    Create Coupon
                  </Button>
                </div>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </CardHeader>
      <CardContent>
        {loading ? (
          <div className="flex items-center justify-center py-8">
            <div className="text-gray-500">Loading coupons...</div>
          </div>
        ) : (
          <div className="space-y-4">
            {coupons.map(coupon => (
            <div key={coupon.id} className="border rounded-lg p-4">
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-2">
                  <code className="bg-gray-100 px-2 py-1 rounded font-mono text-sm">
                    {coupon.code}
                  </code>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyCouponCode(coupon.code)}
                  >
                    <Copy className="w-3 h-3" />
                  </Button>
                  <Badge className="bg-green-100 text-green-800">
                    {getDiscountDisplay(coupon)}
                  </Badge>
                </div>
                <div className="flex items-center gap-2">
                  <Badge 
                    variant={coupon.is_active && !isExpired(coupon.expires_at) && !isMaxedOut(coupon) ? 'default' : 'secondary'}
                  >
                    {!coupon.is_active ? 'Inactive' : 
                     isExpired(coupon.expires_at) ? 'Expired' :
                     isMaxedOut(coupon) ? 'Max Uses Reached' : 'Active'}
                  </Badge>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => toggleCouponStatus(coupon.id)}
                  >
                    <Edit className="w-3 h-3" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => deleteCoupon(coupon.id)}
                    className="text-red-600 hover:text-red-800"
                  >
                    <Trash2 className="w-3 h-3" />
                  </Button>
                </div>
              </div>
              
              <div className="text-sm text-gray-600 space-y-1">
                <div className="flex items-center justify-between">
                  <span>Usage: {coupon.used_count}{coupon.max_uses ? ` / ${coupon.max_uses}` : ''}</span>
                  {coupon.min_order_amount && (
                    <span>Min order: ${coupon.min_order_amount}</span>
                  )}
                </div>
                {coupon.expires_at && (
                  <div className="flex items-center gap-1">
                    <Calendar className="w-3 h-3" />
                    <span>Expires: {new Date(coupon.expires_at).toLocaleDateString()}</span>
                  </div>
                )}
              </div>
            </div>
          ))}
          
          {coupons.length === 0 && (
            <div className="text-center py-8 text-gray-500">
              <Percent className="w-12 h-12 mx-auto mb-4 text-gray-400" />
              <p>No coupons created yet</p>
              <p className="text-sm">Create your first coupon to start offering discounts</p>
            </div>
          )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default CouponManager;
