
import { MapPin, Navigation, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState, useEffect, useRef } from "react";

interface LocationButtonProps {
  userLocation: {lat: number, lng: number} | null;
  onLocationChange?: (location: {lat: number, lng: number} | null) => void;
}

const LocationButton = ({ userLocation, onLocationChange }: LocationButtonProps) => {
  const [locationText, setLocationText] = useState("");
  const [isManualInput, setIsManualInput] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);
  const autocompleteRef = useRef<google.maps.places.Autocomplete | null>(null);

  // Initialize Google Places Autocomplete
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

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("Location updated:", position.coords);
          
          // Reverse geocode to get address
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
          
          if (onLocationChange) {
            onLocationChange(newLocation);
          }
        },
        (error) => {
          console.error("Location access denied:", error);
          // If location access is denied, switch to manual input
          setIsManualInput(true);
        }
      );
    } else {
      // If geolocation is not supported, switch to manual input
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
    setIsManualInput(true);
  };

  if (isManualInput || (userLocation && locationText)) {
    return (
      <div className="flex items-center space-x-2">
        <MapPin className="w-4 h-4 text-blue-600" />
        <Input
          ref={inputRef}
          placeholder="Enter your address"
          value={locationText}
          onChange={(e) => setLocationText(e.target.value)}
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
    );
  }

  return (
    <div className="flex items-center space-x-3">
      <Button
        variant="outline"
        size="sm"
        onClick={requestLocation}
        className="text-gray-600 hover:text-blue-600"
      >
        <Navigation className="w-4 h-4 mr-2" />
        Use Current Location
      </Button>
      <Button
        variant="ghost"
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
