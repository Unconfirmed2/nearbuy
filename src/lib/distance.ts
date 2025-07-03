/**
 * Calculate travel time between two locations using Google Maps JS API.
 * @param origin - User's location (address or coordinates).
 * @param destination - Store's location (address or coordinates).
 * @returns travel time in minutes.
 */
export const calculateTravelTime = async (origin: string, destination: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !(window.google.maps as any).DistanceMatrixService) {
      reject(new Error('Google Maps JS API not loaded'));
      return;
    }
    const service = new (window.google.maps as any).DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: (window.google.maps as any).TravelMode ? (window.google.maps as any).TravelMode.DRIVING : 'DRIVING',
      },
      (response: any, status: string) => {
        if (status !== 'OK' || !response.rows[0] || !response.rows[0].elements[0] || !response.rows[0].elements[0].duration) {
          reject(new Error('Failed to get travel time'));
        } else {
          const travelTime = response.rows[0].elements[0].duration.value / 60;
          resolve(travelTime);
        }
      }
    );
  });
};

/**
 * Calculate distance between two locations using Google Maps JS API.
 * @param origin - User's location (address or coordinates).
 * @param destination - Store's location (address or coordinates).
 * @returns distance in meters.
 */
export const calculateDistance = async (origin: string, destination: string): Promise<number> => {
  return new Promise((resolve, reject) => {
    if (!window.google || !window.google.maps || !(window.google.maps as any).DistanceMatrixService) {
      reject(new Error('Google Maps JS API not loaded'));
      return;
    }
    const service = new (window.google.maps as any).DistanceMatrixService();
    service.getDistanceMatrix(
      {
        origins: [origin],
        destinations: [destination],
        travelMode: (window.google.maps as any).TravelMode ? (window.google.maps as any).TravelMode.DRIVING : 'DRIVING',
      },
      (response: any, status: string) => {
        if (status !== 'OK' || !response.rows[0] || !response.rows[0].elements[0] || !response.rows[0].elements[0].distance) {
          reject(new Error('Failed to get distance'));
        } else {
          const distance = response.rows[0].elements[0].distance.value;
          resolve(distance);
        }
      }
    );
  });
};
