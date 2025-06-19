
import { MapPin, Star, Heart, Plus } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StoreSelectionModal from "./StoreSelectionModal";

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

interface ProductCardProps {
  product: Product;
  onAddToBasket: (productId: number, storeId: number) => void;
}

const ProductCard = ({ product, onAddToBasket }: ProductCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const visibleStores = product.stores.slice(0, 3);
  const hasMoreStores = product.stores.length > 3;
  const bestPriceStore = product.stores.reduce((best, current) => 
    current.price < best.price ? current : best
  );

  const handleQuickAdd = (storeId: number, e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToBasket(product.id, storeId);
  };

  return (
    <>
      <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
        <div className="relative">
          <img
            src={product.image}
            alt={product.name}
            className="w-full h-32 object-cover group-hover:scale-105 transition-transform duration-300"
          />
          <Button
            variant="ghost"
            size="sm"
            className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white p-1 h-8 w-8"
            onClick={() => setIsFavorited(!isFavorited)}
          >
            <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
          </Button>
        </div>
        
        <CardContent className="p-3">
          <div className="space-y-2">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
              {product.name}
            </h3>
            
            <div className="text-xs text-gray-500 mb-2">
              From ${bestPriceStore.price} • {product.stores.length} store{product.stores.length !== 1 ? 's' : ''}
            </div>
            
            {/* Store listings */}
            <div className="space-y-1">
              {visibleStores.map((store, index) => (
                <div key={store.id} className="flex items-center justify-between text-xs bg-gray-50 rounded p-2">
                  <div className="flex-1">
                    <div className="font-medium text-gray-800 truncate">{store.seller}</div>
                    <div className="flex items-center space-x-2 text-gray-600">
                      <div className="flex items-center space-x-1">
                        <MapPin className="w-3 h-3" />
                        <span>{store.distance}mi</span>
                      </div>
                      <div className="flex items-center space-x-1">
                        <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                        <span>{store.ezScore}/5</span>
                      </div>
                    </div>
                  </div>
                  <div className="text-right ml-2">
                    <div className="font-bold text-gray-900">${store.price}</div>
                    <Button
                      size="sm"
                      onClick={(e) => handleQuickAdd(store.id, e)}
                      className="bg-blue-600 hover:bg-blue-700 text-xs px-2 py-1 h-6 mt-1"
                    >
                      Add
                    </Button>
                  </div>
                </div>
              ))}
              
              {hasMoreStores && (
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setIsModalOpen(true)}
                  className="w-full text-xs py-1 h-7 border-dashed"
                >
                  <Plus className="w-3 h-3 mr-1" />
                  +{product.stores.length - 3} more stores
                </Button>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      <StoreSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onAddToBasket={onAddToBasket}
      />
    </>
  );
};

export default ProductCard;
