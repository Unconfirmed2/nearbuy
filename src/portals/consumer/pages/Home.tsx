
import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { MapPin, Search, Clock, Star, Heart, ShoppingCart, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';
import { addToBasket, addToFavorites } from '@/utils/localStorage';
import { toast } from 'sonner';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

const Home: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [location, setLocation] = useState('');
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
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

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    navigate(`/consumer/search?q=${encodeURIComponent(searchQuery)}&location=${encodeURIComponent(location)}`);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocation(selectedLocation);
    setIsLocationPopoverOpen(false);
    toast.success('Location updated!');
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          // For now, we'll use coordinates format until we have reverse geocoding
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocation(locationString);
          setIsLocationPopoverOpen(false);
          toast.success('Location updated to your current position!');
        },
        (error) => {
          console.error('Error getting location:', error);
          toast.error('Unable to get your location. Please enter manually.');
        }
      );
    } else {
      toast.error('Geolocation is not supported by this browser.');
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
                <Popover open={isLocationPopoverOpen} onOpenChange={setIsLocationPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="flex-1 flex gap-2 items-center">
                      <div className="relative flex-1">
                        <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                        <Input
                          placeholder="Enter address or ZIP code"
                          value={location}
                          onChange={(e) => setLocation(e.target.value)}
                          className="text-gray-900 pl-10 cursor-pointer"
                          readOnly
                          onClick={() => setIsLocationPopoverOpen(true)}
                        />
                      </div>
                      <TravelFilter 
                        value={travelFilter}
                        onChange={setTravelFilter}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Enter your location</h4>
                      
                      {/* Use My Location Button */}
                      <Button
                        onClick={handleUseMyLocation}
                        variant="outline"
                        className="w-full justify-start"
                      >
                        <Navigation className="h-4 w-4 mr-2" />
                        Use My Current Location
                      </Button>
                      
                      <div className="relative">
                        <div className="absolute inset-0 flex items-center">
                          <span className="w-full border-t" />
                        </div>
                        <div className="relative flex justify-center text-xs uppercase">
                          <span className="bg-white px-2 text-muted-foreground">
                            Or enter manually
                          </span>
                        </div>
                      </div>
                      
                      <Input
                        placeholder="Type your address..."
                        value={location}
                        onChange={(e) => setLocation(e.target.value)}
                        className="w-full"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && location.trim()) {
                            handleLocationSelect(location);
                          }
                        }}
                      />
                      <div className="space-y-2">
                        <p className="text-sm text-gray-600">Popular locations:</p>
                        <div className="space-y-1">
                          {[
                            'Downtown',
                            'Main Street',
                            'Shopping District',
                            'University Area'
                          ].map((popularLocation) => (
                            <Button
                              key={popularLocation}
                              variant="ghost"
                              size="sm"
                              className="w-full justify-start text-left"
                              onClick={() => handleLocationSelect(popularLocation)}
                            >
                              <MapPin className="h-4 w-4 mr-2" />
                              {popularLocation}
                            </Button>
                          ))}
                        </div>
                      </div>
                      {location.trim() && (
                        <Button
                          onClick={() => handleLocationSelect(location)}
                          className="w-full"
                        >
                          Use "{location}"
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>
          </div>
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
