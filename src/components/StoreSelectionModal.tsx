import React, { useState, useCallback, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, Star, ShoppingCart, Map } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import MapModal from "./MapModal";

// Utility to load Google Maps JS API script if not already loaded
function loadGoogleMapsScript(callback: () => void) {
  if (window.google && window.google.maps && window.google.maps.places) {
    callback();
    return;
  }
  const existingScript = document.getElementById('google-maps-script');
  if (existingScript) {
    existingScript.addEventListener('load', callback);
    return;
  }
  const script = document.createElement('script');
  script.id = 'google-maps-script';
  script.src = `https://maps.googleapis.com/maps/api/js?key=${import.meta.env.VITE_GMAPS_API_KEY}&libraries=places`;
  script.async = true;
  script.defer = true;
  script.onload = callback;
  document.head.appendChild(script);
}

interface Store {
  id: string;
  seller: string;
  price: number;
  distance: number;
  travelTime: number;
  rating: number;
  nbScore: number;
  address?: string;
}

interface Product {
  id: string;
  sku: string;
  name: string;
  description: string;
  image: string;
  category: string;
  stores: Store[];
}

interface StoreSelectionModalProps {
  isOpen: boolean;
  onClose: () => void;
  product: Product;
  onAddToBasket: (sku: string, storeId: string) => void;
  isMerchantPreview?: boolean;
  unit?: 'km' | 'mi';
}

