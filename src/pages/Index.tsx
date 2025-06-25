
import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, MapPin, Filter, ShoppingCart, Heart, User, ChevronDown } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { getBasket, getFavorites } from '@/utils/localStorage';

const Index: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [location, setLocation] = useState('');

  const basket = getBasket();
  const favorites = getFavorites();
  const basketCount = basket.reduce((sum, item) => sum + (item.quantity || 1), 0);

  const categories = [
    'All Categories',
    'Electronics',
    'Clothing',
    'Food & Beverages',
    'Home & Garden',
    'Health & Beauty',
    'Sports & Outdoors'
  ];

  const featuredProducts = [
    {
      id: 1,
      name: 'Wireless Headphones',
      price: 89.99,
      image: '/placeholder.svg',
      store: 'Tech Store',
      distance: '0.5 miles',
      rating: 4.5
    },
    {
      id: 2,
      name: 'Fresh Organic Apples',
      price: 4.99,
      image: '/placeholder.svg',
      store: 'Green Grocery',
      distance: '0.8 miles',
      rating: 4.8
    },
    {
      id: 3,
      name: 'Running Shoes',
      price: 129.99,
      image: '/placeholder.svg',
      store: 'Sports Central',
      distance: '1.2 miles',
      rating: 4.6
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Navigation Header */}
      <nav className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            <Link to="/" className="text-xl font-bold text-blue-600">
              NearBuy
            </Link>
            
            <div className="hidden md:flex items-center space-x-6">
              <Link to="/" className="text-gray-700 hover:text-blue-600">Home</Link>
              <Link to="/products" className="text-gray-700 hover:text-blue-600">Products</Link>
              <Link to="/stores" className="text-gray-700 hover:text-blue-600">Stores</Link>
              <Link to="/help" className="text-gray-700 hover:text-blue-600">Help Center</Link>
            </div>

            <div className="flex items-center space-x-4">
              {/* Favorites */}
              <Button variant="ghost" size="sm" className="relative">
                <Heart className="h-4 w-4" />
                {favorites.length > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {favorites.length}
                  </Badge>
                )}
              </Button>

              {/* Cart */}
              <Button variant="ghost" size="sm" className="relative">
                <ShoppingCart className="h-4 w-4" />
                {basketCount > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 text-xs">
                    {basketCount}
                  </Badge>
                )}
              </Button>

              {/* Sign In */}
              <Link to="/auth/signin">
                <Button variant="outline" size="sm">
                  Sign In
                </Button>
              </Link>

              {/* Sign Up Dropdown */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700">
                    Sign Up
                    <ChevronDown className="h-4 w-4 ml-1" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="bg-white border shadow-lg">
                  <DropdownMenuItem asChild>
                    <Link to="/auth/signup?role=customer" className="w-full">
                      As Consumer
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/auth/signup?role=store_owner" className="w-full">
                      As Merchant
                    </Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white py-16">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold mb-4">
            Find Products Near You
          </h1>
          <p className="text-xl mb-8 opacity-90">
            Discover local stores and products in your neighborhood
          </p>
          
          {/* Search Bar */}
          <div className="max-w-4xl mx-auto bg-white rounded-lg p-4 shadow-lg">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search for products..."
                    value={searchQuery}
                    onChange={(e) => setSearchQuery(e.target.value)}
                    className="pl-10 text-gray-900"
                  />
                </div>
              </div>
              
              <div className="flex-1">
                <div className="relative">
                  <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Enter your location..."
                    value={location}
                    onChange={(e) => setLocation(e.target.value)}
                    className="pl-10 text-gray-900"
                  />
                </div>
              </div>
              
              <Button className="bg-blue-600 hover:bg-blue-700 px-8">
                Search
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Categories */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Browse Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-4">
          {categories.map((category) => (
            <Button
              key={category}
              variant={selectedCategory === category.toLowerCase().replace(' ', '') ? "default" : "outline"}
              className="h-auto p-4 flex flex-col items-center"
              onClick={() => setSelectedCategory(category.toLowerCase().replace(' ', ''))}
            >
              <span className="text-sm text-center">{category}</span>
            </Button>
          ))}
        </div>
      </div>

      {/* Featured Products */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-2xl font-bold mb-6">Featured Products</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {featuredProducts.map((product) => (
            <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
              <div className="aspect-square bg-gray-200 relative">
                <img
                  src={product.image}
                  alt={product.name}
                  className="w-full h-full object-cover"
                />
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                >
                  <Heart className="h-4 w-4" />
                </Button>
              </div>
              
              <CardContent className="p-4">
                <h3 className="font-semibold text-lg mb-2">{product.name}</h3>
                <p className="text-2xl font-bold text-blue-600 mb-2">${product.price}</p>
                <div className="flex justify-between items-center text-sm text-gray-600 mb-3">
                  <span>{product.store}</span>
                  <span>{product.distance}</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-yellow-600">★ {product.rating}</span>
                  <Button size="sm">
                    Add to Cart
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Call to Action */}
      <div className="bg-gray-100 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl font-bold mb-4">Ready to Start Shopping?</h2>
          <p className="text-xl text-gray-600 mb-8">
            Join thousands of customers finding great products nearby
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link to="/auth/signup?role=customer">
              <Button size="lg" className="bg-blue-600 hover:bg-blue-700">
                Shop as Customer
              </Button>
            </Link>
            <Link to="/auth/signup?role=store_owner">
              <Button size="lg" variant="outline">
                Sell as Merchant
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Index;
