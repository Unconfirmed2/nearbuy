// src/lib/units.ts
// Utility for distance units (miles/km) based on user location

export type DistanceUnit = 'km' | 'mi';

// Returns 'mi' for US, Liberia, Myanmar, else 'km'
export function getDefaultDistanceUnit(countryCode?: string): DistanceUnit {
  if (!countryCode) return 'km';
  return ['US', 'LR', 'MM'].includes(countryCode.toUpperCase()) ? 'mi' : 'km';
}

// Convert meters to km or mi
export function metersToUnit(meters: number, unit: DistanceUnit): number {
  return unit === 'mi' ? meters / 1609.34 : meters / 1000;
}

// Convert km to mi
export function kmToMi(km: number): number {
  return km * 0.621371;
}

// Convert mi to km
export function miToKm(mi: number): number {
  return mi / 0.621371;
}
