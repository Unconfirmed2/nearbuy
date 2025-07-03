// Utility to convert lat/lng to string for Google Maps API
export function latLngToString(location: { lat: number, lng: number }): string {
  return `${location.lat},${location.lng}`;
}
