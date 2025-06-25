
import React, { useState } from 'react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import TravelFilter, { TravelFilterValue } from '@/components/TravelFilter';
import { Search } from 'lucide-react';

const ProductSearch: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [travelFilter, setTravelFilter] = useState<TravelFilterValue>({
    mode: 'driving',
    type: 'distance',
    value: 5
  });

  const handleSearch = () => {
    console.log('Searching for:', searchQuery, 'with filter:', travelFilter);
    // TODO: Implement search functionality
  };

  return (
    <div className="space-y-6">
      <div className="bg-white p-6 rounded-lg shadow-sm">
        <h1 className="text-2xl font-bold mb-6">Search Products</h1>
        
        <div className="space-y-4">
          <div className="flex gap-4">
            <Input
              placeholder="Search for products..."
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
        <h2 className="text-xl font-semibold mb-4">Search Results</h2>
        <p className="text-gray-600">
          Enter a search query to find products near you.
        </p>
      </div>
    </div>
  );
};

export default ProductSearch;
