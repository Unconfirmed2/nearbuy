
import React, { useState, useEffect } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';
import { Search, MapPin } from 'lucide-react';
import { useSearchParams } from 'react-router-dom';
import { ToggleGroup, ToggleGroupItem } from '@/components/ui/toggle-group';

const ProductSearch: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || '');
  const [searchType, setSearchType] = useState(searchParams.get('type') || 'products');
  const [travelFilter, setTravelFilter] = useState<TravelFilterValue>({
    mode: 'driving',
    type: 'distance',
    value: 5
  });

  useEffect(() => {
    setSearchQuery(searchParams.get('q') || '');
    setSearchType(searchParams.get('type') || 'products');
  }, [searchParams]);

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'type:', searchType, 'with filter:', travelFilter);
    // TODO: Implement search functionality
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Search Results</h1>
        
        <div className="space-y-4">
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

          <div className="flex gap-4">
            <Input
              placeholder={
                searchType === 'products' 
                  ? "Search for products..." 
                  : "Search stores by name or description..."
              }
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="flex-1"
            />
            <Button onClick={handleSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
          
          <div className="flex items-center gap-4">
            <span className="text-sm font-medium">Filters:</span>
            <TravelFilter 
              value={travelFilter}
              onChange={setTravelFilter}
            />
          </div>
        </div>
      </div>

      {/* Search Results */}
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h2 className="text-xl font-semibold mb-4">
          {searchType === 'products' ? 'Products' : 'Stores'} Found
        </h2>
        {searchQuery ? (
          <p className="text-gray-600">
            Showing results for "{searchQuery}" ({searchType})
          </p>
        ) : (
          <p className="text-gray-600">
            Enter a search query to find {searchType === 'products' ? 'products' : 'stores'} near you.
          </p>
        )}
      </div>
    </div>
  );
};

export default ProductSearch;
