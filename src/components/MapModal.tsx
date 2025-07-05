import React from "react";

interface LatLng {
  lat: number;
  lng: number;
}

interface MapModalProps {
  isOpen: boolean;
  onClose: () => void;
  userLocation: LatLng;
  storeLocation: LatLng;
  storeName: string;
}

const MapModal: React.FC<MapModalProps> = ({ isOpen, onClose, userLocation, storeLocation, storeName }) => {
  if (!isOpen) return null;

  const mapSrc = `https://www.google.com/maps/embed/v1/directions?key=${import.meta.env.VITE_GMAPS_API_KEY}` +
    `&origin=${userLocation.lat},${userLocation.lng}` +
    `&destination=${storeLocation.lat},${storeLocation.lng}` +
    `&zoom=14`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl p-4 relative">
        <button onClick={onClose} className="absolute top-2 right-2 text-gray-500 hover:text-gray-700">✕</button>
        <h2 className="text-lg font-semibold mb-2">Directions to {storeName}</h2>
        <iframe
          title="Google Map"
          width="100%"
          height="400"
          frameBorder="0"
          style={{ border: 0 }}
          src={mapSrc}
          allowFullScreen
        ></iframe>
      </div>
    </div>
  );
};

export default MapModal;
