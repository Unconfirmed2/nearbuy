
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Clock, Star, Heart, ShoppingCart } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';
import { addToBasket, addToFavorites } from '@/utils/localStorage';
import { toast } from 'sonner';

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [travelFilter, setTravelFilter] = useState<TravelFilterValue>({
    mode: 'driving',
    type: 'distance',
    value: 5
  });
  
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

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
        },
        (error) => {
          console.log('Location access denied:', error);
        }
      );
    }
  }, []);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    navigate(`/consumer/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  const handleGetLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation(`${position.coords.latitude}, ${position.coords.longitude}`);
          toast.success('Location updated!');
        },
        (error) => {
          toast.error('Unable to get your location');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser');
    }
  };

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
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <div className="max-w-4xl mx-auto">
          <div className="text-center space-y-6">
            <h1 className="text-4xl font-bold">Welcome to NearBuy</h1>
            <p className="text-xl opacity-90">Discover local products and plan your pickup route</p>
            
            {/* Search Section */}
            <div className="space-y-4 max-w-2xl mx-auto">
              <div className="flex gap-2">
                <Input
                  placeholder="What are you looking for?"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="text-gray-900"
                  onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                />
                <Button onClick={handleSearch} className="bg-white text-blue-600 hover:bg-gray-100">
                  <Search className="h-4 w-4 mr-2" />
                  Search
                </Button>
              </div>
              
              <div className="flex gap-2 items-center">
                <div className="flex-1 flex gap-2">
                  <Input
                    placeholder="Enter location or ZIP code"
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="text-gray-900"
                  />
                  <Button 
                    onClick={handleGetLocation}
                    variant="outline"
                    className="bg-white/10 border-white/20 text-white hover:bg-white/20"
                  >
                    <MapPin className="h-4 w-4 mr-2" />
                    Use My Location
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-center">
                <TravelFilter 
                  value={travelFilter}
                  onChange={setTravelFilter}
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/consumer/search')}>
          <CardContent className="p-6 text-center">
            <Search className="h-8 w-8 text-blue-600 mx-auto mb-2" />
            <h3 className="font-semibold">Browse Products</h3>
            <p className="text-sm text-gray-600">Search and filter local inventory</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/consumer/route-planner')}>
          <CardContent className="p-6 text-center">
            <MapPin className="h-8 w-8 text-green-600 mx-auto mb-2" />
            <h3 className="font-semibold">Route Planner</h3>
            <p className="text-sm text-gray-600">Plan your pickup route</p>
          </CardContent>
        </Card>
        
        <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => navigate('/consumer/support')}>
          <CardContent className="p-6 text-center">
            <Clock className="h-8 w-8 text-purple-600 mx-auto mb-2" />
            <h3 className="font-semibold">Support</h3>
            <p className="text-sm text-gray-600">Get help and support</p>
          </CardContent>
        </Card>
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
