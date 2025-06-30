
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Checkbox } from '@/components/ui/checkbox';
import { Copy } from 'lucide-react';

interface DuplicateProductDialogProps {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: any) => void;
  product: any;
  loading?: boolean;
}

const DuplicateProductDialog: React.FC<DuplicateProductDialogProps> = ({
  open,
  onClose,
  onSubmit,
  product,
  loading = false
}) => {
  const [formData, setFormData] = useState({
    name: `${product?.name || ''} (Copy)`,
    sku: `${product?.sku || ''}-COPY`,
    duplicateInventory: false,
    duplicateImages: true,
    duplicateVariants: true
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    const duplicatedProduct = {
      ...product,
      name: formData.name,
      sku: formData.sku,
      id: undefined, // Remove ID to create new product
      inventory: formData.duplicateInventory ? product.inventory : undefined,
      images: formData.duplicateImages ? product.images : [],
      variants: formData.duplicateVariants ? product.variants : []
    };

    onSubmit(duplicatedProduct);
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Copy className="w-5 h-5" />
            Duplicate Product
          </DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <Label htmlFor="name">New Product Name *</Label>
            <Input
              id="name"
              value={formData.name}
              onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
              required
            />
          </div>

          <div>
            <Label htmlFor="sku">New SKU</Label>
            <Input
              id="sku"
              value={formData.sku}
              onChange={(e) => setFormData(prev => ({ ...prev, sku: e.target.value }))}
            />
          </div>

          <div className="space-y-3">
            <Label>What to duplicate:</Label>
            
            <div className="flex items-center space-x-2">
              <Checkbox
                id="duplicate-inventory"
                checked={formData.duplicateInventory}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, duplicateInventory: checked as boolean }))
                }
              />
              <Label htmlFor="duplicate-inventory" className="text-sm">
                Inventory settings (quantity will be set to 0)
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="duplicate-images"
                checked={formData.duplicateImages}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, duplicateImages: checked as boolean }))
                }
              />
              <Label htmlFor="duplicate-images" className="text-sm">
                Product images
              </Label>
            </div>

            <div className="flex items-center space-x-2">
              <Checkbox
                id="duplicate-variants"
                checked={formData.duplicateVariants}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, duplicateVariants: checked as boolean }))
                }
              />
              <Label htmlFor="duplicate-variants" className="text-sm">
                Product variants
              </Label>
            </div>
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? 'Duplicating...' : 'Duplicate Product'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
};

export default DuplicateProductDialog;
