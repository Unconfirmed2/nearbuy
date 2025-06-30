
import React, { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Input } from '@/components/ui/input';
import { MapPin, Clock, Star, Heart, ShoppingCart, Search, Navigation, Filter } from 'lucide-react';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const OriginalLandingPageReference: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [searchType, setSearchType] = useState('products');
  const [sortBy, setSortBy] = useState('relevance');

  const sampleProducts = [
    {
      id: 1,
      name: 'iPhone 15 Pro',
      price: 999.99,
      originalPrice: 1099.99,
      image: '/placeholder.svg',
      store: 'Best Buy',
      distance: '0.5 mi',
      rating: 4.8,
      nbScore: 9.2,
      category: 'Electronics'
    },
    {
      id: 2,
      name: 'iPad Pro 11"',
      price: 799.99,
      image: '/placeholder.svg',
      store: 'Apple Store',
      distance: '0.8 mi',
      rating: 4.9,
      nbScore: 8.9,
      category: 'Electronics'
    },
    {
      id: 3,
      name: 'Nike Air Force 1',
      price: 89.99,
      image: '/placeholder.svg',
      store: 'Foot Locker',
      distance: '1.2 mi',
      rating: 4.6,
      nbScore: 8.7,
      category: 'Shoes'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header with Location and Filters */}
      <div className="bg-white border-b shadow-sm">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-4">
              <Button variant="outline" size="sm">
                <MapPin className="w-4 h-4 mr-2" />
                Nearby
              </Button>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Distance:</span>
                <Select defaultValue="5">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 mi</SelectItem>
                    <SelectItem value="5">5 mi</SelectItem>
                    <SelectItem value="10">10 mi</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-600">Time:</span>
                <Select defaultValue="15">
                  <SelectTrigger className="w-20">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="5">5 min</SelectItem>
                    <SelectItem value="15">15 min</SelectItem>
                    <SelectItem value="30">30 min</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <Button variant="outline" size="sm">
                <Navigation className="w-4 h-4 mr-2" />
                Walk
              </Button>
            </div>
            <Button variant="outline" size="sm">
              <Filter className="w-4 h-4 mr-2" />
              Filters
            </Button>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        {/* Hero Section */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Discover products at nearby stores with our NB score that combines price and proximity for the best deals
          </h1>
        </div>

        {/* Search Section */}
        <div className="max-w-2xl mx-auto space-y-4 mb-8">
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
          
          <div className="relative flex items-center bg-white rounded-lg shadow-md border p-2">
            <Search className="w-5 h-5 text-gray-400 ml-2" />
            <Input
              placeholder={
                searchType === 'products' 
                  ? "Search for products..." 
                  : "Search stores by name or description..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1 border-none bg-transparent placeholder:text-gray-400 focus-visible:ring-0"
            />
            <Button className="ml-2">
              Search
            </Button>
          </div>
        </div>

        {/* Sort Section */}
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">Products Near You</h2>
          <div className="flex items-center space-x-2">
            <span className="text-sm text-gray-600">Sort by:</span>
            <Select value={sortBy} onValueChange={setSortBy}>
              <SelectTrigger className="w-40">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="relevance">Relevance</SelectItem>
                <SelectItem value="price-low">Price: Low to High</SelectItem>
                <SelectItem value="price-high">Price: High to Low</SelectItem>
                <SelectItem value="distance">Distance</SelectItem>
                <SelectItem value="rating">Rating</SelectItem>
                <SelectItem value="nb-score">NB Score</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {sampleProducts.map((product) => (
            <Card key={product.id} className="group overflow-hidden hover:shadow-lg transition-shadow">
              <div className="relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-48 object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm hover:bg-white p-2 h-8 w-8"
                >
                  <Heart className="w-4 h-4" />
                </Button>
                <Badge className="absolute top-2 left-2 bg-blue-600">
                  {product.category}
                </Badge>
                {product.originalPrice && (
                  <Badge className="absolute top-2 left-20 bg-red-600">
                    Sale
                  </Badge>
                )}
              </div>
              
              <CardContent className="p-4">
                <div className="space-y-3">
                  <div>
                    <h3 className="font-medium text-gray-900 line-clamp-2">
                      {product.name}
                    </h3>
                    <p className="text-sm text-gray-500">{product.store}</p>
                  </div>
                  
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center text-gray-500">
                      <MapPin className="w-3 h-3 mr-1" />
                      {product.distance}
                    </div>
                    <div className="flex items-center text-yellow-600">
                      <Star className="w-3 h-3 mr-1 fill-current" />
                      {product.rating}
                    </div>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-2">
                      <span className="text-lg font-bold text-green-600">
                        ${product.price}
                      </span>
                      {product.originalPrice && (
                        <span className="text-sm text-gray-500 line-through">
                          ${product.originalPrice}
                        </span>
                      )}
                    </div>
                    <Badge variant="outline" className="text-blue-600 border-blue-600">
                      NB {product.nbScore}
                    </Badge>
                  </div>
                  
                  <Button size="sm" className="w-full">
                    <ShoppingCart className="w-4 h-4 mr-1" />
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OriginalLandingPageReference;
