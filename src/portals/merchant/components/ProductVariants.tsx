
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Plus, Trash2 } from 'lucide-react';

interface ProductVariant {
  id?: string;
  name: string;
  values: string[];
}

interface ProductVariantsProps {
  variants: ProductVariant[];
  onChange: (variants: ProductVariant[]) => void;
}

const ProductVariants: React.FC<ProductVariantsProps> = ({ variants, onChange }) => {
  const addVariant = () => {
    const newVariant: ProductVariant = {
      id: `variant-${Date.now()}`,
      name: '',
      values: ['']
    };
    onChange([...variants, newVariant]);
  };

  const removeVariant = (index: number) => {
    const updated = variants.filter((_, i) => i !== index);
    onChange(updated);
  };

  const updateVariantName = (index: number, name: string) => {
    const updated = [...variants];
    updated[index] = { ...updated[index], name };
    onChange(updated);
  };

  const updateVariantValues = (variantIndex: number, values: string[]) => {
    const updated = [...variants];
    updated[variantIndex] = { ...updated[variantIndex], values };
    onChange(updated);
  };

  const addVariantValue = (variantIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].values.push('');
    onChange(updated);
  };

  const removeVariantValue = (variantIndex: number, valueIndex: number) => {
    const updated = [...variants];
    updated[variantIndex].values = updated[variantIndex].values.filter((_, i) => i !== valueIndex);
    onChange(updated);
  };

  const updateVariantValue = (variantIndex: number, valueIndex: number, value: string) => {
    const updated = [...variants];
    updated[variantIndex].values[valueIndex] = value;
    onChange(updated);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          Product Variants
          <Button type="button" variant="outline" size="sm" onClick={addVariant}>
            <Plus className="w-4 h-4 mr-1" />
            Add Variant
          </Button>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {variants.length === 0 ? (
          <p className="text-gray-500 text-center py-4">No variants added yet</p>
        ) : (
          variants.map((variant, variantIndex) => (
            <div key={variant.id || variantIndex} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-center gap-2">
                <div className="flex-1">
                  <Label>Variant Name (e.g., Size, Color)</Label>
                  <Input
                    value={variant.name}
                    onChange={(e) => updateVariantName(variantIndex, e.target.value)}
                    placeholder="Enter variant name"
                  />
                </div>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeVariant(variantIndex)}
                  className="text-red-600 hover:text-red-800"
                >
                  <Trash2 className="w-4 h-4" />
                </Button>
              </div>
              
              <div>
                <Label>Values</Label>
                <div className="space-y-2">
                  {variant.values.map((value, valueIndex) => (
                    <div key={valueIndex} className="flex items-center gap-2">
                      <Input
                        value={value}
                        onChange={(e) => updateVariantValue(variantIndex, valueIndex, e.target.value)}
                        placeholder="Enter value"
                        className="flex-1"
                      />
                      {variant.values.length > 1 && (
                        <Button
                          type="button"
                          variant="ghost"
                          size="sm"
                          onClick={() => removeVariantValue(variantIndex, valueIndex)}
                          className="text-red-600 hover:text-red-800"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  ))}
                  <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    onClick={() => addVariantValue(variantIndex)}
                  >
                    <Plus className="w-4 h-4 mr-1" />
                    Add Value
                  </Button>
                </div>
              </div>
            </div>
          ))
        )}
      </CardContent>
    </Card>
  );
};

export default ProductVariants;
