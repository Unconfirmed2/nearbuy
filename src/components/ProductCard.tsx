import { Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useEffect, useState } from "react";
import StoreSelectionModal from "./StoreSelectionModal";
import { addToFavorites, removeFromFavorites, isFavorite } from "@/utils/localStorage";
import { Star } from "lucide-react";

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
  hideStoreSelection?: boolean;
  unit?: 'km' | 'mi';
}

const ProductCard = ({ product, onAddToBasket, isMerchantPreview = false, locationValue, hideStoreSelection = false, unit = 'km' }: ProductCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);

  useEffect(() => {
    setIsFavorited(isFavorite(product.sku));
  }, [product.sku]);

  const bestPriceStore = product.stores.reduce((best, current) => 
    current.price < best.price ? current : best
  );
  // Calculate average rating for the product
  const averageRating = product.stores.length > 0 ? (
    product.stores.reduce((sum, s) => sum + (s.rating || 0), 0) / product.stores.length
  ) : 0;

  const handleFavoriteClick = () => {
    if (isMerchantPreview) return; // Disable for merchants
    if (isFavorited) {
      removeFromFavorites(product.sku);
      setIsFavorited(false);
    } else {
      addToFavorites({
        sku: product.sku,
        productName: product.name,
        image: product.image
      });
      setIsFavorited(true);
    }
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
            <div className="flex items-center gap-2 text-xs text-gray-500">
              <span>From ${bestPriceStore.price} • {product.stores.length} store{product.stores.length !== 1 ? 's' : ''}</span>
              <span className="flex items-center gap-1 ml-auto">
                <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                {averageRating.toFixed(1)}
              </span>
            </div>
            
            <Button
              onClick={() => {
                if (hideStoreSelection && product.stores.length === 1) {
                  // Direct add to basket if only one store and hideStoreSelection is true
                  onAddToBasket(product.sku, product.stores[0].id);
                } else {
                  setIsModalOpen(true);
                }
              }}
              className="w-full bg-blue-600 hover:bg-blue-700 text-sm"
              size="sm"
            >
              {isMerchantPreview 
                ? 'View stores' 
                : hideStoreSelection && product.stores.length === 1
                  ? 'Add to cart'
                  : 'See stores'
              }
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
        unit={unit}
      />
    </>
  );
};

export default ProductCard;
