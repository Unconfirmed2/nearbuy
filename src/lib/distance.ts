import { GOOGLE_MAPS_API_KEY } from "@/config";

/**
 * Calculate travel time between two locations using Google Maps Routes API (REST).
 * @param origin - User's location (lat,lng string).
 * @param destination - Store's location (address or lat,lng string).
 * @param mode - Travel mode: "DRIVE", "WALK", "BICYCLE", "TWO_WHEELER" (default: "DRIVE")
 * @returns travel time in minutes.
 */
export const calculateTravelTime = async (
  origin: string,
  destination: string,
  mode: "DRIVE" | "WALK" | "BICYCLE" | "TWO_WHEELER" = "DRIVE"
): Promise<number> => {
  const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
  const body = {
    origin: { location: { latLng: parseLatLng(origin) } },
    destination: { location: { latLng: parseLatLng(destination) } },
    travelMode: mode,
    routingPreference: "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    languageCode: "en-US",
    units: "IMPERIAL"
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Failed to fetch travel time");
  const data = await res.json();
  if (!data.routes || !data.routes[0] || !data.routes[0].duration) throw new Error("No route found");
  // duration is in seconds, convert to minutes
  return data.routes[0].duration.seconds / 60;
};

/**
 * Calculate distance between two locations using Google Maps Routes API (REST).
 * @param origin - User's location (lat,lng string).
 * @param destination - Store's location (address or lat,lng string).
 * @param mode - Travel mode: "DRIVE", "WALK", "BICYCLE", "TWO_WHEELER" (default: "DRIVE")
 * @returns distance in meters.
 */
export const calculateDistance = async (
  origin: string,
  destination: string,
  mode: "DRIVE" | "WALK" | "BICYCLE" | "TWO_WHEELER" = "DRIVE"
): Promise<number> => {
  const url = `https://routes.googleapis.com/directions/v2:computeRoutes`;
  const body = {
    origin: { location: { latLng: parseLatLng(origin) } },
    destination: { location: { latLng: parseLatLng(destination) } },
    travelMode: mode,
    routingPreference: "TRAFFIC_AWARE",
    computeAlternativeRoutes: false,
    languageCode: "en-US",
    units: "IMPERIAL"
  };
  const res = await fetch(url, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Goog-Api-Key": GOOGLE_MAPS_API_KEY,
      "X-Goog-FieldMask": "routes.duration,routes.distanceMeters"
    },
    body: JSON.stringify(body)
  });
  if (!res.ok) throw new Error("Failed to fetch distance");
  const data = await res.json();
  if (!data.routes || !data.routes[0] || !data.routes[0].distanceMeters) throw new Error("No route found");
  return data.routes[0].distanceMeters;
};

// Helper to parse lat,lng string or address to { latitude, longitude }
function parseLatLng(input: string): { latitude: number; longitude: number } {
  // If input is already a lat,lng string
  if (/^-?\d+\.\d+,-?\d+\.\d+$/.test(input)) {
    const [lat, lng] = input.split(",").map(Number);
    return { latitude: lat, longitude: lng };
  }
  throw new Error("Only lat,lng string supported in this implementation");
}
