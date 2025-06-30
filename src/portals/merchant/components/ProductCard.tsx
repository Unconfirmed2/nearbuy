
import React from 'react';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { MoreVertical, Edit, Copy, Trash2, Eye, EyeOff } from 'lucide-react';
import { Product } from '../types/product';

interface ProductCardProps {
  product: Product;
  onEdit: (product: Product) => void;
  onDuplicate: (product: Product) => void;
  onDelete: (productId: string) => void;
  onToggleStatus: (productId: string, isActive: boolean) => void;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onEdit,
  onDuplicate,
  onDelete,
  onToggleStatus
}) => {
  const primaryImage = product.images?.[0] || '/placeholder.svg';
  const lowStock = product.inventory?.[0]?.quantity <= (product.inventory?.[0]?.low_stock_threshold || 0);

  return (
    <Card className="group hover:shadow-md transition-shadow">
      <CardHeader className="p-4 pb-2">
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm line-clamp-2 mb-1">{product.name}</h3>
            <p className="text-xs text-gray-500 mb-2">{product.brand}</p>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge variant={product.is_active ? "default" : "secondary"} className="text-xs">
                {product.is_active ? 'Active' : 'Inactive'}
              </Badge>
              {product.track_inventory && lowStock && (
                <Badge variant="destructive" className="text-xs">
                  Low Stock
                </Badge>
              )}
              {product.variants && product.variants.length > 0 && (
                <Badge variant="outline" className="text-xs">
                  {product.variants.length} variants
                </Badge>
              )}
            </div>
          </div>
          
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                <MoreVertical className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuItem onClick={() => onEdit(product)}>
                <Edit className="h-4 w-4 mr-2" />
                Edit
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onDuplicate(product)}>
                <Copy className="h-4 w-4 mr-2" />
                Duplicate
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => onToggleStatus(product.id, !product.is_active)}>
                {product.is_active ? (
                  <>
                    <EyeOff className="h-4 w-4 mr-2" />
                    Deactivate
                  </>
                ) : (
                  <>
                    <Eye className="h-4 w-4 mr-2" />
                    Activate
                  </>
                )}
              </DropdownMenuItem>
              <DropdownMenuItem 
                onClick={() => onDelete(product.id)}
                className="text-red-600 focus:text-red-600"
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </CardHeader>
      
      <CardContent className="p-4 pt-0">
        <div className="aspect-square bg-gray-100 rounded-lg mb-3 overflow-hidden">
          <img 
            src={primaryImage}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          />
        </div>
        
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="font-semibold text-lg">${product.price.toFixed(2)}</span>
            {product.compare_at_price && product.compare_at_price > product.price && (
              <span className="text-sm line-through text-gray-500">
                ${product.compare_at_price.toFixed(2)}
              </span>
            )}
          </div>
          
          <div className="text-xs text-gray-500">
            SKU: {product.sku}
          </div>
          
          {product.track_inventory && product.inventory?.[0] && (
            <div className="text-xs">
              <span className={lowStock ? 'text-red-600' : 'text-gray-600'}>
                Stock: {product.inventory[0].quantity}
              </span>
            </div>
          )}
          
          {product.tags && product.tags.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {product.tags.slice(0, 3).map(tag => (
                <Badge key={tag} variant="outline" className="text-xs">
                  {tag}
                </Badge>
              ))}
              {product.tags.length > 3 && (
                <Badge variant="outline" className="text-xs">
                  +{product.tags.length - 3}
                </Badge>
              )}
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
