
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Clock, Star, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToBasket, addToFavorites } from '@/utils/localStorage';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const [featuredProducts] = useState([
    {
      id: 1,
      name: 'Organic Bananas',
      price: 2.49,
      image: '/placeholder.svg',
      store: 'Fresh Market',
      distance: '0.8 mi',
      rating: 4.5,
      category: 'Produce'
    },
    {
      id: 2,
      name: 'Artisan Bread',
      price: 4.99,
      image: '/placeholder.svg',
      store: 'Downtown Bakery',
      distance: '1.2 mi',
      rating: 4.8,
      category: 'Bakery'
    },
    {
      id: 3,
      name: 'Local Honey',
      price: 12.99,
      image: '/placeholder.svg',
      store: 'Farmers Market',
      distance: '2.1 mi',
      rating: 4.9,
      category: 'Pantry'
    }
  ]);
  
  const navigate = useNavigate();

  const handleAddToCart = (product: any) => {
    addToBasket({
      productId: product.id,
      storeId: 1,
      productName: product.name,
      storeName: product.store,
      price: product.price,
      quantity: 1
    });
    toast.success('Added to cart!');
  };

  const handleAddToFavorites = (product: any) => {
    addToFavorites({
      productId: product.id,
      productName: product.name,
      image: product.image
    });
    toast.success('Added to favorites!');
  };

  return (
    <div className="space-y-8 container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find products you want NearBuy</h1>
          <p className="text-xl opacity-90">Discover local products and plan your pickup route</p>
        </div>
      </div>

      {/* Featured Products */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products Near You</h2>
          <Button variant="outline" onClick={() => navigate('/consumer/search')}>
            View All
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white p-2 h-8 w-8"
                  onClick={() => handleAddToFavorites(product)}
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-blue-600">
                  {product.category}
                </Badge>
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-2 cursor-pointer" 
                        onClick={() => navigate(`/consumer/product/${product.id}`)}>
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.store}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.distance}
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {product.rating}
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-green-600">
                      ${product.price}
                    </span>
                    <Button
                      onClick={() => handleAddToCart(product)}
                      size="sm"
                      className="shrink-0"
                    >
                      <ShoppingCart className="w-4 h-4 mr-1" />
                      Add
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Home;
