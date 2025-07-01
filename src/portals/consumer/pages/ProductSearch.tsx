import React, { useState, useEffect, useCallback } from 'react';
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
          id,
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
        console.error('Error fetching products:', error);
        toast.error('Failed to search products');
        return;
      }

      // Mock addresses for stores
      const mockAddresses = [
        '123 Main St, Downtown',
        '456 Oak Ave, Shopping District',
        '789 Pine Rd, University Area',
        '321 Elm St, Midtown',
        '654 Maple Dr, Eastside'
      ];

      // Transform data to match expected format and add mock store data
      const transformedProducts: Product[] = products?.map((product) => {
        const storeCount = Math.floor(Math.random() * 3) + 2;
        const stores: Store[] = [];
        
        const productId = uuidToNumber(product.id);
        
        for (let i = 0; i < storeCount; i++) {
          stores.push({
            id: productId * 10 + i + 1000,
            seller: `Store ${String.fromCharCode(65 + i)}`,
            price: Math.floor(Math.random() * 50) + 10,
            distance: Math.random() * 5 + 0.5,
            rating: 3.5 + Math.random() * 1.5,
            nbScore: Math.floor(Math.random() * 2) + 4,
            address: mockAddresses[i % mockAddresses.length]
          });
        }

        return {
          id: productId,
          name: product.name,
          description: product.description || 'No description available',
          image: product.image_url || '/placeholder.svg',
          category: product.category?.name || 'General',
          stores: stores.sort((a, b) => a.price - b.price)
        };
      }) || [];

      if (reset || pageNum === 0) {
        setProducts(transformedProducts);
      } else {
        setProducts(prev => [...prev, ...transformedProducts]);
      }
      
      // Check if we have more products to load
      const totalLoaded = (pageNum + 1) * PRODUCTS_PER_PAGE;
      setHasMore(count ? totalLoaded < count : transformedProducts.length === PRODUCTS_PER_PAGE);
      
    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to search products');
    } finally {
      if (pageNum === 0) setLoading(false);
    }
  }, []);

  const loadMore = useCallback(() => {
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(searchQuery, nextPage);
  }, [page, searchQuery, fetchProducts]);

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

  const handleAddToBasket = (productId: number, storeId: number) => {
    const product = products.find(p => p.id === productId);
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
                    key={product.id}
                    product={product}
                    onAddToBasket={handleAddToBasket}
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
