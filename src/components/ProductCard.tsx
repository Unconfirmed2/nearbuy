
import { MapPin, Star, Heart } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useState } from "react";

interface Product {
  id: number;
  name: string;
  price: number;
  image: string;
  distance: number;
  rating: number;
  seller: string;
  category: string;
}

interface ProductCardProps {
  product: Product;
}

const ProductCard = ({ product }: ProductCardProps) => {
  const [isFavorited, setIsFavorited] = useState(false);

  return (
    <Card className="group overflow-hidden hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg">
      <div className="relative">
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <Button
          variant="ghost"
          size="sm"
          className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm hover:bg-white"
          onClick={() => setIsFavorited(!isFavorited)}
        >
          <Heart className={`w-4 h-4 ${isFavorited ? 'fill-red-500 text-red-500' : 'text-gray-600'}`} />
        </Button>
        <Badge className="absolute top-3 left-3 bg-blue-600 hover:bg-blue-600">
          <MapPin className="w-3 h-3 mr-1" />
          {product.distance} mi
        </Badge>
      </div>
      
      <CardContent className="p-4">
        <div className="flex items-start justify-between mb-2">
          <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-blue-600 transition-colors">
            {product.name}
          </h3>
        </div>
        
        <div className="flex items-center space-x-1 mb-2">
          <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
          <span className="text-sm font-medium text-gray-700">{product.rating}</span>
          <span className="text-sm text-gray-500">• {product.seller}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <p className="text-2xl font-bold text-gray-900">${product.price}</p>
            <Badge variant="secondary" className="text-xs mt-1">
              {product.category}
            </Badge>
          </div>
          <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
            View
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
