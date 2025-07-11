
import { MapPin, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { GOOGLE_MAPS_API_KEY } from "@/config";

interface LocationButtonProps {
  userLocation: {lat: number, lng: number} | null;
  onLocationChange?: (location: {lat: number, lng: number} | null) => void;
}

const LocationButton = ({ userLocation, onLocationChange }: LocationButtonProps) => {
  const [locationText, setLocationText] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);
  const [showLocationDialog, setShowLocationDialog] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  // const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Initialize Google Places Autocomplete - commented out to avoid TS error
  /*
  useEffect(() => {
    if (isManualInput && inputRef.current && window.google) {
      const autocomplete = new window.google.maps.places.Autocomplete(inputRef.current, {
        types: ['address'],
        fields: ['formatted_address', 'geometry']
      });

      autocomplete.addListener('place_changed', () => {
        const place = autocomplete.getPlace();
        if (place.geometry && place.geometry.location) {
          const lat = place.geometry.location.lat();
          const lng = place.geometry.location.lng();
          const address = place.formatted_address || '';
          
          setLocationText(address);
          if (onLocationChange) {
            onLocationChange({ lat, lng });
          }
        }
      });

      autocompleteRef.current = autocomplete;
    }

    return () => {
      if (autocompleteRef.current) {
        window.google?.maps?.event?.clearInstanceListeners(autocompleteRef.current);
      }
    };
  }, [isManualInput, onLocationChange]);
  */

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          
          
          // Reverse geocode to get address - commented out to avoid TS error
          /*
          if (window.google) {
            const geocoder = new window.google.maps.Geocoder();
            geocoder.geocode(
              { location: newLocation },
              (results, status) => {
                if (status === 'OK' && results?.[0]) {
                  setLocationText(results[0].formatted_address);
                } else {
                  setLocationText(`${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)}`);
                }
              }
            );
          } else {
            setLocationText(`${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)}`);
          }
          */
          
          setLocationText(`${newLocation.lat.toFixed(4)}, ${newLocation.lng.toFixed(4)}`);
          
          if (onLocationChange) {
            onLocationChange(newLocation);
          }
          setShowLocationDialog(false);
          setIsManualInput(true);
        },
        (error) => {
          console.error("Location access denied:", error);
          setShowLocationDialog(false);
          setIsManualInput(true);
        }
      );
    } else {
      setShowLocationDialog(false);
      setIsManualInput(true);
    }
  };

  const clearLocation = () => {
    setLocationText("");
    setIsManualInput(false);
    if (onLocationChange) {
      onLocationChange(null);
    }
  };

  const handleManualInput = () => {
    setShowLocationDialog(true);
  };

  const handleSkipLocation = () => {
    setShowLocationDialog(false);
    setIsManualInput(true);
  };

  const handleAddressSubmit = async () => {
    if (!locationText.trim()) return;
    
    try {
      // Geocode the manually entered address
      const geocodeUrl = `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(locationText)}&key=${GOOGLE_MAPS_API_KEY}`;
      const response = await fetch(geocodeUrl);
      const data = await response.json();
      
      if (data.status === 'OK' && data.results && data.results[0]) {
        const location = data.results[0].geometry.location;
        const newLocation = { lat: location.lat, lng: location.lng };
        
        if (onLocationChange) {
          onLocationChange(newLocation);
        }
        
        // Update the text with the formatted address
        setLocationText(data.results[0].formatted_address);
      } else {
        console.error('Geocoding failed:', data.status);
        // Keep the original text if geocoding fails
      }
    } catch (error) {
      console.error('Error geocoding address:', error);
      // Keep the original text if there's an error
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleAddressSubmit();
    }
  };

  if (isManualInput || (userLocation && locationText)) {
    return (
      <>
        <div className="flex items-center space-x-2">
          <MapPin className="w-4 h-4 text-blue-600" />
          <Input
            ref={inputRef}
            placeholder="Enter your address"
            value={locationText}
            onChange={(e) => setLocationText(e.target.value)}
            onKeyPress={handleKeyPress}
            onBlur={handleAddressSubmit}
            className="w-64 h-8 text-sm"
          />
          <Button
            variant="ghost"
            size="sm"
            onClick={clearLocation}
            className="p-1 h-8 w-8"
          >
            <X className="w-4 h-4" />
          </Button>
        </div>

        <Dialog open={showLocationDialog} onOpenChange={setShowLocationDialog}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Use Your Current Location?</DialogTitle>
              <DialogDescription>
                We can use your current location to find nearby products and stores more accurately.
              </DialogDescription>
            </DialogHeader>
            <div className="flex justify-end space-x-2 mt-4">
              <Button variant="outline" onClick={handleSkipLocation}>
                Skip
              </Button>
              <Button onClick={requestLocation}>
                <Navigation className="w-4 h-4 mr-2" />
                Use Current Location
              </Button>
            </div>
          </DialogContent>
        </Dialog>
      </>
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={handleManualInput}
        className="text-gray-600 hover:text-blue-600"
      >
        <MapPin className="w-4 h-4 mr-2" />
        Enter Address
      </Button>
    </div>
  );
};

export default LocationButton;
