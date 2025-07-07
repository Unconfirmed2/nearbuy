import { useState, useEffect } from "react";
import { MapPin, Search, Filter, Star, Clock, Navigation, Menu, Heart, Map } from "lucide-react";
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

// ...Store/Product interfaces (copy from Index.tsx)...

const Stores = () => {
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
  const [searchType, setSearchType] = useState<'product' | 'store'>("store");
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [showMap, setShowMap] = useState(false);

  // ...fetch logic, NB Score, etc. (copy from Index.tsx)...

  // ...filteredProducts logic (copy from Index.tsx)...

  // ...handleAddToBasket, handleLocationChange, etc. (copy from Index.tsx)...

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <MainNavigation />
      {/* No banner/hero section */}
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
            {/* Map button only for store search */}
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
              <TravelFilter value={travelFilter} onChange={setTravelFilter} />
              <LocationButton userLocation={userLocation} onLocationChange={setUserLocation} />
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
              {/* TODO: Render map with store markers and user location */}
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

export default Stores;
