
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ShoppingCart } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Store {
  id: string;
  name: string;
  price: number;
  distance: number;
  rating: number;
  nbScore: number;
  address: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  brand: string;
  category: string;
  stores: Store[];
  minPrice: number;
}

interface StoreSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToBasket?: (productId: string, storeId: string) => void;
}

const StoreSelectionModal = ({ isOpen, onClose, product, onAddToBasket }: StoreSelectionModalProps) => {
  const handleAddToBasket = (storeId: string) => {
    if (onAddToBasket) {
      onAddToBasket(product.id, storeId);
    }
    onClose();
  };

  // Sort stores by price (lowest first)
  const sortedStores = [...product.stores].sort((a, b) => a.price - b.price);

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <img src={product.image || "/placeholder.svg"} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <div className="font-semibold">{product.name}</div>
              <div className="text-sm text-gray-500">{product.brand}</div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {sortedStores.map((store) => (
            <div key={store.id} className="border rounded-lg p-4 space-y-2">
              <div className="flex items-center justify-between">
                <div>
                  <div className="font-medium text-sm">{store.name}</div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{store.distance.toFixed(1)}mi</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{store.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  <div className="text-xs text-gray-500 mt-1">
                    {store.address}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-lg font-bold">${store.price.toFixed(2)}</div>
                  <Badge variant="secondary" className="text-xs">
                    NB: {store.nbScore}/5
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
