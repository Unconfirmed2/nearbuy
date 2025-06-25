
import React from 'react';
import { Heart, ShoppingCart, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getFavorites, removeFromFavorites, addToBasket } from '@/utils/localStorage';
import { toast } from 'sonner';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = React.useState(getFavorites());

  const handleRemoveFromFavorites = (productId: number) => {
    removeFromFavorites(productId);
    setFavorites(getFavorites());
    toast.success('Removed from favorites');
  };

  const handleAddToCart = (favorite: any) => {
    // Convert favorite to basket item format
    const basketItem = {
      productId: favorite.productId,
      storeId: 1, // Default store ID for demo
      productName: favorite.productName,
      storeName: 'Local Store', // Default store name for demo
      price: 19.99, // Default price for demo
      quantity: 1
    };
    
    addToBasket(basketItem);
    toast.success('Added to cart');
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-white p-8 rounded-lg shadow-sm text-center">
        <Heart className="h-16 w-16 text-gray-300 mx-auto mb-4" />
        <h1 className="text-2xl font-bold mb-2">No Favorites Yet</h1>
        <p className="text-gray-600 mb-6">
          Start exploring products and add them to your favorites to see them here.
        </p>
        <Button className="bg-blue-600 hover:bg-blue-700">
          Browse Products
        </Button>
      </div>
    );
  }

  return (
    <div className="bg-white p-6 rounded-lg shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">My Favorites</h1>
        <p className="text-gray-600">{favorites.length} items</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.productId} className="overflow-hidden hover:shadow-lg transition-shadow">
            <div className="aspect-square bg-gray-200 relative">
              <img
                src={favorite.image}
                alt={favorite.productName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <CardContent className="p-4">
              <h3 className="font-semibold text-lg mb-2">{favorite.productName}</h3>
              <p className="text-sm text-gray-500 mb-3">
                Added on {new Date(favorite.addedAt).toLocaleDateString()}
              </p>
              
              <div className="flex gap-2">
                <Button
                  size="sm"
                  onClick={() => handleAddToCart(favorite)}
                  className="flex-1"
                >
                  <ShoppingCart className="h-4 w-4 mr-2" />
                  Add to Cart
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleRemoveFromFavorites(favorite.productId)}
                  className="px-3"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default Favorites;
