// @ts-nocheck
import React, { useEffect, useRef } from "react";

interface LatLng {
  lat: number;
  lng: number;
}

interface StoreMarker {
  id: string;
  name: string;
  address: string;
  logo_url?: string;
  lat?: number;
  lng?: number;
}

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: LatLng;
  stores: StoreMarker[];
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, userLocation, stores }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<any>(null);
  const markersRef = useRef<any[]>([]);

  useEffect(() => {
    if (!isOpen) return;
    if (!window.google || !window.google.maps) return;
    if (!mapRef.current) return;

    // Geocode user location if needed
    const geocoder = new window.google.maps.Geocoder();
    let userLatLngPromise: Promise<any>;
    if (userLocation && typeof userLocation.lat === 'number' && typeof userLocation.lng === 'number') {
      userLatLngPromise = Promise.resolve(userLocation);
    } else {
      userLatLngPromise = Promise.reject('Invalid user location');
    }

    userLatLngPromise.then((userLatLng) => {
      // Initialize map centered on user
      if (!mapInstance.current) {
        mapInstance.current = new window.google.maps.Map(mapRef.current, {
          center: userLatLng,
          zoom: 12,
        });
      } else {
        mapInstance.current.setCenter(userLatLng);
      }
      // Clear old markers
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      // Add user marker
      const userMarker = new window.google.maps.Marker({
        position: userLatLng,
        map: mapInstance.current,
        icon: {
          path: window.google.maps.SymbolPath.CIRCLE,
          scale: 8,
          fillColor: '#2563eb',
          fillOpacity: 1,
          strokeColor: '#fff',
          strokeWeight: 2,
        },
        title: 'Your Location',
      });
      markersRef.current.push(userMarker);
      // Add store markers
      stores.forEach((store) => {
        if (store.lat && store.lng) {
          const marker = new window.google.maps.Marker({
            position: { lat: store.lat, lng: store.lng },
            map: mapInstance.current,
            title: store.name,
            icon: store.logo_url
              ? {
                  url: store.logo_url,
                  scaledSize: new window.google.maps.Size(32, 32),
                }
              : undefined,
          });
          markersRef.current.push(marker);
        } else if (store.address) {
          // Geocode store address
          geocoder.geocode({ address: store.address }, (results: any, status: string) => {
            if (status === 'OK' && results && results[0]) {
              const marker = new window.google.maps.Marker({
                position: results[0].geometry.location,
                map: mapInstance.current,
                title: store.name,
                icon: store.logo_url
                  ? {
                      url: store.logo_url,
                      scaledSize: new window.google.maps.Size(32, 32),
                    }
                  : undefined,
              });
              markersRef.current.push(marker);
            }
          });
        }
      });
    });
    // Cleanup on close
    return () => {
      markersRef.current.forEach((m) => m.setMap(null));
      markersRef.current = [];
      mapInstance.current = null;
    };
  }, [isOpen, userLocation, stores]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50" role="dialog" aria-modal="true" aria-describedby="map-modal-desc">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 relative">
        <span id="map-modal-desc" className="sr-only">
          Map showing your location and all selected stores.
        </span>
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
        <h2 className="text-lg font-semibold mb-2">Stores Map</h2>
        <div ref={mapRef} style={{ width: '100%', height: 400, borderRadius: 8 }} />
      </div>
    </div>
  );
};

export default MapModal;
