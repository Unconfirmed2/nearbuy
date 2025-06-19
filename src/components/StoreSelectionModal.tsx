
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Store {
  id: number;
  seller: string;
  price: number;
  distance: number;
  rating: number;
  ezScore: number;
}

interface Product {
  id: number;
  name: string;
  image: string;
  category: string;
  stores: Store[];
}

interface StoreSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToBasket: (productId: number, storeId: number) => void;
}

const StoreSelectionModal = ({ isOpen, onClose, product, onAddToBasket }: StoreSelectionModalProps) => {
  const handleAddToBasket = (storeId: number) => {
    onAddToBasket(product.id, storeId);
    onClose();
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <div className="font-semibold">{product.name}</div>
              <div className="text-sm text-gray-500">{product.category}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {product.stores.map((store) => (
            <div key={store.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{store.seller}</div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{store.distance}mi/{Math.round(store.distance * 16)}min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{store.rating}</span>
                    </div>
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">${store.price}</div>
                  <Badge variant="secondary" className="text-xs">
                    EZ: {store.ezScore}/5
                  </Badge>
                </div>
              </div>
              
              <Button 
                onClick={() => handleAddToBasket(store.id)}
                className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
                size="sm"
              >
                <ShoppingCart className="w-4 h-4 mr-2" />
                Add to Basket
              </Button>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreSelectionModal;
