import { useState, useEffect } from "react";
import { calculateDistance, calculateTravelTime } from "@/lib/distance";
import { latLngToString } from "@/lib/latLngToString";
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
import { getDefaultDistanceUnit, metersToUnit } from "@/lib/units";

// Define types for clarity and type safety
interface Store {
  id: string; // string to match Supabase
  seller: string;
  price: number;
  distance: number;
  travelTime: number;
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

// Configuration for NB/EZ Score
const PRICE_WEIGHT = 0.6;
const DISTANCE_WEIGHT = 0.4;
const EPSILON = 0.001;

// Calculate NB/EZ Scores for each store offering a product
function calculateEZScores(offers: { storeId: string; price: number; distanceKm: number }[], maxReasonableDistanceKm: number) {
  if (offers.length === 1) {
    const offer = offers[0];
    const normalizedDistanceScore = 1 - offer.distanceKm / maxReasonableDistanceKm;
    const nbScore = Math.round(10 * (PRICE_WEIGHT + DISTANCE_WEIGHT * normalizedDistanceScore));
    return [{ ...offer, nbScore }];
  }
  const prices = offers.map(o => o.price);
  const distances = offers.map(o => o.distanceKm);
  const minPrice = Math.min(...prices);
  const maxPrice = Math.max(...prices);
  const minDistance = Math.min(...distances);
  const maxDistance = Math.max(...distances);
  return offers.map(offer => {
    const normalizedPrice = 1 - (offer.price - minPrice) / (maxPrice - minPrice + EPSILON);
    const normalizedDistance = 1 - (offer.distanceKm - minDistance) / (maxDistance - minDistance + EPSILON);
    const nbScore = Math.round(
      10 * (PRICE_WEIGHT * normalizedPrice + DISTANCE_WEIGHT * normalizedDistance)
    );
    return { ...offer, nbScore };
  });
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

  // Fetch products and inventory from Supabase
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
              // Convert meters to correct unit for EZ Score
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
            address: inv.stores?.address || undefined,
            storeId: String(inv.store_id),
            distanceKm: distanceUnit === 'km' ? distance : distance * 1.60934 // always provide km for scoring
          };
        }));
        // Calculate NB/EZ Score for all store offers for this product
        const maxReasonableDistance = userLocation ? Math.max(2, travelFilter.value || 20) : 20;
        const offers = storesWithDistance.map(s => ({ storeId: s.storeId, price: s.price, distanceKm: s.distanceKm }));
        const scoredOffers = calculateEZScores(offers, maxReasonableDistance);
        // Merge scores back into storesWithDistance
        const storesWithScore = storesWithDistance.map(store => {
          const scoreObj = scoredOffers.find(o => o.storeId === store.storeId);
          return { ...store, nbScore: scoreObj ? scoreObj.nbScore : 0 };
        });
        grouped.push({
          id: product.sku,
          sku: product.sku,
          name: product.name,
          description: product.description || '',
          image: product.image_url || '',
          category: product.category_id || null,
          stores: storesWithScore
        });
      }
      setProducts(grouped);
      setLoading(false);
    };
    fetchProducts();
    // Re-run when userLocation or distanceUnit changes
  }, [userLocation, distanceUnit]);

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
          // store.distance is already in the correct unit (km or mi) based on distanceUnit
          return store.distance <= travelFilter.value;
        } else {
          // Use real travel time if available
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

  // Patch: convert all IDs to numbers for ProductCard/StoreSelectionModal compatibility
  // (No longer needed, using sku everywhere)

  // Use sku as the main identifier for products
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
                key={`${product.name}-${product.sku}`} 
                product={product}
                onAddToBasket={handleAddToBasket}
                unit={distanceUnit}
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
