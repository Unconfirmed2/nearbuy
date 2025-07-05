import React, { useState, useEffect, useCallback } from 'react';
import { getUserLocation, setUserLocation } from '@/utils/location';
import { calculateDistance, calculateTravelTime } from '@/lib/distance';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';
import { Search, ShoppingCart } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { toast } from 'sonner';
import { addToBasket } from '@/utils/localStorage';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';
import LocationAutocompleteInput from "@/components/LocationAutocompleteInput";

interface Store {
  id: string;
  seller: string;
  price: number;
  distance: number;
  rating: number;
  nbScore: number;
  address?: string;
  travelTime: number;
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

// Helper function to convert UUID string to a stable positive number
const uuidToNumber = (uuid: string): number => {
  let hash = 0;
  for (let i = 0; i < uuid.length; i++) {
    const char = uuid.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash = hash & hash;
  }
  return Math.abs(hash);
};

const PRODUCTS_PER_PAGE = 20;

const ProductSearch: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'products');
  const [travelFilter, setTravelFilter] = useState<TravelFilterValue>({
    mode: 'driving',
    type: 'distance',
    value: 5
  });
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  // Persistent location value
  const [locationValue, setLocationValue] = useState('');

  useEffect(() => {
    const stored = getUserLocation();
    if (stored && stored !== locationValue) {
      setLocationValue(stored);
    }
  }, []);

  // Fetch products from Supabase with pagination
  const fetchProducts = useCallback(async (query: string, pageNum: number = 0, reset: boolean = false) => {
    if (!query.trim()) {
      setProducts([]);
      setHasMore(false);
      return;
    }

    try {
      if (pageNum === 0) setLoading(true);
      
      const { data: products, error, count } = await supabase
        .from('products')
        .select(`
          sku,
          name,
          description,
          image_url,
          brand,
          category:categories(name)
        `, { count: 'exact' })
        .or(`name.ilike.%${query}%,description.ilike.%${query}%,brand.ilike.%${query}%`)
        .range(pageNum * PRODUCTS_PER_PAGE, (pageNum + 1) * PRODUCTS_PER_PAGE - 1)
        .limit(PRODUCTS_PER_PAGE);

      if (error) {
        toast.error('Failed to search products');
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
          distance: 0, // Will be set later if locationValue is present
          rating: item.stores.rating ?? 0, // Use real rating if available
          nbScore: item.stores.nbScore ?? 0, // Use real nbScore if available
          address: item.stores.address || 'Address not available',
          travelTime: 0
        });
      });

      // Calculate distance/travelTime for each store if locationValue is set
      let transformedProducts: Product[] = products?.map((product) => {
        let stores = productInventoryMap.get(product.sku) || [];
        return {
          id: product.sku,
          sku: product.sku,
          name: product.name,
          description: product.description || 'No description available',
          image: product.image_url || '/placeholder.svg',
          category: product.category?.name || 'General',
          stores: stores
        };
      }) || [];

      // 1. Calculate travelTime/distance for each store if locationValue is set
      if (locationValue) {
        for (const product of transformedProducts) {
          for (const store of product.stores) {
            if (store.address) {
              try {
                if (travelFilter.type === 'time') {
                  store.travelTime = await calculateTravelTime(locationValue, store.address);
                } else {
                  store.distance = await calculateDistance(locationValue, store.address);
                }
              } catch (e) {
                // fallback: leave as is
              }
            }
          }
        }
      }

      // 2. Filter stores within the distance/time threshold
      transformedProducts = transformedProducts.map(product => ({
        ...product,
        stores: product.stores.filter(store => {
          if (locationValue) {
            if (travelFilter.type === 'time') {
              return store.travelTime <= travelFilter.value;
            } else {
              return store.distance <= travelFilter.value * 1000; // value in km
            }
          }
          return true;
        })
      })).filter(product => product.stores.length > 0);

      // 3. Filter products by search field (if present), with improved fuzzy matching and ranking
      let filteredProducts: Product[] = transformedProducts;
      let ranked: Array<{product: Product, score: number}> = [];
      if (searchQuery.trim()) {
        const q = searchQuery.trim().toLowerCase();
        for (const product of transformedProducts) {
          let score = 0;
          if (product.name.toLowerCase() === q) score += 100;
          else if (product.name.toLowerCase().includes(q)) score += 50;
          if (product.category.toLowerCase() === q) score += 40;
          else if (product.category.toLowerCase().includes(q)) score += 20;
          if (product.description.toLowerCase().includes(q)) score += 10;
          // Bonus for closest store
          const bestStore = product.stores[0];
          if (locationValue && bestStore) {
            if (travelFilter.type === 'time') {
              score += Math.max(0, 30 - bestStore.travelTime); // closer = higher score
            } else {
              score += Math.max(0, 30000 - bestStore.distance) / 1000; // closer = higher score
            }
          }
          if (score > 0) ranked.push({ product, score });
        }
        // Sort by score desc, then by nearest store, then price, then name
        ranked.sort((a, b) => {
          if (b.score !== a.score) return b.score - a.score;
          const aStore = a.product.stores[0];
          const bStore = b.product.stores[0];
          if (locationValue) {
            if (travelFilter.type === 'time') {
              return aStore.travelTime - bStore.travelTime || aStore.price - bStore.price || a.product.name.localeCompare(b.product.name);
            } else {
              return aStore.distance - bStore.distance || aStore.price - bStore.price || a.product.name.localeCompare(b.product.name);
            }
          }
          return aStore.price - bStore.price || a.product.name.localeCompare(b.product.name);
        });
        filteredProducts = ranked.map(r => r.product);
      } else {
        // No search: sort all by nearest store, then price, then name
        filteredProducts = filteredProducts.map(product => ({
          ...product,
          stores: product.stores.sort((a, b) => {
            if (locationValue) {
              if (travelFilter.type === 'time') {
                return a.travelTime - b.travelTime || a.price - b.price;
              } else {
                return a.distance - b.distance || a.price - b.price;
              }
            }
            return a.price - b.price;
          })
        }))
        .sort((a, b) => {
          const aStore = a.stores[0];
          const bStore = b.stores[0];
          if (locationValue) {
            if (travelFilter.type === 'time') {
              return aStore.travelTime - bStore.travelTime || aStore.price - bStore.price || a.name.localeCompare(b.name);
            } else {
              return aStore.distance - bStore.distance || aStore.price - bStore.price || a.name.localeCompare(b.name);
            }
          }
          return aStore.price - bStore.price || a.name.localeCompare(b.name);
        });
      }

      // 4. Only show products with at least one store
      filteredProducts = filteredProducts.filter(product => product.stores.length > 0);

      if (reset || pageNum === 0) {
        setProducts(filteredProducts);
      } else {
        setProducts(prev => [...prev, ...filteredProducts]);
      }

      if (reset || pageNum === 0) {
        setProducts(transformedProducts);
      } else {
        setProducts(prev => [...prev, ...transformedProducts]);
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
      toast.error('Failed to search products');
      setHasMore(false);
    } finally {
      if (pageNum === 0) setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(searchQuery, nextPage);
  }, [page, searchQuery, hasMore, loading, fetchProducts]);

  useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore
  });

  useEffect(() => {
    const query = searchParams.get('q') || '';
    const type = searchParams.get('type') || 'products';
    setSearchQuery(query);
    setSearchType(type);
    
    if (query && type === 'products') {
      setPage(0);
      fetchProducts(query, 0, true);
    }
  }, [searchParams, fetchProducts]);

  const handleSearch = () => {
    if (!searchQuery.trim()) {
      toast.error('Please enter a search term');
      return;
    }
    
    const newParams = new URLSearchParams();
    newParams.set('q', searchQuery);
    newParams.set('type', searchType);
    setSearchParams(newParams);
    
    if (searchType === 'products') {
      setPage(0);
      fetchProducts(searchQuery, 0, true);
    }
  };

  const handleAddToBasket = (sku: string, storeId: string) => {
    const product = products.find(p => p.sku === sku);
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

  return (
    <div className="space-y-6 container mx-auto px-4 py-8">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Search Results</h1>
        
        <div className="space-y-4">
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

          <div className="flex gap-4">
            <Input
              placeholder={
                searchType === 'products' 
                  ? "Search for products..." 
                  : "Search stores by name or description..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
              onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
            />
            <LocationAutocompleteInput
              placeholder="Set your location"
              value={locationValue}
              onChange={val => {
                setLocationValue(val);
                setUserLocation(val);
              }}
              className="w-64"
            />
            <Button onClick={handleSearch} disabled={loading}>
              <Search className="h-4 w-4 mr-2" />
              {loading ? 'Searching...' : 'Search'}
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filters:</span>
            <TravelFilter 
              value={travelFilter}
              onChange={setTravelFilter}
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {searchType === 'products' ? 'Products' : 'Stores'} Found
        </h2>
        
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3, 4, 5, 6].map(i => (
              <Card key={i} className="group overflow-hidden hover:shadow-lg transition-shadow animate-pulse">
                <div className="h-32 bg-gray-200"></div>
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
        ) : searchQuery ? (
          products.length > 0 ? (
            <>
              <p className="text-gray-600 mb-4">
                Found {products.length}{hasMore ? '+' : ''} result{products.length !== 1 ? 's' : ''} for "{searchQuery}"
              </p>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                {products.map((product) => (
                  <ProductCard
                    key={product.sku}
                    product={product}
                    onAddToBasket={handleAddToBasket}
                    locationValue={locationValue}
                  />
                ))}
              </div>
              
              {/* Loading indicator for infinite scroll */}
              {hasMore && (
                <div className="flex justify-center mt-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              )}
              
              {!hasMore && products.length > 0 && (
                <div className="text-center mt-8 text-gray-500">
                  <p>No more results found for "{searchQuery}"</p>
                </div>
              )}
            </>
          ) : (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
              <p className="text-gray-600">
                No products match your search for "{searchQuery}". Try different keywords.
              </p>
            </div>
          )
        ) : (
          <p className="text-gray-600">
            Enter a search query to find {searchType === 'products' ? 'products' : 'stores'} near you.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
