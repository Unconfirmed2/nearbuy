
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Heart, ShoppingCart } from 'lucide-react';
import { getFavorites, removeFromFavorites, FavoriteItem } from '@/utils/localStorage';
import { addToBasket } from '@/utils/localStorage';
import { toast } from 'sonner';

const Favorites: React.FC = () => {
  const [favorites, setFavorites] = useState<FavoriteItem[]>(getFavorites());

  const handleRemoveFavorite = (sku: string) => {
    removeFromFavorites(sku);
    setFavorites(getFavorites());
    toast.success('Removed from favorites');
  };

  const handleAddToCart = (favorite: FavoriteItem) => {
    // For demo purposes, using mock store data
    addToBasket({
      sku: favorite.sku,
      storeId: '1',
      productName: favorite.productName,
      storeName: 'Demo Store',
      price: 29.99,
      quantity: 1
    });
    toast.success('Added to cart');
  };

  if (favorites.length === 0) {
    return (
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <div className="text-center py-12">
          <Heart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
          <h1 className="text-2xl font-bold mb-4">No favorites yet</h1>
          <p className="text-gray-600 mb-6">
            Items you favorite will appear here for quick access.
          </p>
          <Button onClick={() => window.history.back()}>
            Start Shopping
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">Your Favorites</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        {favorites.map((favorite) => (
          <Card key={favorite.sku} className="group overflow-hidden hover:shadow-lg transition-shadow">
            <div className="relative">
              <img
                src={favorite.image}
                alt={favorite.productName}
                className="w-full h-48 object-cover"
              />
              <Button
                variant="ghost"
                size="sm"
                className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white p-2 h-8 w-8"
                onClick={() => handleRemoveFavorite(favorite.sku)}
              >
                <Heart className="w-4 h-4 fill-red-500 text-red-500" />
              </Button>
            </div>
            
            <CardContent className="p-4">
              <div className="space-y-3">
                <h3 className="font-medium text-gray-900 line-clamp-2">
                  {favorite.productName}
                </h3>
                
                <div className="text-xs text-gray-500">
                  Added {new Date(favorite.addedAt).toLocaleDateString()}
                </div>
                
                <Button
                  onClick={() => handleAddToCart(favorite)}
                  className="w-full"
                  size="sm"
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  Add to Cart
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
