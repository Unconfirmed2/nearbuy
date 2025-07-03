// Utility for persistent user location (address or coordinates)

const LOCATION_KEY = 'nearbuy_user_location';

export function getUserLocation(): string | null {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem(LOCATION_KEY);
}

export function setUserLocation(location: string) {
  if (typeof window === 'undefined') return;
  localStorage.setItem(LOCATION_KEY, location);
}

export function clearUserLocation() {
  if (typeof window === 'undefined') return;
  localStorage.removeItem(LOCATION_KEY);
}
