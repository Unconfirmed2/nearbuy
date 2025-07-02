
import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Separator } from '@/components/ui/separator';
import { MapPin, Navigation, Clock, Route, Car, Bike, Zap } from 'lucide-react';
import { getBasket, BasketItem } from '@/utils/localStorage';
import { toast } from 'sonner';

const RoutePlanner: React.FC = () => {
  const [basketItems, setBasketItems] = useState<BasketItem[]>(getBasket());
  const [currentLocation, setCurrentLocation] = useState<{lat: number, lng: number} | null>(null);
  const [travelMode, setTravelMode] = useState<'driving' | 'walking' | 'bicycling'>('driving');
  const [routeOptimized, setRouteOptimized] = useState(false);

  // Group items by store
  const storeGroups = basketItems.reduce((groups, item) => {
    const key = `${item.storeId}-${item.storeName}`;
    if (!groups[key]) {
      groups[key] = {
        storeId: item.storeId,
        storeName: item.storeName,
        items: [],
        // Mock store coordinates for demo
        coordinates: { 
          lat: 40.7128 + (Math.random() - 0.5) * 0.1, 
          lng: -74.0060 + (Math.random() - 0.5) * 0.1 
        }
      };
    }
    groups[key].items.push(item);
    return groups;
  }, {} as Record<string, any>);

  const stores = Object.values(storeGroups);

  useEffect(() => {
    // Get user's current location
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setCurrentLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude
          });
        },
        (error) => {
          
          // Use default NYC coordinates for demo
          setCurrentLocation({ lat: 40.7128, lng: -74.0060 });
        }
      );
    }
  }, []);

  const handleOptimizeRoute = () => {
    if (!currentLocation) {
      toast.error('Unable to get your location');
      return;
    }

    // Mock route optimization
    setRouteOptimized(true);
    toast.success('Route optimized! Follow the numbered waypoints.');
  };

  const handleStartNavigation = () => {
    if (stores.length === 0) {
      toast.error('No stores to navigate to');
      return;
    }

    // Generate Google Maps URL with multiple waypoints
    const waypoints = stores.map(store => 
      `${store.coordinates.lat},${store.coordinates.lng}`
    ).join('|');
    
    const mapsUrl = `https://www.google.com/maps/dir/${currentLocation?.lat},${currentLocation?.lng}/${waypoints}`;
    window.open(mapsUrl, '_blank');
    toast.success('Opening Google Maps navigation');
  };

  const getTravelModeIcon = (mode: string) => {
    switch (mode) {
      case 'driving': return <Car className="h-4 w-4" />;
      case 'bicycling': return <Bike className="h-4 w-4" />;
      case 'walking': return <Zap className="h-4 w-4" />;
      default: return <Car className="h-4 w-4" />;
    }
  };

  const estimatedTotalTime = stores.length * 10; // Mock 10 min per store

  if (stores.length === 0) {
    return (
      <div className="space-y-6">
        <h1 className="text-2xl font-bold">Route Planner</h1>
        <Card>
          <CardContent className="p-12 text-center">
            <Route className="w-16 h-16 text-gray-400 mx-auto mb-4" />
            <h2 className="text-xl font-semibold mb-2">No stores to visit</h2>
            <p className="text-gray-600 mb-6">
              Add items to your cart to plan your pickup route.
            </p>
            <Button onClick={() => window.history.back()}>
              Start Shopping
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold">Route Planner</h1>
        <Badge variant="secondary">{stores.length} stores</Badge>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-4">
          {/* Travel Mode Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Navigation className="h-5 w-5" />
                <span>Travel Mode</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2">
                {[
                  { mode: 'driving', label: 'Driving', icon: Car },
                  { mode: 'bicycling', label: 'Cycling', icon: Bike },
                  { mode: 'walking', label: 'Walking', icon: Zap }
                ].map(({ mode, label, icon: Icon }) => (
                  <Button
                    key={mode}
                    variant={travelMode === mode ? 'default' : 'outline'}
                    onClick={() => setTravelMode(mode as any)}
                    className="flex items-center space-x-2"
                  >
                    <Icon className="h-4 w-4" />
                    <span>{label}</span>
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Store List */}
          <Card>
            <CardHeader>
              <CardTitle>Pickup Locations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {stores.map((store, index) => (
                <div key={`${store.storeId}-${store.storeName}`} className="flex items-start space-x-4 p-4 border rounded-lg">
                  <div className="flex-shrink-0">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white font-bold ${
                      routeOptimized ? 'bg-blue-600' : 'bg-gray-400'
                    }`}>
                      {routeOptimized ? index + 1 : '?'}
                    </div>
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-2">
                      <h3 className="font-medium">{store.storeName}</h3>
                      <Badge variant="outline">{store.items.length} items</Badge>
                    </div>
                    <div className="text-sm text-gray-600 space-y-1">
                      {store.items.map((item: BasketItem) => (
                        <div key={`${item.productId}-${item.storeId}`}>
                          {item.quantity}x {item.productName}
                        </div>
                      ))}
                    </div>
                    <div className="flex items-center text-sm text-gray-500 mt-2">
                      <MapPin className="h-3 w-3 mr-1" />
                      {routeOptimized ? `Stop ${index + 1}` : 'Not optimized'}
                    </div>
                  </div>
                </div>
              ))}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-4">
          {/* Route Summary */}
          <Card>
            <CardHeader>
              <CardTitle>Route Summary</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Total Stops</span>
                <span className="font-medium">{stores.length}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Travel Mode</span>
                <div className="flex items-center space-x-1">
                  {getTravelModeIcon(travelMode)}
                  <span className="font-medium capitalize">{travelMode}</span>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-sm text-gray-600">Est. Time</span>
                <span className="font-medium">{estimatedTotalTime} min</span>
              </div>
              <Separator />
              <div className="space-y-2">
                <Button 
                  className="w-full"
                  onClick={handleOptimizeRoute}
                  disabled={routeOptimized}
                >
                  <Route className="h-4 w-4 mr-2" />
                  {routeOptimized ? 'Route Optimized' : 'Optimize Route'}
                </Button>
                <Button 
                  variant="outline" 
                  className="w-full"
                  onClick={handleStartNavigation}
                  disabled={!routeOptimized}
                >
                  <Navigation className="h-4 w-4 mr-2" />
                  Start Navigation
                </Button>
              </div>
            </CardContent>
          </Card>

          {routeOptimized && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Clock className="h-5 w-5" />
                  <span>Route Details</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-sm text-gray-600">
                  <p className="mb-2">Your optimized route:</p>
                  <ol className="list-decimal list-inside space-y-1">
                    {stores.map((store, index) => (
                      <li key={`${store.storeId}-${store.storeName}`}>
                        {store.storeName}
                      </li>
                    ))}
                  </ol>
                </div>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  );
};

export default RoutePlanner;
