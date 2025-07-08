import { useState, useEffect } from "react";
import { MapPin, Search as SearchIcon, Heart, Map } from "lucide-react";
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
import { calculateDistance, calculateTravelTime } from "@/lib/distance";
import { latLngToString } from "@/lib/latLngToString";
import { getDefaultDistanceUnit, metersToUnit } from "@/lib/units";

// Types
interface Store {
  id: string;
  seller: string;
  price: number;
  distance: number;
  travelTime: number;
  rating: number;
  nbScore: number;
  address?: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  sku: string;
  category: string | null;
  stores: Store[];
}

const Search = () => {
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
  const [showMap, setShowMap] = useState(false);
  const [distanceUnit, setDistanceUnit] = useState<'km' | 'mi'>('km');

  // Fetch user's general location and country on mount if not set
  useEffect(() => {
    if (!userLocation) {
      // First try to get precise location via navigator.geolocation
      if (navigator.geolocation) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const newLocation = {
              lat: position.coords.latitude,
              lng: position.coords.longitude
            };
            setUserLocation(newLocation);
            
            // Still fetch country info for distance unit
            fetch('https://ipapi.co/json/')
              .then(res => res.json())
              .then(data => {
                if (data && data.country_code) {
                  setDistanceUnit(getDefaultDistanceUnit(data.country_code));
                }
              })
              .catch(() => {
                // Default to km if country detection fails
                setDistanceUnit('km');
              });
          },
          (error) => {
            // If geolocation fails, fall back to IP-based location
            fetch('https://ipapi.co/json/')
              .then(res => res.json())
              .then(data => {
                if (data && data.latitude && data.longitude) {
                  setUserLocation({ lat: data.latitude, lng: data.longitude });
                  setDistanceUnit(getDefaultDistanceUnit(data.country_code));
                }
              })
              .catch(() => {});
          }
        );
      } else {
        // If geolocation is not available, use IP-based location
        fetch('https://ipapi.co/json/')
          .then(res => res.json())
          .then(data => {
            if (data && data.latitude && data.longitude) {
              setUserLocation({ lat: data.latitude, lng: data.longitude });
              setDistanceUnit(getDefaultDistanceUnit(data.country_code));
            }
          })
          .catch(() => {});
      }
    }
  }, [userLocation]);

  useEffect(() => {
    const updateFromStorage = () => {
      setBasket(getBasket());
      setFavorites(getFavorites());
    };
    window.addEventListener('storage', updateFromStorage);
    return () => window.removeEventListener('storage', updateFromStorage);
  }, []);

  const calculateNBScore = (distance: number, price: number) => {
    const distanceScore = Math.max(0, (10 - distance) / 10 * 2.5);
    const priceScore = Math.max(0, (2000 - price) / 2000 * 2.5);
    return Math.round((distanceScore + priceScore) * 10) / 10;
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      // Fetch all products
      const { data: productsData, error: productsError } = await supabase
        .from('products')
        .select('sku, name, description, image_url, category_id, brand');
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
      // Fetch average ratings for all SKUs
      const skuList = productsData.map(p => p.sku);
      const { data: ratingsData, error: ratingsError } = await supabase
        .from('reviews')
        .select('sku, rating')
        .in('sku', skuList);
      // Calculate average rating per SKU
      const avgRatings: Record<string, number> = {};
      if (ratingsData && Array.isArray(ratingsData)) {
        skuList.forEach(sku => {
          const ratings = ratingsData.filter(r => r.sku === sku).map(r => r.rating);
          avgRatings[sku] = ratings.length > 0 ? ratings.reduce((a, b) => a + b, 0) / ratings.length : 0;
        });
      }
      // Group inventory by product
      const grouped: Product[] = [];
      for (const product of productsData) {
        const productStores = inventoryData.filter(inv => inv.sku === product.sku);
        if (productStores.length === 0) continue;
        // Calculate distances and travel times for each store
        const storesWithDistance = await Promise.all(productStores.map(async inv => {
          let distance = 0;
          let travelTime = 0;
          if (userLocation && inv.stores?.address) {
            try {
              distance = await calculateDistance(
                latLngToString(userLocation),
                inv.stores.address
              );
              // Convert meters to correct unit for display
              distance = metersToUnit(distance, distanceUnit);
              travelTime = await calculateTravelTime(
                latLngToString(userLocation),
                inv.stores.address
              );
            } catch (e) {
              distance = 9999; // fallback if error
              travelTime = 9999;
            }
          } else {
            distance = 9999; // fallback if no user location
            travelTime = 9999;
          }
          return {
            id: String(inv.sku || inv.store_id),
            seller: inv.stores?.name || '',
            price: inv.price || 0,
            distance, // in correct unit
            travelTime,
            rating: avgRatings[product.sku] || 0,
            nbScore: calculateNBScore(distance, inv.price || 0),
            address: inv.stores?.address || undefined,
          };
        }));
        grouped.push({
          id: product.sku,
          sku: product.sku,
          name: product.name,
          description: product.description || '',
          image: product.image_url || '',
          category: product.category_id || null,
          stores: storesWithDistance
        });
      }
      setProducts(grouped);
      setLoading(false);
    };
    fetchProducts();
  }, [userLocation]);

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
          // store.distance is already in the correct unit (km or mi) based on distanceUnit
          return store.distance <= travelFilter.value;
        } else {
          return store.travelTime <= travelFilter.value;
        }
      });
      const matchesSearch = searchQuery === "" || 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.stores.some(store => store.seller.toLowerCase().includes(searchQuery.toLowerCase()));
      return hasValidStore && matchesSearch;
    }
  });

  const handleAddToBasket = (sku: string, storeId: string) => {
    const product = products.find(p => p.sku === sku);
    const store = product?.stores.find(s => s.id === storeId);
    if (product && store) {
      const newItem = {
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
      <MainNavigation />
      <section className="px-4 sm:px-6 lg:px-8 pb-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative flex items-center bg-white rounded-lg shadow-md p-2 mb-4">
            <SearchIcon className="w-5 h-5 text-gray-400 ml-2" />
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
            {searchType === "store" && (
              <Button
                variant="outline"
                className="ml-2 flex items-center gap-1"
                onClick={() => setShowMap((v) => !v)}
              >
                <Map className="w-4 h-4" />
                Map
              </Button>
            )}
          </div>
          {/* Filter Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <span className="text-base font-medium text-gray-700">Nearby</span>
              <TravelFilter value={travelFilter} onChange={setTravelFilter} unit={distanceUnit} />
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
          {/* Map modal or section */}
          {showMap && (
            <div className="mb-4 w-full h-96 bg-gray-100 rounded-lg flex items-center justify-center">
              <span className="text-gray-500">[Map with stores and user location here]</span>
            </div>
          )}
          {/* Products Grid (results below search) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard 
                key={`${product.name}-${product.sku}`} 
                product={product}
                onAddToBasket={handleAddToBasket}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default Search;
