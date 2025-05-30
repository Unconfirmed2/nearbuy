
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

  // Mock product data - in a real app this would come from an API
  const mockProducts = [
    {
      id: 1,
      name: "Vintage Leather Jacket",
      price: 89.99,
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      distance: 0.8,
      rating: 4.8,
      seller: "Sarah's Vintage",
      category: "Clothing"
    },
    {
      id: 2,
      name: "MacBook Pro 2019",
      price: 1299.99,
      image: "https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400&h=400&fit=crop",
      distance: 2.3,
      rating: 4.9,
      seller: "Tech Hub",
      category: "Electronics"
    },
    {
      id: 3,
      name: "Mountain Bike",
      price: 450.00,
      image: "https://images.unsplash.com/photo-1558618047-3c8c76ca7d13?w=400&h=400&fit=crop",
      distance: 1.5,
      rating: 4.6,
      seller: "Mike's Bikes",
      category: "Sports"
    },
    {
      id: 4,
      name: "Coffee Table",
      price: 120.00,
      image: "https://images.unsplash.com/photo-1586023492125-27b2c045efd7?w=400&h=400&fit=crop",
      distance: 3.2,
      rating: 4.7,
      seller: "Home Decor Plus",
      category: "Furniture"
    },
    {
      id: 5,
      name: "Canon DSLR Camera",
      price: 650.00,
      image: "https://images.unsplash.com/photo-1606983340126-99ab4feaa64a?w=400&h=400&fit=crop",
      distance: 4.1,
      rating: 4.8,
      seller: "Photo World",
      category: "Electronics"
    },
    {
      id: 6,
      name: "Designer Handbag",
      price: 85.00,
      image: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=400&h=400&fit=crop",
      distance: 1.9,
      rating: 4.5,
      seller: "Fashion Forward",
      category: "Accessories"
    }
  ];

  const filteredProducts = mockProducts.filter(product => 
    product.distance <= maxDistance &&
    (searchQuery === "" || product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
     product.category.toLowerCase().includes(searchQuery.toLowerCase()))
  );

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
                <MapPin className="w-6 h-6 text-white" />
              </div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                NearBuy
              </h1>
            </div>
            <LocationButton userLocation={userLocation} />
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-5xl font-bold text-gray-900 mb-6">
            Find Products
            <span className="block text-4xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
              Near You
            </span>
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
            Discover amazing products within your travel distance. Buy local, save time, and connect with your community.
          </p>

          {/* Search Bar */}
          <div className="max-w-2xl mx-auto">
            <div className="relative flex items-center bg-white rounded-2xl shadow-lg p-2">
              <Search className="w-5 h-5 text-gray-400 ml-4" />
              <Input
                placeholder="Search for products, categories, or brands..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="flex-1 border-none bg-transparent text-lg placeholder:text-gray-400 focus-visible:ring-0"
              />
              <Button
                onClick={() => setIsFilterOpen(true)}
                variant="outline"
                size="sm"
                className="mr-2"
              >
                <Filter className="w-4 h-4 mr-2" />
                Filter
              </Button>
              <Button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                Search
              </Button>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="flex items-center justify-center space-x-8 mt-8 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-500 rounded-full"></div>
              <span>{filteredProducts.length} products found</span>
            </div>
            <div className="flex items-center space-x-2">
              <Navigation className="w-4 h-4" />
              <span>Within {maxDistance} miles</span>
            </div>
          </div>
        </div>
      </section>

      {/* Products Grid */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="flex items-center justify-between mb-8">
          <h3 className="text-2xl font-semibold text-gray-900">
            Available Products
          </h3>
          <div className="flex items-center space-x-4">
            <Badge variant="secondary" className="bg-blue-100 text-blue-800">
              <Clock className="w-3 h-3 mr-1" />
              Updated 2 min ago
            </Badge>
          </div>
        </div>

        {filteredProducts.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
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
