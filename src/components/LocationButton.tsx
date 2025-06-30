
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useState } from "react";

interface LocationButtonProps {
  userLocation: {lat: number, lng: number} | null;
  onLocationChange?: (location: {lat: number, lng: number} | null) => void;
}

const LocationButton = ({ userLocation, onLocationChange }: LocationButtonProps) => {
  const [locationText, setLocationText] = useState("");

  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const newLocation = {
            lat: position.coords.latitude,
            lng: position.coords.longitude
          };
          console.log("Location updated:", position.coords);
          if (onLocationChange) {
            onLocationChange(newLocation);
          }
          // Update the input field with coordinates or a location name
          setLocationText(`${position.coords.latitude.toFixed(4)}, ${position.coords.longitude.toFixed(4)}`);
        },
        (error) => {
          console.error("Location access denied:", error);
        }
      );
    }
  };

  return (
    <div className="flex items-center space-x-3">
      {userLocation ? (
        <div className="flex items-center space-x-2">
          <Navigation className="w-4 h-4 text-green-600" />
          <Input
            placeholder="Current location"
            value={locationText || `${userLocation.lat.toFixed(4)}, ${userLocation.lng.toFixed(4)}`}
            onChange={(e) => setLocationText(e.target.value)}
            onClick={requestLocation}
            className="w-48 h-8 text-sm cursor-pointer"
            readOnly
          />
        </div>
      ) : (
        <Button
          variant="outline"
          size="sm"
          onClick={requestLocation}
          className="text-gray-600 hover:text-blue-600"
        >
          <MapPin className="w-4 h-4 mr-2" />
          Enable Location
        </Button>
      )}
    </div>
  );
};

export default LocationButton;
