
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent } from '@/components/ui/card';
import { ArrowLeft, MapPin, Search, Filter } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { useStores } from '../hooks/useStores';
import { useProducts } from '../hooks/useProducts';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';

const MerchantPreview: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { stores, loading: storesLoading } = useStores(user?.id);
  const { products, loading: productsLoading } = useProducts(user?.id);
  
  const [selectedStoreId, setSelectedStoreId] = useState<string>('all');
  const [location, setLocation] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [travelFilter, setTravelFilter] = useState<TravelFilterValue>({
    mode: 'driving',
    type: 'time',
    value: 5
  });

  // Set default location to first store address when stores are loaded
  useEffect(() => {
    if (stores.length > 0 && !location) {
      setLocation(stores[0].address || '');
    }
  }, [stores, location]);

  const handleBackToPortal = () => {
    navigate('/merchant');
  };

  // Filter products based on selected store
  const filteredProducts = products.filter(product => {
    const matchesStore = selectedStoreId === 'all' || product.store_id === selectedStoreId;
    const matchesSearch = searchQuery === '' || 
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (product.brand && product.brand.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesStore && matchesSearch;
  });

  if (storesLoading || productsLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="container mx-auto px-4">
          <div className="flex items-center justify-between h-16">
            {/* Logo and Back Button */}
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={handleBackToPortal}
                className="flex items-center gap-2"
              >
                <ArrowLeft className="h-4 w-4" />
                Back to Portal
              </Button>
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-gradient-to-r from-blue-600 to-purple-600 rounded-xl flex items-center justify-center">
                  <span className="text-white font-bold text-sm">NB</span>
                </div>
                <div>
                  <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                    NearBuy
                  </span>
                  <span className="ml-2 text-sm text-gray-500 bg-blue-100 px-2 py-1 rounded">Preview Mode</span>
                </div>
              </div>
            </div>

            {/* Store Selector */}
            <div className="flex items-center space-x-4">
              <Select value={selectedStoreId} onValueChange={setSelectedStoreId}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Select Store" />
                </SelectTrigger>
                <SelectContent>
                  {stores.length > 1 && (
                    <SelectItem value="all">All Stores</SelectItem>
                  )}
                  {stores.map(store => (
                    <SelectItem key={store.id} value={store.id}>
                      {store.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
      </header>

      {/* Search and Filter Section */}
      <div className="bg-white border-b py-4">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 items-center">
            {/* Location Input */}
            <div className="relative flex-1 max-w-xs">
              <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Location"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="pl-10 bg-gray-50 border-gray-200 focus:bg-white"
              />
            </div>

            {/* Travel Filter */}
            <TravelFilter 
              value={travelFilter}
              onChange={setTravelFilter}
            />

            {/* Search Bar */}
            <div className="relative flex-1 max-w-md ml-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </div>

      {/* Products Grid */}
      <main className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900 mb-2">
            {selectedStoreId === 'all' ? 'All Products' : `Products from ${stores.find(s => s.id === selectedStoreId)?.name}`}
          </h2>
          <p className="text-gray-600">{filteredProducts.length} products found</p>
        </div>

        {filteredProducts.length === 0 ? (
          <Card className="p-8 text-center">
            <CardContent>
              <p className="text-gray-500 text-lg">No products found</p>
              <p className="text-gray-400 mt-2">Try adjusting your search or store selection</p>
            </CardContent>
          </Card>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredProducts.map((product) => (
              <Card key={product.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="aspect-square bg-gray-100 relative">
                  <img
                    src={product.images[0] || '/placeholder.svg'}
                    alt={product.name}
                    className="w-full h-full object-cover"
                  />
                </div>
                <CardContent className="p-4">
                  <h3 className="font-semibold text-gray-900 mb-1 line-clamp-2">{product.name}</h3>
                  {product.brand && (
                    <p className="text-sm text-gray-500 mb-2">{product.brand}</p>
                  )}
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-blue-600">
                      ${product.price.toFixed(2)}
                    </span>
                    <span className="text-sm text-gray-500">
                      {stores.find(s => s.id === product.store_id)?.name}
                    </span>
                  </div>
                  {product.inventory && product.inventory[0] && (
                    <p className="text-xs text-gray-400 mt-1">
                      {product.inventory[0].quantity} in stock
                    </p>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default MerchantPreview;
