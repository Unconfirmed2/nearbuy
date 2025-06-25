import { useState, useEffect } from "react";
import { MapPin, Search, Filter, Star, Clock, Navigation, Menu, Heart } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import ProductCard from "@/components/ProductCard";
import LocationButton from "@/components/LocationButton";
import TravelFilter, { TravelFilterValue } from "@/components/TravelFilter";
import { Menubar, MenubarMenu, MenubarTrigger, MenubarContent, MenubarItem, MenubarSeparator } from "@/components/ui/menubar";
import { getBasket, addToBasket, getFavorites } from "@/utils/localStorage";
import { Link } from "react-router-dom";

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

  // Update basket and favorites from localStorage on mount
  useEffect(() => {
    const updateFromStorage = () => {
      setBasket(getBasket());
      setFavorites(getFavorites());
    };
    
    // Listen for storage changes (when user adds items in another tab)
    window.addEventListener('storage', updateFromStorage);
    return () => window.removeEventListener('storage', updateFromStorage);
  }, []);

  // Calculate EZ Score based on distance and price
  const calculateEZScore = (distance: number, price: number) => {
    const distanceScore = Math.max(0, (10 - distance) / 10 * 2.5);
    const priceScore = Math.max(0, (2000 - price) / 2000 * 2.5);
    return Math.round((distanceScore + priceScore) * 10) / 10;
  };

  // Mock product data with 30 diverse products
  const mockProducts = [
    // Electronics
    { id: 1, name: "iPhone 15 Pro", price: 999.99, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop", distance: 0.8, rating: 4.8, seller: "TechZone Electronics", category: "Electronics" },
    { id: 2, name: "iPhone 15 Pro", price: 1049.99, image: "https://images.unsplash.com/photo-1592750475338-74b7b21085ab?w=400&h=400&fit=crop", distance: 1.2, rating: 4.9, seller: "Digital Dreams", category: "Electronics" },
    { id: 3, name: "MacBook Air M2", price: 1199.99, image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop", distance: 1.5, rating: 4.7, seller: "TechZone Electronics", category: "Electronics" },
    { id: 4, name: "Sony WH-1000XM5", price: 349.99, image: "https://images.unsplash.com/photo-1583394838336-acd977736f90?w=400&h=400&fit=crop", distance: 2.1, rating: 4.6, seller: "AudioHub", category: "Electronics" },
    { id: 5, name: "iPad Pro 11\"", price: 799.99, image: "https://images.unsplash.com/photo-1544244015-0df4b3ffc6b0?w=400&h=400&fit=crop", distance: 0.9, rating: 4.8, seller: "Digital Dreams", category: "Electronics" },
    
    // Clothing
    { id: 6, name: "Levi's 501 Jeans", price: 89.99, image: "https://images.unsplash.com/photo-1542272604-787c3835535d?w=400&h=400&fit=crop", distance: 1.3, rating: 4.5, seller: "Urban Threads", category: "Clothing" },
    { id: 7, name: "Nike Air Force 1", price: 110.00, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", distance: 0.7, rating: 4.7, seller: "Sneaker Palace", category: "Clothing" },
    { id: 8, name: "Nike Air Force 1", price: 95.99, image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop", distance: 2.4, rating: 4.4, seller: "FootLocker Downtown", category: "Clothing" },
    { id: 9, name: "Champion Hoodie", price: 55.00, image: "https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400&h=400&fit=crop", distance: 1.8, rating: 4.3, seller: "Urban Threads", category: "Clothing" },
    { id: 10, name: "Adidas Ultraboost 22", price: 180.00, image: "https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=400&h=400&fit=crop", distance: 1.1, rating: 4.6, seller: "Sneaker Palace", category: "Clothing" },
    
    // Home & Furniture
    { id: 11, name: "IKEA Billy Bookshelf", price: 49.99, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", distance: 3.2, rating: 4.2, seller: "Furniture Express", category: "Furniture" },
    { id: 12, name: "Dyson V15 Vacuum", price: 749.99, image: "https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=400&h=400&fit=crop", distance: 1.4, rating: 4.8, seller: "Home Essentials", category: "Home" },
    { id: 13, name: "KitchenAid Stand Mixer", price: 449.99, image: "https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop", distance: 2.0, rating: 4.9, seller: "Kitchen World", category: "Home" },
    { id: 14, name: "Sectional Sofa", price: 1299.99, image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop", distance: 2.8, rating: 4.5, seller: "Furniture Express", category: "Furniture" },
    { id: 15, name: "Coffee Table", price: 199.99, image: "https://images.unsplash.com/photo-1506439773649-6e0eb8cfb237?w=400&h=400&fit=crop", distance: 1.9, rating: 4.4, seller: "Modern Living", category: "Furniture" },
    
    // Sports & Outdoors
    { id: 16, name: "Yeti Rambler 30oz", price: 39.99, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop", distance: 1.6, rating: 4.7, seller: "Outdoor Gear Co", category: "Sports" },
    { id: 17, name: "Wilson Tennis Racket", price: 129.99, image: "https://images.unsplash.com/photo-1551698618-1dfe5d97d256?w=400&h=400&fit=crop", distance: 2.3, rating: 4.5, seller: "Sports Authority", category: "Sports" },
    { id: 18, name: "Patagonia Fleece Jacket", price: 179.99, image: "https://images.unsplash.com/photo-1544966503-7cc5ac882d5f?w=400&h=400&fit=crop", distance: 0.6, rating: 4.8, seller: "Outdoor Gear Co", category: "Sports" },
    { id: 19, name: "Hydro Flask 32oz", price: 44.95, image: "https://images.unsplash.com/photo-1602143407151-7111542de6e8?w=400&h=400&fit=crop", distance: 3.1, rating: 4.6, seller: "Sports Authority", category: "Sports" },
    { id: 20, name: "Yoga Mat Premium", price: 79.99, image: "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?w=400&h=400&fit=crop", distance: 1.7, rating: 4.4, seller: "Zen Fitness", category: "Sports" },
    
    // Books & Media
    { id: 21, name: "The Psychology of Money", price: 16.99, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop", distance: 0.9, rating: 4.6, seller: "Barnes & Noble", category: "Books" },
    { id: 22, name: "Atomic Habits", price: 18.99, image: "https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=400&h=400&fit=crop", distance: 1.4, rating: 4.8, seller: "Book Haven", category: "Books" },
    { id: 23, name: "Vinyl Record Player", price: 249.99, image: "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?w=400&h=400&fit=crop", distance: 2.2, rating: 4.5, seller: "AudioHub", category: "Electronics" },
    
    // Food & Beverages
    { id: 24, name: "Organic Coffee Beans", price: 24.99, image: "https://images.unsplash.com/photo-1447933601403-0c6688de566e?w=400&h=400&fit=crop", distance: 0.8, rating: 4.7, seller: "Local Roastery", category: "Food" },
    { id: 25, name: "Artisan Chocolate Box", price: 32.99, image: "https://images.unsplash.com/photo-1511381939415-e44015466834?w=400&h=400&fit=crop", distance: 1.3, rating: 4.9, seller: "Sweet Treats", category: "Food" },
    { id: 26, name: "Green Tea Set", price: 45.00, image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?w=400&h=400&fit=crop", distance: 2.1, rating: 4.4, seller: "Tea Corner", category: "Food" },
    
    // Beauty & Personal Care
    { id: 27, name: "Skincare Routine Kit", price: 89.99, image: "https://images.unsplash.com/photo-1556228578-8c89e6adf883?w=400&h=400&fit=crop", distance: 1.2, rating: 4.6, seller: "Beauty Boutique", category: "Beauty" },
    { id: 28, name: "Electric Toothbrush", price: 129.99, image: "https://images.unsplash.com/photo-1607613009820-a29f7bb81c04?w=400&h=400&fit=crop", distance: 0.5, rating: 4.7, seller: "Health Plus", category: "Health" },
    { id: 29, name: "Massage Gun", price: 199.99, image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?w=400&h=400&fit=crop", distance: 1.8, rating: 4.5, seller: "Zen Fitness", category: "Health" },
    { id: 30, name: "Essential Oil Diffuser", price: 49.99, image: "https://images.unsplash.com/photo-1573408301185-9146fe634ad0?w=400&h=400&fit=crop", distance: 2.5, rating: 4.3, seller: "Wellness Store", category: "Health" }
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
    if (searchType === "store") {
      const storeMatch = product.stores.some(store =>
        store.seller.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (searchQuery.toLowerCase().includes("store") && product.category.toLowerCase().includes(searchQuery.replace(/store(s)?/gi, "").trim()))
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
        product.category.toLowerCase().includes(searchQuery.toLowerCase()) ||
        product.stores.some(store => store.seller.toLowerCase().includes(searchQuery.toLowerCase()));
      return hasValidStore && matchesSearch;
    }
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
      addToBasket(newItem);
      setBasket(getBasket()); // Update state
      console.log("Added to basket:", newItem);
    }
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
          <div className="flex items-center justify-between h-20">
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
            <div className="flex items-center space-x-6">
              <div className="flex items-center space-x-2">
                <span className="text-base font-medium text-gray-700">Nearby</span>
                <TravelFilter value={travelFilter} onChange={setTravelFilter} />
                <LocationButton userLocation={userLocation} />
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
              {/* Menu Icon */}
              <Menubar>
                <MenubarMenu>
                  <MenubarTrigger className="p-2 hover:bg-gray-100 rounded-full">
                    <Menu className="w-6 h-6" />
                  </MenubarTrigger>
                  <MenubarContent align="end">
                    <MenubarItem>
                      <Link to="/" className="w-full">Home</Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Link to="/auth/signin" className="w-full">Sign In</Link>
                    </MenubarItem>
                    <MenubarItem>
                      <Link to="/auth/signup" className="w-full">Sign Up</Link>
                    </MenubarItem>
                    <MenubarSeparator />
                    <MenubarItem>
                      <Link to="/dashboard" className="w-full">Dashboard</Link>
                    </MenubarItem>
                  </MenubarContent>
                </MenubarMenu>
              </Menubar>
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
    </div>
  );
};

export default Index;
