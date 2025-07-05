import React, { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Star, Search, ArrowLeft, ShoppingCart } from 'lucide-react';
import { supabase } from '@/integrations/supabase/client';
import ProductCard from '@/components/ProductCard';
import { addToBasket } from '@/utils/localStorage';
import { toast } from 'sonner';
import { useInfiniteScroll } from '@/hooks/useInfiniteScroll';

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

interface StoreInfo {
  id: string;
  name: string;
  address: string;
  description: string;
  logo_url: string;
  business_name: string;
}

const PRODUCTS_PER_PAGE = 20;

const StoreProducts: React.FC = () => {
  const { storeId } = useParams<{ storeId: string }>();
  const navigate = useNavigate();
  
  const [store, setStore] = useState<StoreInfo | null>(null);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(0);
  const [count, setCount] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Fetch store information
  const fetchStore = useCallback(async () => {
    if (!storeId) return;

    try {
      const { data: storeData, error } = await supabase
        .from('stores')
        .select(`
          id,
          name,
          address,
          description,
          logo_url,
          business_name
        `)
        .eq('id', storeId)
        .single();

      if (error) {
        toast.error('Failed to load store information');
        navigate('/');
        return;
      }

      setStore(storeData);
    } catch (error) {
      console.error('Error fetching store:', error);
      toast.error('Failed to load store information');
      navigate('/');
    }
  }, [storeId, navigate]);

  // Fetch products for this store
  const fetchProducts = useCallback(async (pageNum: number = 0, reset: boolean = false, query: string = '') => {
    if (!storeId) return;

    try {
      if (pageNum === 0) setLoading(true);

      // Build the query for products in this store
      let productsQuery = supabase
        .from('inventory')
        .select(`
          sku,
          price,
          quantity,
          products!inner(
            sku,
            name,
            description,
            image_url,
            brand,
            category:categories(name)
          )
        `, { count: 'exact' })
        .eq('store_id', storeId)
        .gt('quantity', 0);

      // Add search filter if query exists
      if (query.trim()) {
        productsQuery = productsQuery.ilike('products.name', `%${query}%`);
      }

      const { data: inventoryData, error, count: supabaseCount } = await productsQuery
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

      // Transform inventory data to products format
      const transformedProducts: Product[] = inventoryData?.map((item) => ({
        id: item.sku,
        sku: item.sku,
        name: item.products.name,
        description: item.products.description || 'No description available',
        image: item.products.image_url || '/placeholder.svg',
        category: item.products.category?.name || 'General',
        stores: [{
          id: storeId,
          seller: store?.name || 'Store',
          price: Number(item.price),
          distance: 0,
          rating: 4.5,
          nbScore: 4.0,
          address: store?.address || '',
          travelTime: 0
        }]
      })) || [];

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
      if (!inventoryData || inventoryData.length === 0) {
        setHasMore(false);
      }

    } catch (error) {
      console.error('Error fetching products:', error);
      toast.error('Failed to load products');
      setHasMore(false);
    } finally {
      if (pageNum === 0) setLoading(false);
    }
  }, [storeId, store]);

  const loadMore = useCallback(() => {
    if (!hasMore || loading) return;
    
    if (typeof count === 'number' && (page + 1) * PRODUCTS_PER_PAGE >= count) {
      setHasMore(false);
      return;
    }
    
    const nextPage = page + 1;
    setPage(nextPage);
    fetchProducts(nextPage, false, searchQuery);
  }, [page, hasMore, loading, fetchProducts, count, searchQuery]);

  useInfiniteScroll({
    hasMore,
    isLoading: loading,
    onLoadMore: loadMore
  });

  // Handle search with debouncing
  const handleSearchChange = (query: string) => {
    setSearchQuery(query);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    const timeout = setTimeout(() => {
      setPage(0);
      fetchProducts(0, true, query);
    }, 300);

    setSearchTimeout(timeout);
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

  useEffect(() => {
    fetchStore();
  }, [fetchStore]);

  useEffect(() => {
    if (store) {
      fetchProducts(0, true, searchQuery);
      setPage(0);
    }
  }, [store, fetchProducts]);

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (searchTimeout) {
        clearTimeout(searchTimeout);
      }
    };
  }, [searchTimeout]);

  if (loading && products.length === 0) {
    return (
      <div className="space-y-8 container mx-auto px-4 py-8">
        {/* Header Skeleton */}
        <div className="flex items-center space-x-4">
          <div className="w-8 h-8 bg-gray-200 rounded animate-pulse"></div>
          <div className="flex-1">
            <div className="h-8 bg-gray-200 rounded w-64 animate-pulse mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-48 animate-pulse"></div>
          </div>
        </div>

        {/* Search Skeleton */}
        <div className="max-w-2xl mx-auto">
          <div className="h-12 bg-gray-200 rounded animate-pulse"></div>
        </div>

        {/* Products Grid Skeleton */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4, 5, 6, 7, 8].map(i => (
            <Card key={i} className="overflow-hidden animate-pulse">
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

  if (!store) {
    return (
      <div className="container mx-auto px-4 py-8">
        <div className="text-center py-12">
          <h3 className="text-lg font-medium text-gray-900 mb-2">Store not found</h3>
          <p className="text-gray-600 mb-4">The store you're looking for doesn't exist.</p>
          <Button onClick={() => navigate('/')}>Go Back Home</Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 container mx-auto px-4 py-8">
      {/* Store Header */}
      <div className="flex items-start space-x-4">
        <Button 
          variant="ghost" 
          size="sm"
          onClick={() => navigate(-1)}
          className="p-2"
        >
          <ArrowLeft className="w-4 h-4" />
        </Button>
        
        <div className="flex-1">
          <div className="flex items-start space-x-4">
            <img
              src={store.logo_url || '/placeholder.svg'}
              alt={store.name}
              className="w-16 h-16 rounded-lg object-cover border"
              onError={(e) => {
                e.currentTarget.src = '/placeholder.svg';
              }}
            />
            <div className="flex-1">
              <h1 className="text-3xl font-bold mb-2">{store.name}</h1>
              <p className="text-gray-600 mb-2">{store.description || store.business_name}</p>
              {store.address && (
                <div className="flex items-center space-x-1 text-sm text-gray-500">
                  <MapPin className="w-4 h-4" />
                  <span>{store.address}</span>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Search Section */}
      <div className="max-w-2xl mx-auto">
        <div className="relative flex items-center bg-white rounded-lg shadow-md border p-2">
          <Search className="w-5 h-5 text-gray-400 ml-2" />
          <Input
            placeholder={`Search products in ${store.name}...`}
            value={searchQuery}
            onChange={(e) => handleSearchChange(e.target.value)}
            className="flex-1 border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0"
          />
          {searchQuery && (
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => handleSearchChange('')}
              className="ml-2"
            >
              Clear
            </Button>
          )}
        </div>
      </div>

      {/* Products Section */}
      <div>
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">
            Products {searchQuery && `matching "${searchQuery}"`}
            <Badge variant="secondary" className="ml-2">
              {count !== null ? count : products.length} items
            </Badge>
          </h2>
        </div>

        {products.length === 0 && !loading ? (
          <div className="text-center py-12">
            <ShoppingCart className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-gray-900 mb-2">
              {searchQuery ? 'No products found' : 'No products available'}
            </h3>
            <p className="text-gray-600">
              {searchQuery 
                ? `No products matching "${searchQuery}" found in this store.`
                : 'This store doesn\'t have any products available right now.'
              }
            </p>
            {searchQuery && (
              <Button 
                variant="outline" 
                onClick={() => handleSearchChange('')}
                className="mt-4"
              >
                Show All Products
              </Button>
            )}
          </div>
        ) : (
          <>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.sku}
                  product={product}
                  onAddToBasket={handleAddToBasket}
                  hideStoreSelection={true}
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
                <p>You've seen all available products in this store!</p>
              </div>
            )}
          </>
        )}
      </div>
    </div>
  );
};

export default StoreProducts;
