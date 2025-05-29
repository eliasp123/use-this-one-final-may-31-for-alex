
import React, { useEffect, useRef } from 'react';

interface Location {
  id: string;
  name: string;
  category: string;
  address: string;
  phone: string;
  website?: string;
  rating: number;
  hours: string;
  distance: string;
  lat: number;
  lng: number;
}

interface CaregiverMapComponentProps {
  locations: Location[];
  selectedLocation: string | null;
  onLocationSelect: (locationId: string) => void;
  center: { lat: number; lng: number };
  zoom: number;
}

const CaregiverMapComponent: React.FC<CaregiverMapComponentProps> = ({
  locations,
  selectedLocation,
  onLocationSelect,
  center,
  zoom
}) => {
  const mapRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // This would be where you'd initialize your map library (Google Maps, Mapbox, etc.)
    // For now, we'll just log the props to show the component is working
    console.log('Map component mounted with:', {
      locations: locations.length,
      selectedLocation,
      center,
      zoom
    });
  }, [locations, selectedLocation, center, zoom]);

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-200 relative">
      <div 
        ref={mapRef}
        className="w-full h-full rounded-lg bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center"
      >
        <div className="text-center p-8">
          <div className="text-4xl mb-4">🗺️</div>
          <h3 className="text-lg font-semibold text-gray-700 mb-2">Interactive Map</h3>
          <p className="text-gray-500 text-sm">
            Map integration ready - connect your preferred map service
          </p>
          <div className="mt-4 text-xs text-gray-400">
            Center: {center.lat.toFixed(4)}, {center.lng.toFixed(4)} | Zoom: {zoom}
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Showing {locations.length} locations
          </div>
        </div>
      </div>
      
      {/* Map controls would go here */}
      <div className="absolute top-4 right-4 space-y-2">
        <button className="bg-white p-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50">
          <span className="text-lg">🔍</span>
        </button>
        <button className="bg-white p-2 rounded-lg shadow-md border border-gray-200 hover:bg-gray-50">
          <span className="text-lg">📍</span>
        </button>
      </div>
    </div>
  );
};

export default CaregiverMapComponent;
