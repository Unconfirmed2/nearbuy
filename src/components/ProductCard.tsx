
import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useState } from "react";
import StoreSelectionModal from "./StoreSelectionModal";

interface Store {
  id: string;
  seller: string;
  price: number;
  distance: number;
  travelTime: number;
  rating: number;
  nbScore: number;
  address?: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  category: string;
  stores: Store[];
}

interface ProductCardProps {
  product: Product;
  onAddToBasket: (sku: string, storeId: string) => void;
  isMerchantPreview?: boolean;
  locationValue?: string;
}

const ProductCard = ({ product, onAddToBasket, isMerchantPreview = false, locationValue }: ProductCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const bestPriceStore = product.stores.reduce((best, current) => 
    current.price < best.price ? current : best
  );

  const handleFavoriteClick = () => {
    if (isMerchantPreview) return; // Disable for merchants
    setIsFavorited(!isFavorited);
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
            className={`absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white p-1 h-8 w-8 ${
              isMerchantPreview ? 'opacity-50 cursor-not-allowed' : ''
            }`}
            onClick={handleFavoriteClick}
            disabled={isMerchantPreview}
          >
            <Heart className={`w-4 h-4 ${
              isFavorited && !isMerchantPreview 
                ? 'fill-red-500 text-red-500' 
                : 'text-gray-600'
            }`} />
          </Button>
        </div>
        
        <CardContent className="p-3">
          <div className="space-y-3">
            <h3 className="font-medium text-gray-900 text-sm line-clamp-2">
              {product.name}
            </h3>
            
            <p className="text-xs text-gray-600 line-clamp-2">
              {product.description}
            </p>
            
            <div className="text-xs text-gray-500">
              From ${bestPriceStore.price} • {product.stores.length} store{product.stores.length !== 1 ? 's' : ''}
            </div>
            
            <Button
              onClick={() => setIsModalOpen(true)}
              className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
              size="sm"
            >
              {isMerchantPreview ? 'View stores' : 'See stores'}
            </Button>
          </div>
        </CardContent>
      </Card>

      <StoreSelectionModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        product={product}
        onAddToBasket={onAddToBasket}
        isMerchantPreview={isMerchantPreview}
      />
    </>
  );
};

export default ProductCard;
