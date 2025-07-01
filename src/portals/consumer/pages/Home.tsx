
import React, { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { MapPin, Search, Filter, Star, Heart } from "lucide-react";
import ProductCard from "@/components/ProductCard";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

interface Store {
  id: string;
  name: string;
  price: number;
  distance: number;
  rating: number;
  nbScore: number;
  address: string;
}

interface Product {
  id: string;
  name: string;
  description: string;
  image: string;
  brand: string;
  category: string;
  stores: Store[];
  minPrice: number;
}

const Home = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);

  // Calculate distance between two points (simplified)
  const calculateDistance = (lat1: number, lon1: number, lat2: number, lon2: number) => {
    const R = 3959; // Earth's radius in miles
    const dLat = (lat2 - lat1) * Math.PI / 180;
    const dLon = (lon2 - lon1) * Math.PI / 180;
    const a = 
      Math.sin(dLat/2) * Math.sin(dLat/2) +
      Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) * 
      Math.sin(dLon/2) * Math.sin(dLon/2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
    return R * c;
  };

  // Mock user location (NYC)
  const userLocation = { lat: 40.7128, lng: -74.0060 };

  const fetchProducts = async () => {
    try {
      setLoading(true);
      
      // Fetch products with inventory and store information
      const { data: inventoryData, error } = await supabase
        .from('inventory')
        .select(`
          product_id,
          price,
          quantity,
          products (
            id,
            name,
            description,
            brand,
            image_url
          ),
          stores (
            id,
            name,
            address,
            location
          )
        `)
        .gt('quantity', 0); // Only products in stock

      if (error) {
        console.error('Error fetching products:', error);
        toast.error('Failed to load products');
        return;
      }

      // Group by product and aggregate store information
      const productMap = new Map<string, Product>();

      inventoryData?.forEach((item: any) => {
        const product = item.products;
        const store = item.stores;
        
        if (!product || !store) return;

        // Calculate distance from user location
        let distance = 5; // Default distance
        if (store.location && store.location.coordinates) {
          const [lng, lat] = store.location.coordinates;
          distance = calculateDistance(userLocation.lat, userLocation.lng, lat, lng);
        }

        // Generate mock ratings and NB scores
        const rating = 3.5 + Math.random() * 1.5; // 3.5-5.0
        const nbScore = Math.floor(Math.random() * 3) + 3; // 3-5

        const storeInfo: Store = {
          id: store.id,
          name: store.name,
          price: parseFloat(item.price),
          distance: distance,
          rating: rating,
          nbScore: nbScore,
          address: store.address || 'Address not available'
        };

        if (productMap.has(product.id)) {
          const existingProduct = productMap.get(product.id)!;
          existingProduct.stores.push(storeInfo);
          existingProduct.minPrice = Math.min(existingProduct.minPrice, storeInfo.price);
        } else {
          productMap.set(product.id, {
            id: product.id,
            name: product.name,
            description: product.description || 'No description available',
            image: product.image_url || '/placeholder.svg',
            brand: product.brand || 'Unknown Brand',
            category: 'Clothing',
            stores: [storeInfo],
            minPrice: storeInfo.price
          });
        }
      });

      setProducts(Array.from(productMap.values()));
    } catch (error) {
      console.error('Error:', error);
      toast.error('Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleAddToBasket = (productId: string, storeId: string) => {
    toast.success('Added to basket!');
    console.log('Add to basket:', { productId, storeId });
  };

  // Filter products based on search query
  const filteredProducts = products.filter(product =>
    product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.brand.toLowerCase().includes(searchQuery.toLowerCase()) ||
    product.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const categories = ["All", "T-Shirts", "Jeans", "Dresses", "Jackets", "Shoes"];

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading products...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="py-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <MapPin className="w-5 h-5 text-blue-600" />
                <span className="text-sm text-gray-600">New York, NY</span>
              </div>
              <Badge variant="outline" className="text-xs">
                {filteredProducts.length} products nearby
              </Badge>
            </div>
          </div>
        </div>
      </div>

      {/* Search and Filters */}
      <div className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex flex-col space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
              <Input
                placeholder="Search for products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex space-x-2 overflow-x-auto pb-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category === "All" ? null : category)}
                  className="whitespace-nowrap"
                >
                  {category}
                </Button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {filteredProducts.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              <Search className="w-12 h-12 mx-auto" />
            </div>
            <h3 className="text-lg font-medium text-gray-900 mb-2">No products found</h3>
            <p className="text-gray-600">Try adjusting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
            {filteredProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToBasket={handleAddToBasket}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
