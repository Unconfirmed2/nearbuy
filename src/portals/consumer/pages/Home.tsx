import React, { useState, useEffect, useCallback } from 'react';
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
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

interface Store {
  id: number;
  seller: string;
  price: number;
  distance: number;
  rating: number;
  nbScore: number;
  address?: string;
}

interface Product {
  id: number;
  name: string;
  description: string;
  image: string;
  category: string;
  stores: Store[];
}

interface HomeProps {
  isMerchantPreview?: boolean;
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

const PRODUCTS_PER_PAGE = 20;

const Home: React.FC<HomeProps> = ({ isMerchantPreview = false }) => {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  
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

  // Fetch products from Supabase with pagination
  const fetchProducts = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      
      const { data: products, error, count } = await supabase
        .from('products')
        .select(`
          id,
          name,
          description,
          image_url,
          brand,
          category:categories(name)
        `, { count: 'exact' })
        .range(pageNum * PRODUCTS_PER_PAGE, (pageNum + 1) * PRODUCTS_PER_PAGE - 1)
        .limit(PRODUCTS_PER_PAGE);

      if (error) {
        toast.error('Failed to load products');
        setHasMore(false);
        return;
      }

      // Fetch inventory data for products from stores
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select(`
          id,
          price,
          quantity,
          store_id,
          product_id,
          stores!inner(
            id,
            name,
            address,
            description
          )
        `)
        .in('product_id', products?.map(p => p.id) || [])
        .gt('quantity', 0);

      if (inventoryError) {
        toast.error('Failed to load store data');
        setHasMore(false);
        return;
      }

      // Group inventory by product
      const productInventoryMap = new Map();
      inventoryData?.forEach(item => {
        if (!productInventoryMap.has(item.product_id)) {
          productInventoryMap.set(item.product_id, []);
        }
        productInventoryMap.get(item.product_id).push({
          id: uuidToNumber(item.store_id),
          seller: item.stores.name,
          price: Number(item.price),
          distance: 2.5, // TODO: Calculate real distance using user location
          rating: 4.5,
          nbScore: 4,
          address: item.stores.address || 'Address not available'
        });
      });

      // Transform products with real store data
      const transformedProducts: Product[] = products?.map((product) => {
        const stores = productInventoryMap.get(product.id) || [];
        
        return {
          id: uuidToNumber(product.id),
          name: product.name,
          description: product.description || 'No description available',
          image: product.image_url || '/placeholder.svg',
          category: product.category?.name || 'General',
          stores: stores.sort((a, b) => a.price - b.price)
        };
      }).filter(product => product.stores.length > 0) || [];
      
      if (reset || pageNum === 0) {
        setFeaturedProducts(transformedProducts);
      } else {
        setFeaturedProducts(prev => [...prev, ...transformedProducts]);
      }
      
      // Check if we have more products to load
      const totalLoaded = (pageNum + 1) * PRODUCTS_PER_PAGE;
      const hasMoreProducts = count ? totalLoaded < count : transformedProducts.length === PRODUCTS_PER_PAGE;
      setHasMore(hasMoreProducts);
      
      // If no products returned, we've reached the end
      if (!products || products.length === 0) {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setHasMore(false);
    } finally {
      if (pageNum === 0) setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage);
  }, [page, hasMore, loading, fetchProducts]);

  useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore
  });

  useEffect(() => {
    fetchProducts(0, true);
    setPage(0);
  }, []);

  const handleAddToBasket = (productId: number, storeId: number) => {
    if (isMerchantPreview) {
      toast.info('Cart actions are disabled in merchant preview mode');
      return;
    }

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
    if (isMerchantPreview) {
      toast.info('Favorites are disabled in merchant preview mode');
      return;
    }

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

  if (loading && featuredProducts.length === 0) {
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
          <p className="text-xl opacity-90">
            {isMerchantPreview 
              ? "Preview how your products appear to customers" 
              : "Discover local products and plan your pickup route"
            }
          </p>
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
          <h2 className="text-2xl font-bold">
            {isMerchantPreview ? "Your Products as Seen by Customers" : "Featured Products Near You"}
          </h2>
          <Button variant="outline" onClick={() => navigate('/search')}>
            View All
          </Button>
        </div>
        
        {featuredProducts.length === 0 && !loading ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products available</h3>
            <p className="text-gray-600">Check back later for new products!</p>
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToBasket={handleAddToBasket}
                  isMerchantPreview={isMerchantPreview}
                />
              ))}
            </div>
            
            {/* Loading indicator for infinite scroll */}
            {hasMore && (
              <div className="flex justify-center mt-8">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              </div>
            )}
            
            {!hasMore && featuredProducts.length > 0 && (
              <div className="text-center mt-8 text-gray-500">
                <p>You've seen all available products!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default Home;
