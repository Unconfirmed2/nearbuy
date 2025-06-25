
import React from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Search, MapPin, Clock } from 'lucide-react';

const Home: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Hero Section */}
      <div className="text-center py-12">
        <h1 className="text-4xl font-bold text-gray-900 mb-4">
          Find Products Near You
        </h1>
        <p className="text-xl text-gray-600 mb-8">
          Discover local stores and products with smart pickup routing
        </p>
        <Link to="/consumer/search">
          <Button size="lg" className="px-8">
            <Search className="h-5 w-5 mr-2" />
            Start Shopping
          </Button>
        </Link>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <MapPin className="h-8 w-8 text-blue-600 mb-2" />
            <CardTitle>Location-Based Search</CardTitle>
            <CardDescription>
              Find products available at stores near your location
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Clock className="h-8 w-8 text-green-600 mb-2" />
            <CardTitle>Optimized Pickup Routes</CardTitle>
            <CardDescription>
              Plan efficient pickup routes when shopping from multiple stores
            </CardDescription>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <Search className="h-8 w-8 text-purple-600 mb-2" />
            <CardTitle>Smart Filtering</CardTitle>
            <CardDescription>
              Filter by distance, travel time, price, and availability
            </CardDescription>
          </CardHeader>
        </Card>
      </div>

      {/* Quick Actions */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-2xl font-semibold mb-4">Quick Actions</h2>
        <div className="flex flex-wrap gap-4">
          <Link to="/consumer/search">
            <Button variant="outline">Browse Products</Button>
          </Link>
          <Link to="/consumer/favorites">
            <Button variant="outline">View Favorites</Button>
          </Link>
          <Link to="/consumer/orders">
            <Button variant="outline">Order History</Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Home;
