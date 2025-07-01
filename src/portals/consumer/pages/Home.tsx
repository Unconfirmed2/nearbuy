import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Star, Heart, ShoppingCart, Search, Navigation } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { addToBasket, addToFavorites } from '@/utils/localStorage';
import { toast } from 'sonner';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import StoreSelectionModal from '@/components/StoreSelectionModal';

interface Store {
  id: number;
  seller: string;
  price: number;
  distance: number;
  rating: number;
  nbScore: number;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  stores: Store[];
}

// Helper function to convert UUID string to a stable positive number
const uuidToNumber = (uuid: string): number => {
  // Create a simple hash from the UUID string
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash; // Convert to 32-bit integer
  }
  // Ensure it's positive
  return Math.abs(hash);
};

const Home: React.FC = () => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('products');
  
  // Mobile location and filter states
  const [locationValue, setLocationValue] = useState('');
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
  const [travelFilter, setTravelFilter] = useState<TravelFilterValue>({
    mode: 'driving',
    type: 'distance',
    value: 5
  });

  // Fetch products from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const { data: products, error } = await supabase
          .from('products')
          .select(`
            id,
            name,
            description,
            image_url,
            brand,
            category:categories(name)
          `)
          .limit(20); // Increased from 6 to 20 to show more products

        if (error) {
          console.error('Error fetching products:', error);
          toast.error('Failed to load products');
          return;
        }

        console.log('Fetched products from Supabase:', products);

        // Transform data to match expected format and add mock store data
        const transformedProducts: Product[] = products?.map((product, index) => {
          // Generate 2-4 mock stores per product
          const storeCount = Math.floor(Math.random() * 3) + 2;
          const stores: Store[] = [];
          
          // Convert UUID to number for product ID
          const productId = uuidToNumber(product.id);
          
          for (let i = 0; i < storeCount; i++) {
            stores.push({
              id: productId * 10 + i + 1000, // Use product-based numbering to avoid conflicts
              seller: `Store ${String.fromCharCode(65 + i)}`,
              price: Math.floor(Math.random() * 50) + 10,
              distance: Math.random() * 5 + 0.5,
              rating: 3.5 + Math.random() * 1.5,
              nbScore: Math.floor(Math.random() * 2) + 4
            });
          }

          return {
            id: productId,
            name: product.name,
            description: product.description || 'No description available',
            image: product.image_url || '/placeholder.svg',
            category: product.category?.name || 'General',
            stores: stores.sort((a, b) => a.price - b.price) // Sort by price ascending
          };
        }) || [];

        console.log('Transformed products:', transformedProducts);
        setFeaturedProducts(transformedProducts);
      } catch (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  const handleAddToBasket = (productId: number, storeId: number) => {
    const product = featuredProducts.find(p => p.id === productId);
    const store = product?.stores.find(s => s.id === storeId);
    
    if (product && store) {
      addToBasket({
        productId: productId,
        storeId: storeId,
        productName: product.name,
        storeName: store.seller,
        price: store.price,
        quantity: 1
      });
      toast.success('Added to cart!');
    }
  };

  const handleAddToFavorites = (product: Product) => {
    addToFavorites({
      productId: product.id,
      productName: product.name,
      image: product.image
    });
    toast.success('Added to favorites!');
  };

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    navigate(`/search?q=${encodeURIComponent(searchQuery)}&type=${searchType}`);
  };

  const handleLocationSelect = (selectedLocation: string) => {
    setLocationValue(selectedLocation);
    setIsLocationPopoverOpen(false);
    toast.success('Location updated!');
  };

  const handleUseMyLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          const locationString = `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
          setLocationValue(locationString);
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

  if (loading) {
    return (
      <div className="space-y-8 container mx-auto px-4 py-8">
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
          <div className="max-w-4xl mx-auto text-center">
            <h1 className="text-4xl font-bold mb-4">Find products you want NearBuy</h1>
            <p className="text-xl opacity-90">Discover local products and plan your pickup route</p>
          </div>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3, 4, 5, 6].map(i => (
            <Card key={i} className="group overflow-hidden hover:shadow-lg transition-shadow animate-pulse">
              <div className="h-48 bg-gray-200"></div>
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div className="h-4 bg-gray-200 rounded"></div>
                  <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 container mx-auto px-4 py-8">
      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-8 rounded-lg">
        <div className="max-w-4xl mx-auto text-center">
          <h1 className="text-4xl font-bold mb-4">Find products you want NearBuy</h1>
          <p className="text-xl opacity-90">Discover local products and plan your pickup route</p>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto space-y-4">
        <div className="text-center">
          <ToggleGroup 
            type="single" 
            value={searchType} 
            onValueChange={(value) => value && setSearchType(value)}
            className="mb-4"
          >
            <ToggleGroupItem value="products" aria-label="Search products">
              Products
            </ToggleGroupItem>
            <ToggleGroupItem value="stores" aria-label="Search stores">
              Stores
            </ToggleGroupItem>
          </ToggleGroup>
        </div>
        
        <div className="relative flex items-center bg-white rounded-lg shadow-md border p-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <Input
            placeholder={
              searchType === 'products' 
                ? "Search for products..." 
                : "Search stores by name or description..."
            }
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="flex-1 border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0"
            onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
          />
          <Button onClick={handleSearch} className="ml-2">
            Search
          </Button>
        </div>

        {/* Mobile Location and Filter Section - Visible ONLY on mobile */}
        <div className="block lg:hidden">
          <div className="bg-white rounded-lg shadow-md border p-4 space-y-4">
            <div className="space-y-3">
              <h3 className="text-sm font-medium text-gray-900">Location & Filters</h3>
              
              <div className="flex items-center gap-2">
                <Popover open={isLocationPopoverOpen} onOpenChange={setIsLocationPopoverOpen}>
                  <PopoverTrigger asChild>
                    <div className="relative flex-1">
                      <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-500" />
                      <Input
                        placeholder="Set your location"
                        value={locationValue}
                        onChange={(e) => setLocationValue(e.target.value)}
                        className="pl-10 cursor-pointer text-sm"
                        readOnly
                        onClick={() => setIsLocationPopoverOpen(true)}
                      />
                    </div>
                  </PopoverTrigger>
                  <PopoverContent className="w-80 p-4" align="start">
                    <div className="space-y-4">
                      <h4 className="font-medium text-gray-900">Enter your location</h4>
                      
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
                        value={locationValue}
                        onChange={(e) => setLocationValue(e.target.value)}
                        className="w-full"
                        onKeyPress={(e) => {
                          if (e.key === 'Enter' && locationValue.trim()) {
                            handleLocationSelect(locationValue);
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
                      {locationValue.trim() && (
                        <Button
                          onClick={() => handleLocationSelect(locationValue)}
                          className="w-full"
                        >
                          Use "{locationValue}"
                        </Button>
                      )}
                    </div>
                  </PopoverContent>
                </Popover>
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

      {/* Featured Products */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Featured Products Near You</h2>
          <Button variant="outline" onClick={() => navigate('/search')}>
            View All
          </Button>
        </div>
        
        {featuredProducts.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">Check back later for new products!</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {featuredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToBasket={handleAddToBasket}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
