import { useState, useEffect } from "react";
import { MapPin, Search, Filter, Star, Clock, Navigation, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import LocationButton from "@/components/LocationButton";
import TravelFilter, { TravelFilterValue } from "@/components/TravelFilter";
import MainNavigation from "@/components/navigation/MainNavigation";
import { getBasket, addToBasket, getFavorites } from "@/utils/localStorage";
import { supabase } from "@/integrations/supabase/client";

// Define types for clarity and type safety
interface Store {
  id: string; // string to match Supabase
  seller: string;
  price: number;
  distance: number;
  rating: number;
  nbScore: number;
  address?: string;
}

interface Product {
  id: string; // string to match Supabase
  name: string;
  description: string;
  image: string;
  sku: string;
  category: string | null;
  stores: Store[];
}

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [maxDistance, setMaxDistance] = useState(10);
  const [sortBy, setSortBy] = useState("distance");
  const [basket, setBasket] = useState(getBasket());
  const [favorites, setFavorites] = useState(getFavorites());
  const [travelFilter, setTravelFilter] = useState<TravelFilterValue>({
    mode: "walking",
    type: "distance",
    value: 2
  });
  const [searchType, setSearchType] = useState<'product' | 'store'>("product");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const updateFromStorage = () => {
      setBasket(getBasket());
      setFavorites(getFavorites());
    };
    window.addEventListener('storage', updateFromStorage);
    return () => window.removeEventListener('storage', updateFromStorage);
  }, []);

  // Calculate NB Score based on distance and price
  const calculateNBScore = (distance: number, price: number) => {
    const distanceScore = Math.max(0, (10 - distance) / 10 * 2.5);
    const priceScore = Math.max(0, (2000 - price) / 2000 * 2.5);
    return Math.round((distanceScore + priceScore) * 10) / 10;
  };

  // Fetch products and inventory from Supabase
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('id, name, description, image_url, category_id, brand');
      if (productsError || !productsData) {
        setProducts([]);
        setLoading(false);
        return;
      }
      // Fetch all inventory with store and product info
      const { data: inventoryData, error: inventoryError } = await supabase
        .from('inventory')
        .select(`
          id,
          price,
          quantity,
          store_id,
          sku,
          updated_at,
          stores(id, name, address)
        `);
      if (inventoryError || !inventoryData) {
        setProducts([]);
        setLoading(false);
        return;
      }
      // Group inventory by product
      const grouped: Product[] = [];
      productsData.forEach(product => {
        const productStores = inventoryData.filter(inv => inv.sku === product.id);
        if (productStores.length === 0) return;
        grouped.push({
          id: product.sku,
          name: product.name,
          description: product.description || '',
          image: product.image_url || '',
          category: product.category_id || null,
          stores: productStores.map(inv => ({
            id: String(inv.sku),
            seller: inv.stores?.name || '',
            price: inv.price,
            distance: Math.random() * 3 + 0.5, // TODO: Replace with real distance
            rating: 4.5, // TODO: Replace with real rating
            nbScore: calculateNBScore(Math.random() * 3 + 0.5, inv.price),
            address: inv.stores?.address || undefined,
          }))
        });
      });
      setProducts(grouped);
      setLoading(false);
    };
    fetchProducts();
  }, []);

  // Sort stores within each product
  products.forEach(product => {
    product.stores.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "price":
          return a.price - b.price;
        case "nbScore":
          return b.nbScore - a.nbScore;
        default:
          return 0;
      }
    });
  });

  const filteredProducts = products.filter(product => {
    if (searchType === "store") {
      const storeMatch = product.stores.some(store =>
        store.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (searchQuery.toLowerCase().includes("store") && product.category?.toLowerCase().includes(searchQuery.replace(/store(s)?/gi, "").trim()))
      );
      return storeMatch;
    } else {
      const hasValidStore = product.stores.some(store => {
        if (travelFilter.type === "distance") {
          const storeDistanceKm = store.distance * 1.60934;
          return storeDistanceKm <= travelFilter.value;
        } else {
          const minPerMile = {
            walking: 16,
            driving: 2,
            biking: 5,
            transit: 8
          };
          const time = store.distance * minPerMile[travelFilter.mode];
          return time <= travelFilter.value;
        }
      });
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.stores.some(store => store.seller.toLowerCase().includes(searchQuery.toLowerCase()));
      return hasValidStore && matchesSearch;
    }
  });

  // Patch: convert all IDs to numbers for ProductCard/StoreSelectionModal compatibility
  const toNumberId = (id: string | number): number => typeof id === 'number' ? id : parseInt(id, 10);

  // Update ProductCard and StoreSelectionModal usage to use string IDs
  const handleAddToBasket = (productId: number, storeId: number) => {
    const product = products.find(p => p.stores.some(s => s.id === storeId));
    const store = product?.stores.find(s => s.id === storeId);
    if (product && store) {
      const newItem = {
        productId,
        sku: product.sku,
        storeId,
        productName: product.name,
        storeName: store.seller,
        price: store.price
      };
      addToBasket(newItem);
      setBasket(getBasket());
    }
  };

  const handleLocationChange = (location: {lat: number, lng: number} | null) => {
    setUserLocation(location);
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          // ignore
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header - Use MainNavigation with UniversalNavbar */}
      <MainNavigation />

      {/* Hero Section with Headline */}
      <section className="px-4 sm:px-6 lg:px-8 py-8">
        <div className="max-w-4xl mx-auto text-center mb-8">
          <h2 className="text-3xl md:text-4xl font-bold text-gray-900 mb-4">
            Find products you want NearBuy with our NB score that combines price and proximity for the best deals.
          </h2>
        </div>
      </section>

      {/* Search Section */}
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative flex items-center bg-white rounded-lg shadow-md p-2 mb-4">
            <Search className="w-5 h-5 text-gray-400 ml-2" />
            <Input
              placeholder={searchType === "product" ? "Search products near me" : "Search stores near me"}
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0"
            />
            <div className="ml-2 flex items-center gap-1">
              <button
                className={`px-2 py-1 text-xs rounded-l border border-gray-300 ${searchType === "product" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                onClick={() => setSearchType("product")}
                type="button"
              >
                Products
              </button>
              <button
                className={`px-2 py-1 text-xs rounded-r border border-gray-300 ${searchType === "store" ? "bg-blue-600 text-white" : "bg-white text-gray-700"}`}
                onClick={() => setSearchType("store")}
                type="button"
              >
                Stores
              </button>
            </div>
          </div>

          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-base font-medium text-gray-700">Nearby</span>
                <TravelFilter value={travelFilter} onChange={setTravelFilter} />
                <LocationButton userLocation={userLocation} onLocationChange={handleLocationChange} />
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="distance">Distance</option>
                  <option value="price">Price</option>
                  <option value="nbScore">NB Score</option>
                </select>
              </div>
            </div>
            {basket.length > 0 && (
              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                Basket: {basket.length}
              </Badge>
            )}
            {favorites.length > 0 && (
              <Badge variant="secondary" className="bg-pink-100 text-pink-800">
                <Heart className="w-3 h-3 mr-1" />
                {favorites.length}
              </Badge>
            )}
          </div>

          {/* Results Count */}
          <div className="text-sm text-gray-600 mb-4">
            {filteredProducts.length} results found
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={`${product.name}-${product.id}`} 
                product={{
                  ...product,
                  id: toNumberId(product.id),
                  stores: product.stores.map(s => ({ ...s, id: toNumberId(s.id) }))
                }}
                onAddToBasket={handleAddToBasket}
              />
            ))}
          </div>
        ) : (
          <Card className="p-12 text-center">
            <CardContent>
              <MapPin className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-xl font-semibold text-gray-700 mb-2">
                No products found
              </h3>
              <p className="text-gray-500">
                Try adjusting your search criteria or expanding your search distance.
              </p>
            </CardContent>
          </Card>
        )}
      </section>
    </div>
  );
};

export default Index;
