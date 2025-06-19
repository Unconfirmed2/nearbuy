import { useState, useEffect } from "react";
import { MapPin, Search, Filter, Star, Clock, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import LocationButton from "@/components/LocationButton";
import FilterDialog from "@/components/FilterDialog";

const Index = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [userLocation, setUserLocation] = useState<{lat: number, lng: number} | null>(null);
  const [maxDistance, setMaxDistance] = useState(10);
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  const [sortBy, setSortBy] = useState("distance");
  const [basket, setBasket] = useState<{productId: number, storeId: number, productName: string, storeName: string, price: number}[]>([]);
  const [averageDistance, setAverageDistance] = useState(1.5);
  const [travelTime, setTravelTime] = useState(30);

  // Distance/travel time state

  // Calculate EZ Score based on distance and price
  const calculateEZScore = (distance: number, price: number) => {
    // Normalize distance (closer = higher score, max distance 10 miles)
    const distanceScore = Math.max(0, (10 - distance) / 10 * 2.5);
    
    // Normalize price (cheaper = higher score, assume max price $2000)
    const priceScore = Math.max(0, (2000 - price) / 2000 * 2.5);
    
    // Combine scores and round to 1 decimal
    return Math.round((distanceScore + priceScore) * 10) / 10;
  };

  // Mock product data with multiple stores selling same products
  const mockProducts = [
    // Money Tree - sold by multiple stores
    {
      id: 1,
      name: "Money Tree",
      price: 19.99,
      image: "https://images.unsplash.com/photo-1509423350716-97f2360af0e4?w=400&h=400&fit=crop",
      distance: 1.4,
      rating: 4.5,
      seller: "Jim's Garden Center",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 11,
      name: "Money Tree",
      price: 24.99,
      image: "https://images.unsplash.com/photo-1509423350716-97f2360af0e4?w=400&h=400&fit=crop",
      distance: 0.6,
      rating: 4.7,
      seller: "Green Thumb Nursery",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 12,
      name: "Money Tree",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1509423350716-97f2360af0e4?w=400&h=400&fit=crop",
      distance: 3.2,
      rating: 4.3,
      seller: "Budget Plants Co",
      category: "House Plants",
      ezScore: 0
    },
    // Snake Plant - sold by multiple stores
    {
      id: 2,
      name: "Snake Plant",
      price: 15.99,
      image: "https://images.unsplash.com/photo-1493648668077-43febf035d3e?w=400&h=400&fit=crop",
      distance: 0.8,
      rating: 4.6,
      seller: "Tony's Plant Shop",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 13,
      name: "Snake Plant",
      price: 22.50,
      image: "https://images.unsplash.com/photo-1493648668077-43febf035d3e?w=400&h=400&fit=crop",
      distance: 0.3,
      rating: 4.8,
      seller: "Urban Jungle",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 14,
      name: "Snake Plant",
      price: 12.99,
      image: "https://images.unsplash.com/photo-1493648668077-43febf035d3e?w=400&h=400&fit=crop",
      distance: 2.8,
      rating: 4.4,
      seller: "Plant Paradise",
      category: "House Plants",
      ezScore: 0
    },
    // Fiddle Leaf Fig - sold by multiple stores
    {
      id: 3,
      name: "Fiddle Leaf Fig",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      distance: 2.3,
      rating: 4.8,
      seller: "Green Thumb Nursery",
      category: "House Plants",  
      ezScore: 0
    },
    {
      id: 15,
      name: "Fiddle Leaf Fig",
      price: 75.00,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      distance: 4.1,
      rating: 4.6,
      seller: "Bloom & Grow",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 16,
      name: "Fiddle Leaf Fig",
      price: 95.00,
      image: "https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=400&fit=crop",
      distance: 1.1,
      rating: 4.9,
      seller: "Premium Plants",
      category: "House Plants",
      ezScore: 0
    },
    // Rubber Plant - sold by multiple stores
    {
      id: 4,
      name: "Rubber Plant",
      price: 45.00,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
      distance: 1.9,
      rating: 4.4,
      seller: "Plant Paradise",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 17,
      name: "Rubber Plant",
      price: 38.99,
      image: "https://images.unsplash.com/photo-1416879595882-3373a0480b5b?w=400&h=400&fit=crop",
      distance: 3.5,
      rating: 4.2,
      seller: "Budget Plants Co",
      category: "House Plants",
      ezScore: 0
    },
    // Peace Lily - sold by multiple stores
    {
      id: 5,
      name: "Peace Lily",
      price: 25.99,
      image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop",
      distance: 3.1,
      rating: 4.7,
      seller: "Bloom & Grow",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 18,
      name: "Peace Lily",
      price: 19.50,
      image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop",
      distance: 1.7,
      rating: 4.5,
      seller: "Tony's Plant Shop",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 19,
      name: "Peace Lily",
      price: 32.00,
      image: "https://images.unsplash.com/photo-1463320726281-696a485928c7?w=400&h=400&fit=crop",
      distance: 0.9,
      rating: 4.8,
      seller: "Premium Plants",
      category: "House Plants",
      ezScore: 0
    },
    // Monstera Deliciosa - sold by multiple stores
    {
      id: 6,
      name: "Monstera Deliciosa",
      price: 65.00,
      image: "https://images.unsplash.com/photo-1545239705-1564e58b75ea?w=400&h=400&fit=crop",
      distance: 1.2,
      rating: 4.9,
      seller: "Urban Jungle",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 20,
      name: "Monstera Deliciosa",
      price: 58.99,
      image: "https://images.unsplash.com/photo-1545239705-1564e58b75ea?w=400&h=400&fit=crop",
      distance: 2.4,
      rating: 4.6,
      seller: "Jim's Garden Center",
      category: "House Plants",
      ezScore: 0
    },
    {
      id: 21,
      name: "Monstera Deliciosa",
      price: 72.50,
      image: "https://images.unsplash.com/photo-1545239705-1564e58b75ea?w=400&h=400&fit=crop",
      distance: 0.7,
      rating: 5.0,
      seller: "Premium Plants",
      category: "House Plants",
      ezScore: 0
    }
  ].map(product => ({
    ...product,
    ezScore: calculateEZScore(product.distance, product.price)
  }));

  // Group products by name and structure them for the new card format
  const groupedProducts = mockProducts.reduce((acc, product) => {
    const existingProduct = acc.find(p => p.name === product.name);
    
    const store = {
      id: product.id,
      seller: product.seller,
      price: product.price,
      distance: product.distance,
      rating: product.rating,
      ezScore: product.ezScore
    };

    if (existingProduct) {
      existingProduct.stores.push(store);
    } else {
      acc.push({
        id: product.id,
        name: product.name,
        image: product.image,
        category: product.category,
        stores: [store]
      });
    }
    
    return acc;
  }, [] as Array<{
    id: number;
    name: string;
    image: string;
    category: string;
    stores: Array<{
      id: number;
      seller: string;
      price: number;
      distance: number;
      rating: number;
      ezScore: number;
    }>;
  }>);

  // Sort stores within each product
  groupedProducts.forEach(product => {
    product.stores.sort((a, b) => {
      switch (sortBy) {
        case "distance":
          return a.distance - b.distance;
        case "price":
          return a.price - b.price;
        case "ezScore":
          return b.ezScore - a.ezScore;
        default:
          return 0;
      }
    });
  });

  const filteredProducts = groupedProducts.filter(product => {
    // Check if any store is within distance and matches search
    const hasValidStore = product.stores.some(store => store.distance <= maxDistance);
    const matchesSearch = searchQuery === "" || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.stores.some(store => store.seller.toLowerCase().includes(searchQuery.toLowerCase()));
    
    return hasValidStore && matchesSearch;
  });

  const handleAddToBasket = (productId: number, storeId: number) => {
    const product = mockProducts.find(p => p.id === storeId);
    if (product) {
      const newItem = {
        productId,
        storeId,
        productName: product.name,
        storeName: product.seller,
        price: product.price
      };
      setBasket(prev => [...prev, newItem]);
      console.log("Added to basket:", newItem);
    }
  };

  // Calculate average distance and travel time from products
  useEffect(() => {
    if (filteredProducts.length > 0) {
      const allDistances = filteredProducts.flatMap(product => 
        product.stores.map(store => store.distance)
      );
      const avgDist = allDistances.reduce((sum, dist) => sum + dist, 0) / allDistances.length;
      setAverageDistance(avgDist);
      setTravelTime(Math.round(avgDist * 16)); // Assuming 16 minutes per mile walking
    }
  }, [filteredProducts]);

  useEffect(() => {
    // Request user location on component mount
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setUserLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          console.log("Location access denied", error);
        }
      );
    }
  }, []);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur-md border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-sm">NB</span>
              </div>
              <div>
                <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  NearBuy
                </h1>
              </div>
            </div>
            <div className="flex items-center space-x-3">
              {basket.length > 0 && (
                <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                  Basket: {basket.length}
                </Badge>
              )}
              <LocationButton userLocation={userLocation} />
            </div>
          </div>
        </div>
      </header>

      {/* Search Section */}
      <section className="px-4 sm:px-6 lg:px-8 py-6">
        <div className="max-w-4xl mx-auto">
          {/* Search Bar */}
          <div className="relative flex items-center bg-white rounded-lg shadow-md p-2 mb-4">
            <Search className="w-5 h-5 text-gray-400 ml-2" />
            <Input
              placeholder="House Plants near Me"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0"
            />
          </div>

          {/* Distance/Travel Time Display */}
          <div className="flex items-center justify-center space-x-6 mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <MapPin className="w-4 h-4" />
              <span>Average: {averageDistance.toFixed(1)} miles</span>
            </div>
            <div className="flex items-center space-x-2">
              <Clock className="w-4 h-4" />
              <span>Walking: {travelTime} minutes</span>
            </div>
          </div>

          {/* Sort and Filter Controls */}
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Sort by:</span>
                <select 
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="text-sm border border-gray-300 rounded px-2 py-1"
                >
                  <option value="distance">Distance</option>
                  <option value="price">Price</option>
                  <option value="ezScore">EZ Score</option>
                </select>
              </div>
              
              <Button
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
                size="sm"
                className="text-sm"
              >
                <Filter className="w-4 h-4 mr-1" />
                Filter: Max {maxDistance}mi
              </Button>
            </div>
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
                product={product} 
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

      {/* Filter Dialog */}
      <FilterDialog
        isOpen={isFilterOpen}
        onClose={() => setIsFilterOpen(false)}
        maxDistance={maxDistance}
        onDistanceChange={setMaxDistance}
      />
    </div>
  );
};

export default Index;
