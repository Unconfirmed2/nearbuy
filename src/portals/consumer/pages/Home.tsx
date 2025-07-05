import React, { useState, useEffect, useCallback, useRef } from 'react';
import { getUserLocation, setUserLocation } from '@/utils/location';
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
import { GOOGLE_MAPS_API_KEY } from '@/config';
import LocationAutocompleteInput from "@/components/LocationAutocompleteInput";

// Fetch user's approximate location via IP
async function fetchApproxLocation() {
  try {
    const res = await fetch('https://ip-api.com/json/?fields=status,city,zip,lat,lon');
    const data = await res.json();
    if (data.status === 'success') {
      return {
        city: data.city,
        zip: data.zip,
        lat: data.lat,
        lon: data.lon
      };
    } else {
      throw new Error('IP lookup failed');
    }
  } catch (err) {
    console.error('Error fetching IP location:', err);
    return null;
  }
}

// Utility to load Google Maps JS API script if not already loaded
function loadGoogleMapsScript(callback: () => void) {
  if (window.google && window.google.maps && window.google.maps.places) {
    callback();
    return;
  }
  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    existingScript.addEventListener('load', callback);
    return;
  }
  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${GOOGLE_MAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
}

// Store Card Component
const StoreCard: React.FC<{
  store: StoreWithProducts;
  onViewStore: (storeId: string) => void;
  onSeeProducts: (storeId: string) => void;
  isMerchantPreview?: boolean;
}> = ({ store, onViewStore, onSeeProducts, isMerchantPreview = false }) => {
  return (
    <Card className="group overflow-hidden hover:shadow-lg transition-shadow">
      <div className="relative h-48 overflow-hidden cursor-pointer" onClick={() => onViewStore(store.id)}>
        <img
          src={store.logo_url}
          alt={store.name}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
          onError={(e) => {
            e.currentTarget.src = '/placeholder.svg';
          }}
        />
        <div className="absolute top-3 right-3">
          <Badge variant="secondary" className="bg-white/90 text-gray-800">
            {store.productCount} items
          </Badge>
        </div>
      </div>
      <CardContent className="p-4">
        <div className="space-y-3">
          <div>
            <h3 
              className="font-semibold text-lg mb-1 line-clamp-1 cursor-pointer hover:text-blue-600 transition-colors"
              onClick={() => onSeeProducts(store.id)}
            >
              {store.name}
            </h3>
            <p className="text-sm text-gray-600 line-clamp-2">{store.description}</p>
          </div>
          
          <div className="flex items-center justify-between text-sm">
            <div className="flex items-center space-x-3">
              {store.distance !== undefined && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <MapPin className="w-4 h-4" />
                  <span>{(store.distance / 1000).toFixed(1)}km</span>
                </div>
              )}
              {store.travelTime !== undefined && (
                <div className="flex items-center space-x-1 text-gray-600">
                  <Clock className="w-4 h-4" />
                  <span>{Math.round(store.travelTime)}min</span>
                </div>
              )}
            </div>
            <div className="flex items-center space-x-1">
              <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
              <span className="font-medium">{store.rating.toFixed(1)}</span>
            </div>
          </div>

          {/* Sample products preview */}
          {store.products.length > 0 && (
            <div>
              <p className="text-xs text-gray-500 mb-2">Popular items:</p>
              <div className="flex gap-2 overflow-x-auto">
                {store.products.slice(0, 3).map((product) => (
                  <div key={product.sku} className="flex-shrink-0">
                    <img
                      src={product.image_url}
                      alt={product.name}
                      className="w-12 h-12 object-cover rounded border"
                      onError={(e) => {
                        e.currentTarget.src = '/placeholder.svg';
                      }}
                    />
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex gap-2 pt-2">
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onSeeProducts(store.id);
              }}
              className="flex-1 bg-blue-600 hover:bg-blue-700 text-sm"
              size="sm"
              disabled={isMerchantPreview}
            >
              {isMerchantPreview ? 'Products Disabled' : 'See Products'}
            </Button>
            <Button 
              onClick={(e) => {
                e.stopPropagation();
                onViewStore(store.id);
              }}
              variant="outline"
              className="text-sm"
              size="sm"
              disabled={isMerchantPreview}
            >
              {isMerchantPreview ? 'Store Disabled' : 'View Store'}
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

interface Store {
  id: string;
  seller: string;
  price: number;
  distance: number;
  rating: number;
  nbScore: number;
  address?: string;
  travelTime: number; // in minutes or seconds, depending on your convention
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

interface StoreWithProducts {
  id: string;
  name: string;
  address: string;
  description: string;
  logo_url: string;
  distance?: number;
  travelTime?: number;
  rating: number;
  nbScore: number;
  productCount: number;
  products: {
    sku: string;
    name: string;
    price: number;
    image_url: string;
  }[];
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
  const [featuredStores, setFeaturedStores] = useState<StoreWithProducts[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState<number | null>(null);
  
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('products');
  
  // Mobile location and filter states
  const [locationValue, setLocationValue] = useState('');
  const [locationInitialized, setLocationInitialized] = useState(false);
  const [isLocationPopoverOpen, setIsLocationPopoverOpen] = useState(false);
  const [travelFilter, setTravelFilter] = useState<TravelFilterValue>({
    mode: 'driving',
    type: 'distance',
    value: 5
  });

  const locationInputRef = useRef<HTMLInputElement>(null);

  // Always sync locationValue with persistent storage on mount, or use IP location if not set
  useEffect(() => {
    const stored = getUserLocation();
    if (stored && stored !== locationValue) {
      setLocationValue(stored);
      setLocationInitialized(true);
    } else if (!stored && !locationInitialized) {
      // Try to fetch approximate location
      fetchApproxLocation().then((loc) => {
        if (loc && loc.lat && loc.lon) {
          const locString = `${loc.lat}, ${loc.lon}`;
          setLocationValue(locString);
          setUserLocation(locString);
        } else if (loc && loc.city) {
          setLocationValue(loc.city);
          setUserLocation(loc.city);
        }
        setLocationInitialized(true);
      });
    }
  }, [locationInitialized, locationValue]);

  // Attach Google Maps Autocomplete to location input
  useEffect(() => {
    loadGoogleMapsScript(() => {
      if (locationInputRef.current && window.google && window.google.maps && window.google.maps.places) {
        const autocomplete = new window.google.maps.places.Autocomplete(locationInputRef.current, {
          types: ['geocode'],
        });
        autocomplete.addListener('place_changed', () => {
          const place = autocomplete.getPlace();
          if (place.formatted_address) {
            setLocationValue(place.formatted_address);
            setUserLocation(place.formatted_address);
            setIsLocationPopoverOpen(false);
            toast.success('Location updated!');
          }
        });
      }
    });
  }, [isLocationPopoverOpen]);

  // Fetch stores from Supabase with pagination
  const fetchStores = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      
      const { data: stores, error, count: supabaseCount } = await supabase
        .from('stores')
        .select(`
          id,
          name,
          address,
          description,
          logo_url,
          business_name
        `, { count: 'exact' })
        .range(pageNum * PRODUCTS_PER_PAGE, (pageNum + 1) * PRODUCTS_PER_PAGE - 1)
        .limit(PRODUCTS_PER_PAGE);

      if (typeof supabaseCount === 'number') {
        setCount(supabaseCount);
      }

      if (error) {
        toast.error('Failed to load stores');
        setHasMore(false);
        return;
      }

      // Fetch inventory data for each store to get product counts and sample products
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select(`
          id,
          price,
          quantity,
          store_id,
          sku,
          products!inner(
            sku,
            name,
            image_url
          )
        `)
        .in('store_id', stores?.map(s => s.id) || [])
        .gt('quantity', 0)
        .limit(1000); // Limit to avoid too much data

      if (inventoryError) {
        toast.error('Failed to load store inventory');
        setHasMore(false);
        return;
      }

      // Group inventory by store
      const storeInventoryMap = new Map();
      inventoryData?.forEach(item => {
        if (!storeInventoryMap.has(item.store_id)) {
          storeInventoryMap.set(item.store_id, []);
        }
        storeInventoryMap.get(item.store_id).push({
          sku: item.sku,
          name: item.products.name,
          price: Number(item.price),
          image_url: item.products.image_url || '/placeholder.svg'
        });
      });

      // Transform stores with product data
      let transformedStores: StoreWithProducts[] = stores?.map((store) => {
        const products = storeInventoryMap.get(store.id) || [];
        return {
          id: store.id,
          name: store.name,
          address: store.address || 'Address not available',
          description: store.description || store.business_name || 'No description available',
          logo_url: store.logo_url || '/placeholder.svg',
          distance: undefined,
          travelTime: undefined,
          rating: 4.5, // Default rating - you can fetch from reviews table if needed
          nbScore: 4.0, // Default nbScore
          productCount: products.length,
          products: products.slice(0, 4) // Show first 4 products as preview
        };
      }).filter(store => store.productCount > 0) || [];

      // Calculate distance and travelTime for each store if locationValue is set
      if (locationValue) {
        const { calculateDistance, calculateTravelTime } = await import('@/lib/distance');
        for (const store of transformedStores) {
          if (store.address) {
            try {
              store.distance = await calculateDistance(locationValue, store.address);
              store.travelTime = await calculateTravelTime(locationValue, store.address);
            } catch (e) {
              console.error('Distance/TravelTime error:', e, { origin: locationValue, dest: store.address });
            }
          }
        }

        // Filter stores based on travel filter
        transformedStores = transformedStores.filter(store => {
          if (travelFilter.type === 'time') {
            return typeof store.travelTime !== 'number' || store.travelTime <= travelFilter.value;
          } else {
            return typeof store.distance !== 'number' || store.distance <= travelFilter.value * 1000;
          }
        });
      }

      // Sort stores by distance if available, otherwise by name
      transformedStores = transformedStores.sort((a, b) => {
        if (a.distance !== undefined && b.distance !== undefined) {
          return a.distance - b.distance;
        }
        return a.name.localeCompare(b.name);
      });
      
      if (reset || pageNum === 0) {
        setFeaturedStores(transformedStores);
      } else {
        setFeaturedStores(prev => [...prev, ...transformedStores]);
      }
      
      // Check if we have more stores to load
      const totalLoaded = (pageNum + 1) * PRODUCTS_PER_PAGE;
      const hasMoreStores = count ? totalLoaded < count : transformedStores.length === PRODUCTS_PER_PAGE;
      setHasMore(hasMoreStores);
      
      // If no stores returned, we've reached the end
      if (!stores || stores.length === 0) {
        setHasMore(false);
      }
      
    } catch (error) {
      console.error('Error fetching stores:', error);
      toast.error('Failed to load stores');
      setHasMore(false);
    } finally {
      if (pageNum === 0) setLoading(false);
    }
  }, [locationValue, travelFilter]);

  // Fetch products from Supabase with pagination
  const fetchProducts = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    try {
      if (pageNum === 0) setLoading(true);
      
      const { data: products, error, count: supabaseCount } = await supabase
        .from('products')
        .select(`
          sku,
          name,
          description,
          image_url,
          brand,
          category:categories(name)
        `, { count: 'exact' })
        .range(pageNum * PRODUCTS_PER_PAGE, (pageNum + 1) * PRODUCTS_PER_PAGE - 1)
        .limit(PRODUCTS_PER_PAGE);
      if (typeof supabaseCount === 'number') {
        setCount(supabaseCount);
      }

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
          sku,
          stores!inner(
            id,
            name,
            address,
            description
          )
        `)
        .in('sku', products?.map(p => p.sku) || [])
        .gt('quantity', 0);

      if (inventoryError) {
        toast.error('Failed to load store data');
        setHasMore(false);
        return;
      }

      // Group inventory by product
      const productInventoryMap = new Map();
      inventoryData?.forEach(item => {
        if (!productInventoryMap.has(item.sku)) {
          productInventoryMap.set(item.sku, []);
        }
        productInventoryMap.get(item.sku).push({
          id: item.store_id,
          seller: item.stores.name,
          price: Number(item.price),
          distance: undefined, // Will be set below if locationValue is present
          rating: item.stores.rating ?? 4.5,
          nbScore: item.stores.nbScore ?? 4,
          address: item.stores.address || 'Address not available',
          travelTime: undefined // Will be set below if locationValue is present
        });
      });

      // Transform products with real store data
      let transformedProducts: Product[] = products?.map((product) => {
        const stores = productInventoryMap.get(product.sku) || [];
        return {
          id: product.sku,
          sku: product.sku,
          name: product.name,
          description: product.description || 'No description available',
          image: product.image_url || '/placeholder.svg',
          category: product.category?.name || 'General',
          stores: stores
        };
      }).filter(product => product.stores.length > 0) || [];

      // Calculate distance and travelTime for each store if locationValue is set
      if (locationValue) {
        const { calculateDistance, calculateTravelTime } = await import('@/lib/distance');
        for (const product of transformedProducts) {
          // Calculate and collect all store distances/times in parallel for this product
          await Promise.all(product.stores.map(async (store) => {
            if (store.address) {
              try {
                store.distance = await calculateDistance(locationValue, store.address);
                store.travelTime = await calculateTravelTime(locationValue, store.address);
              } catch (e) {
                console.error('Distance/TravelTime error:', e, { origin: locationValue, dest: store.address });
              }
            }
          }));
        }
        // Only filter out stores that EXCEED the filter value, keep others
        transformedProducts = transformedProducts.map(product => ({
          ...product,
          stores: product.stores.filter(store => {
            if (travelFilter.type === 'time') {
              return typeof store.travelTime !== 'number' || store.travelTime <= travelFilter.value;
            } else {
              return typeof store.distance !== 'number' || store.distance <= travelFilter.value * 1000;
            }
          })
        })).filter(product => product.stores.length > 0);
        // Debug log
        console.log('After filtering:', transformedProducts.length, 'products');
        transformedProducts.forEach(p => console.log(p.name, p.stores.length, 'stores', p.stores.map(s => ({ id: s.id, distance: s.distance, travelTime: s.travelTime }))));
      }

      // Sort stores by price after distance/travelTime is set
      transformedProducts = transformedProducts.map(product => ({
        ...product,
        stores: product.stores.sort((a, b) => a.price - b.price)
      }));
      
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
  }, [locationValue, travelFilter]);

  // Combined fetch function that chooses between products and stores
  const fetchData = useCallback(async (pageNum: number = 0, reset: boolean = false) => {
    if (searchType === 'products') {
      await fetchProducts(pageNum, reset);
    } else {
      await fetchStores(pageNum, reset);
    }
  }, [searchType, fetchProducts, fetchStores]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    // Prevent fetching if we've loaded all items
    if (typeof count === 'number' && (page + 1) * PRODUCTS_PER_PAGE >= count) {
      setHasMore(false);
      return;
    }
    const nextPage = page + 1;
    setPage(nextPage);
    fetchData(nextPage);
  }, [page, hasMore, loading, fetchData, count]);

  useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore
  });

  useEffect(() => {
    fetchData(0, true);
    setPage(0);
  }, [searchType]);

  useEffect(() => {
    fetchData(0, true);
    setPage(0);
  }, []);

  // Default travel filter to 20 miles on first load
  useEffect(() => {
    setTravelFilter((prev) => ({ ...prev, value: 20 }));
  }, []);

  const handleAddToBasket = (sku: string, storeId: string) => {
    if (isMerchantPreview) {
      toast.info('Cart actions are disabled in merchant preview mode');
      return;
    }

    const product = featuredProducts.find(p => p.sku === sku);
    const store = product?.stores.find(s => s.id === storeId);
    
    if (product && store) {
      addToBasket({
        sku: product.sku,
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
      sku: product.sku,
      productName: product.name,
      image: product.image
    });
    toast.success('Added to favorites!');
  };

  const handleViewStore = (storeId: string) => {
    if (isMerchantPreview) {
      toast.info('Store navigation is disabled in merchant preview mode');
      return;
    }
    navigate(`/store/${storeId}`);
  };

  const handleSeeProducts = (storeId: string) => {
    if (isMerchantPreview) {
      toast.info('Product navigation is disabled in merchant preview mode');
      return;
    }
    navigate(`/store/${storeId}`);
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
    setUserLocation(selectedLocation);
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
          setUserLocation(locationString);
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

  if (loading && featuredProducts.length === 0 && featuredStores.length === 0) {
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
              : "Search. Compare. Pick Up."
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
                      <LocationAutocompleteInput
                        placeholder="Set your location"
                        value={locationValue}
                        onChange={setLocationValue}
                        className="pl-10 cursor-pointer text-sm"
                        readOnly
                        onClick={() => setIsLocationPopoverOpen(true)}
                        ref={locationInputRef}
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
                      <LocationAutocompleteInput
                        ref={locationInputRef}
                        placeholder="Type your address..."
                        value={locationValue}
                        onChange={setLocationValue}
                        className="w-full"
                        autoComplete="off"
                      />
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

      {/* Featured Products/Stores */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            {isMerchantPreview 
              ? (searchType === 'products' ? "Your Products as Seen by Customers" : "Your Store as Seen by Customers")
              : (searchType === 'products' ? "Featured Products Near You" : "Featured Stores Near You")
            }
          </h2>
          <Button variant="outline" onClick={() => navigate('/search')}>
            View All
          </Button>
        </div>
        
        {searchType === 'products' ? (
          // Products View
          featuredProducts.length === 0 && !loading ? (
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
                    key={product.sku}
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
          )
        ) : (
          // Stores View
          featuredStores.length === 0 && !loading ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No stores available</h3>
              <p className="text-gray-600">Check back later for new stores!</p>
            </div>
          ) : (
            <>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {featuredStores.map((store) => (
                  <StoreCard
                    key={store.id}
                    store={store}
                    onViewStore={handleViewStore}
                    onSeeProducts={handleSeeProducts}
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
              
              {!hasMore && featuredStores.length > 0 && (
                <div className="text-center mt-8 text-gray-500">
                  <p>You've seen all available stores!</p>
                </div>
              )}
            </>
          )
        )}
      </div>
    </div>
  );
};

export default Home;
