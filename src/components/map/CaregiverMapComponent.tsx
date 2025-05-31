import React, { useEffect, useRef } from 'react';
import mapboxgl from 'mapbox-gl';
import 'mapbox-gl/dist/mapbox-gl.css';

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
  const map = useRef<mapboxgl.Map | null>(null);
  const markersRef = useRef<mapboxgl.Marker[]>([]);

  useEffect(() => {
    if (!mapRef.current) return;

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpYXNwMTIzIiwiYSI6ImNtOHFjdXl5eDBqaTkybXEyMGVvaWFsdzIifQ.dg0YQHjrTHMrobBHP35KJQ';

    // Initialize map
    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/eliasp123/cmbblm5l2003d01qvb0ht1coj',
      center: [center.lng, center.lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');

    return () => {
      map.current?.remove();
    };
  }, []);

  // Update map center and zoom when props change - fixed animation
  useEffect(() => {
    if (map.current) {
      map.current.flyTo({
        center: [center.lng, center.lat],
        zoom: zoom,
        speed: 1.5,
        curve: 1,
        essential: true
      });
    }
  }, [center, zoom]);

  // Update markers when locations change
  useEffect(() => {
    if (!map.current) return;

    // Clear existing markers
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    locations.forEach(location => {
      const el = document.createElement('div');
      el.className = 'marker';
      el.style.backgroundColor = selectedLocation === location.id ? '#3B82F6' : '#EF4444';
      el.style.width = '20px';
      el.style.height = '20px';
      el.style.borderRadius = '50%';
      el.style.cursor = 'pointer';
      el.style.border = '2px solid white';
      el.style.boxShadow = '0 2px 4px rgba(0,0,0,0.2)';

      const marker = new mapboxgl.Marker(el)
        .setLngLat([location.lng, location.lat])
        .addTo(map.current!);

      // Add click handler
      el.addEventListener('click', () => {
        onLocationSelect(location.id);
      });

      // Add popup
      const popup = new mapboxgl.Popup({ offset: 25 })
        .setHTML(`
          <div style="padding: 8px;">
            <h3 style="margin: 0 0 4px 0; font-weight: bold; font-size: 14px;">${location.name}</h3>
            <p style="margin: 0 0 4px 0; font-size: 12px; color: #666;">${location.address}</p>
            <p style="margin: 0; font-size: 12px; color: #666;">${location.phone}</p>
          </div>
        `);

      marker.setPopup(popup);
      markersRef.current.push(marker);
    });
  }, [locations, selectedLocation, onLocationSelect]);

  return (
    <div className="w-full h-full bg-gray-100 rounded-lg border border-gray-200 relative">
      <div 
        ref={mapRef}
        className="w-full h-full rounded-lg"
      />
    </div>
  );
};

export default CaregiverMapComponent;
