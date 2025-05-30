
import { MapPin, Navigation } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";

interface LocationButtonProps {
  userLocation: {lat: number, lng: number} | null;
}

const LocationButton = ({ userLocation }: LocationButtonProps) => {
  const requestLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          console.log("Location updated:", position.coords);
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
        <Badge variant="secondary" className="bg-green-100 text-green-800">
          <Navigation className="w-3 h-3 mr-1" />
          Location Active
        </Badge>
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
