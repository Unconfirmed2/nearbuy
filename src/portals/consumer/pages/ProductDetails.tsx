
import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Heart, ShoppingCart, Star, MapPin, Plus, Minus } from 'lucide-react';
import { addToBasket, addToFavorites } from '@/utils/localStorage';
import { toast } from 'sonner';

const ProductDetails: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [quantity, setQuantity] = useState(1);
  const [isFavorite, setIsFavorite] = useState(false);

  // Mock product data - in a real app, this would be fetched based on the ID
  const product = {
    id: parseInt(id || '1'),
    name: 'Organic Bananas',
    price: 2.49,
    image: '/placeholder.svg',
    store: 'Fresh Market',
    storeAddress: '123 Main St, Downtown',
    distance: '0.8 mi',
    rating: 4.5,
    reviewCount: 128,
    category: 'Produce',
    description: 'Fresh, organic bananas sourced from local farms. Perfect for smoothies, snacks, or baking.',
    inStock: true,
    stockCount: 24
  };

  const handleAddToCart = () => {
    addToBasket({
      productId: product.id,
      storeId: 1,
      productName: product.name,
      storeName: product.store,
      price: product.price,
      quantity: quantity
    });
    toast.success(`Added ${quantity} ${quantity === 1 ? 'item' : 'items'} to cart!`);
  };

  const handleAddToFavorites = () => {
    addToFavorites({
      productId: product.id,
      productName: product.name,
      image: product.image
    });
    setIsFavorite(true);
    toast.success('Added to favorites!');
  };

  const handleQuantityChange = (change: number) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= product.stockCount) {
      setQuantity(newQuantity);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      {/* Back Navigation */}
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
        className="mb-4"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Button>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {/* Product Image */}
        <div className="space-y-4">
          <div className="relative">
            <img
              src={product.image}
              alt={product.name}
              className="w-full h-96 object-cover rounded-lg"
            />
            <Badge className="absolute top-4 left-4 bg-blue-600">
              {product.category}
            </Badge>
            {product.inStock && (
              <Badge className="absolute top-4 right-4 bg-green-600">
                In Stock
              </Badge>
            )}
          </div>
        </div>

        {/* Product Details */}
        <div className="space-y-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">{product.name}</h1>
            <div className="flex items-center space-x-4 mt-2">
              <div className="flex items-center text-yellow-600">
                <Star className="w-4 h-4 mr-1 fill-current" />
                <span className="font-medium">{product.rating}</span>
                <span className="text-gray-500 ml-1">({product.reviewCount} reviews)</span>
              </div>
            </div>
          </div>

          <div className="text-3xl font-bold text-green-600">
            ${product.price.toFixed(2)}
          </div>

          <div className="border-t border-b py-4">
            <h3 className="font-medium mb-2">Store Information</h3>
            <div className="space-y-1">
              <p className="font-medium">{product.store}</p>
              <div className="flex items-center text-gray-600">
                <MapPin className="w-4 h-4 mr-1" />
                <span className="text-sm">{product.storeAddress} • {product.distance}</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-medium mb-2">Description</h3>
            <p className="text-gray-600">{product.description}</p>
          </div>

          {/* Quantity Selector */}
          <div>
            <label className="block text-sm font-medium mb-2">Quantity</label>
            <div className="flex items-center space-x-3">
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(-1)}
                disabled={quantity <= 1}
              >
                <Minus className="h-4 w-4" />
              </Button>
              <span className="text-xl font-medium w-12 text-center">{quantity}</span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleQuantityChange(1)}
                disabled={quantity >= product.stockCount}
              >
                <Plus className="h-4 w-4" />
              </Button>
              <span className="text-sm text-gray-500">({product.stockCount} available)</span>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="space-y-3">
            <Button 
              onClick={handleAddToCart}
              className="w-full"
              disabled={!product.inStock}
            >
              <ShoppingCart className="w-4 h-4 mr-2" />
              Add to Cart • ${(product.price * quantity).toFixed(2)}
            </Button>
            
            <Button 
              onClick={handleAddToFavorites}
              variant="outline"
              className="w-full"
              disabled={isFavorite}
            >
              <Heart className={`w-4 h-4 mr-2 ${isFavorite ? 'fill-current text-red-500' : ''}`} />
              {isFavorite ? 'Added to Favorites' : 'Add to Favorites'}
            </Button>
          </div>
        </div>
      </div>

      {/* Additional Information */}
      <Card>
        <CardHeader>
          <CardTitle>Product Information</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <h4 className="font-medium mb-2">Availability</h4>
              <p className="text-sm text-gray-600">
                {product.inStock ? `${product.stockCount} items in stock` : 'Out of stock'}
              </p>
            </div>
            <div>
              <h4 className="font-medium mb-2">Category</h4>
              <p className="text-sm text-gray-600">{product.category}</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProductDetails;
