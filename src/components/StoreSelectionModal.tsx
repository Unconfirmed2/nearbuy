
import { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ShoppingCart, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";

interface Store {
  id: number;
  seller: string;
  price: number;
  distance: number;
  rating: number;
  nbScore: number;
  address?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
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
  const [selectedStoreForMap, setSelectedStoreForMap] = useState<Store | null>(null);

  const handleAddToBasket = (storeId: number) => {
    onAddToBasket(product.id, storeId);
    onClose();
  };

  const handleShowOnMap = (store: Store) => {
    setSelectedStoreForMap(store);
    // Here you could integrate with a map service
    // For now, we'll show an alert with the address
    alert(`${store.seller}\n${store.address || 'Address not available'}\n\nMap integration coming soon!`);
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
            <div key={store.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{store.seller}</div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span>{store.distance.toFixed(1)}mi/{Math.round(store.distance * 16)}min</span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{store.rating.toFixed(1)}</span>
                    </div>
                  </div>
                  {store.address && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {store.address}
                    </div>
                  )}
                </div>
                <div className="text-right ml-3">
                  <div className="text-lg font-bold">${store.price}</div>
                  <Badge variant="secondary" className="text-xs">
                    NB: {store.nbScore}/5
                  </Badge>
                </div>
              </div>
              
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleAddToBasket(store.id)}
                  className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Basket
                </Button>
                <Button 
                  onClick={() => handleShowOnMap(store)}
                  variant="outline"
                  className="text-sm"
                  size="sm"
                >
                  <Map className="w-4 h-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default StoreSelectionModal;
