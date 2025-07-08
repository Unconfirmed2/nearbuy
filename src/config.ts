// src/config.ts
// Centralized config for environment variables and API keys

export const GOOGLE_MAPS_API_KEY = import.meta.env.VITE_GMAPS_API_KEY || "";

console.log('Google Maps API Key status:', GOOGLE_MAPS_API_KEY ? 'loaded' : 'missing');

// Add other config values as needed