const StoreSelectionModal = ({ 
  isOpen, 
  onClose, 
  product, 
  onAddToBasket, 
  isMerchantPreview = false,
  unit = 'km'
}: StoreSelectionModalProps) => {
  const [userLatLng, setUserLatLng] = useState<{ lat: number; lng: number } | null>(null);
  const [mapModalOpen, setMapModalOpen] = useState(false);
  const [mapStores, setMapStores] = useState<any[]>([]); // stores with lat/lng
  const [loadingMap, setLoadingMap] = useState(false);

  const handleAddToBasket = (storeId: string) => {
    onAddToBasket(product.sku, storeId);
    onClose();
  };

  // Helper to geocode location string to lat/lng
  const geocodeLocation = useCallback((location: string): Promise<{ lat: number; lng: number } | null> => {
    return new Promise((resolve) => {
      loadGoogleMapsScript(() => {
        if (!window.google || !window.google.maps) return resolve(null);
        const geocoder = new window.google.maps.Geocoder();
        geocoder.geocode({ address: location }, (results, status) => {
          if (status === 'OK' && results && results[0]) {
            const { lat, lng } = results[0].geometry.location;
            resolve({ lat: lat(), lng: lng() });
          } else {
            resolve(null);
          }
        });
      });
    });
  }, []);

  // On mount, geocode user location if available
  useEffect(() => {
    if (typeof window !== 'undefined' && window.localStorage) {
      const loc = window.localStorage.getItem('nearbuy_user_location');
      if (loc) {
        geocodeLocation(loc).then((coords) => {
          if (coords) setUserLatLng(coords);
        });
      }
    }
  }, [geocodeLocation]);

  // Pre-geocode all store addresses before opening map
  const handleShowAllOnMap = async () => {
    setLoadingMap(true);
    const geocodedStores = await Promise.all(
      product.stores.map(async (store) => {
        if (store.address) {
          const coords = await geocodeLocation(store.address);
          if (coords) {
            return { ...store, lat: coords.lat, lng: coords.lng };
          }
        }
        return { ...store };
      })
    );
    setMapStores(geocodedStores);
    setLoadingMap(false);
    setMapModalOpen(true);
  };

  // Calculate average rating for the product
  const averageRating = product.stores.length > 0 ? (
    product.stores.reduce((sum, s) => sum + (s.rating || 0), 0) / product.stores.length
  ) : 0;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-md" aria-describedby="store-selection-modal-desc">
        <span id="store-selection-modal-desc" className="sr-only">
          Select a store to add this product to your basket, or view all stores on a map.
        </span>
        <DialogHeader>
          <DialogTitle className="flex items-center space-x-3">
            <img src={product.image} alt={product.name} className="w-12 h-12 rounded-lg object-cover" />
            <div>
              <div className="font-semibold">{product.name}</div>
              <div className="text-sm text-gray-500">{product.category}</div>
              <div className="flex items-center gap-1 mt-1">
                <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                <span className="text-xs font-medium">{averageRating.toFixed(1)}</span>
                <span className="inline-block w-24 text-right tabular-nums text-gray-500 ml-2" aria-label={`Average Distance (${unit})`}>
                  {product.stores.length > 0 ? `${(
                    product.stores.reduce((sum, s) => sum + (s.distance || 0), 0) / product.stores.length
                  ).toFixed(1)}${unit}/${Math.round(
                    product.stores.reduce((sum, s) => sum + (s.travelTime || 0), 0) / product.stores.length
                  )}min` : '--'}
                </span>
              </div>
            </div>
          </DialogTitle>
        </DialogHeader>
        
        {isMerchantPreview && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-3 mb-4">
            <div className="text-sm text-blue-800">
              <strong>Merchant Preview:</strong> This is how customers see your product availability.
            </div>
          </div>
        )}
        
        <div className="space-y-3 max-h-96 overflow-y-auto">
          {product.stores.map((store) => (
            <div key={store.id} className="border rounded-lg p-4 space-y-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="font-medium text-sm">{store.seller}</div>
                  <div className="flex items-center space-x-3 text-xs text-gray-600 mt-1">
                    <div className="flex items-center space-x-1">
                      <MapPin className="w-3 h-3" />
                      <span className="inline-block w-20 text-right tabular-nums">
                        {(store.distance || 0).toFixed(1)}{unit}/{Math.round((store.travelTime || 0))}min
                      </span>
                    </div>
                    <div className="flex items-center space-x-1">
                      <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
                      <span>{(store.rating || 0).toFixed(1)}</span>
                    </div>
                  </div>
                  {store.address && (
                    <div className="text-xs text-gray-500 mt-1 line-clamp-2">
                      {store.address}
                    </div>
                  )}
                </div>
                <div className="text-right ml-3">
                  <div className="text-lg font-bold">${(store.price || 0).toFixed(2)}</div>
                  <Badge variant="secondary" className="text-xs">
                    NB: {(store.nbScore || 0).toFixed(1)}/5
                  </Badge>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button 
                  onClick={() => handleAddToBasket(store.id)}
                  className={`flex-1 bg-blue-600 hover:bg-blue-700 text-sm ${
                    isMerchantPreview ? 'opacity-50 cursor-not-allowed' : ''
                  }`}
                  size="sm"
                  disabled={isMerchantPreview}
                >
                  <ShoppingCart className="w-4 h-4 mr-2" />
                  {isMerchantPreview ? 'Cart Disabled' : 'Add to Basket'}
                </Button>
              </div>
            </div>
          ))}
        </div>
        {/* Single map button for all stores */}
        {product.stores.length > 0 && (
          <div className="flex justify-center mt-4">
            <Button 
              variant="outline"
              className="text-sm"
              size="sm"
              onClick={handleShowAllOnMap}
              disabled={loadingMap}
            >
              <Map className="w-4 h-4 mr-2" />
              {loadingMap ? 'Loading...' : 'Show All on Map'}
            </Button>
          </div>
        )}
        {/* Universal Map Modal for all stores */}
        {mapModalOpen && (
          <MapModal
            isOpen={mapModalOpen}
            onClose={() => setMapModalOpen(false)}
            userLocation={userLatLng || undefined}
            stores={mapStores.map(store => ({
              id: store.id,
              name: store.seller,
              address: store.address || '',
              lat: store.lat,
              lng: store.lng,
            }))}
          />
        )}
      </DialogContent>
    </Dialog>
  );
};

export default StoreSelectionModal;
