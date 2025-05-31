
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

  console.log('🗺️ CaregiverMapComponent rendered with:', {
    locationsCount: locations.length,
    selectedLocation,
    center,
    zoom,
    locations: locations.map(l => ({ id: l.id, name: l.name, category: l.category }))
  });

  useEffect(() => {
    console.log('🗺️ Map initialization effect triggered');
    if (!mapRef.current) {
      console.log('❌ Map ref not available');
      return;
    }

    // Set Mapbox access token
    mapboxgl.accessToken = 'pk.eyJ1IjoiZWxpYXNwMTIzIiwiYSI6ImNtOHFjdXl5eDBqaTkybXEyMGVvaWFsdzIifQ.dg0YQHjrTHMrobBHP35KJQ';
    console.log('🔑 Mapbox access token set');

    // Initialize map
    console.log('🗺️ Creating new Mapbox map with center:', center, 'zoom:', zoom);
    map.current = new mapboxgl.Map({
      container: mapRef.current,
      style: 'mapbox://styles/eliasp123/cmbblm5l2003d01qvb0ht1coj',
      center: [center.lng, center.lat],
      zoom: zoom
    });

    // Add navigation controls
    map.current.addControl(new mapboxgl.NavigationControl(), 'top-right');
    console.log('🧭 Navigation controls added');

    // Add map event listeners for debugging
    map.current.on('load', () => {
      console.log('✅ Map loaded successfully');
    });

    map.current.on('error', (e) => {
      console.error('❌ Map error:', e);
    });

    map.current.on('movestart', () => {
      console.log('🗺️ Map move started');
    });

    map.current.on('moveend', () => {
      const currentCenter = map.current?.getCenter();
      const currentZoom = map.current?.getZoom();
      console.log('🗺️ Map move ended - new center:', currentCenter, 'zoom:', currentZoom);
    });

    return () => {
      console.log('🗺️ Cleaning up map');
      map.current?.remove();
    };
  }, []);

  // Update map center and zoom when props change
  useEffect(() => {
    console.log('🗺️ Map center/zoom update effect triggered with:', { center, zoom });
    if (map.current) {
      console.log('🗺️ Flying to new position:', center, 'zoom:', zoom);
      map.current.flyTo({
        center: [center.lng, center.lat],
        zoom: zoom,
        speed: 1.2,
        curve: 1,
        essential: true
      });
    } else {
      console.log('❌ Map not initialized yet for center/zoom update');
    }
  }, [center, zoom]);

  // Update markers when locations change
  useEffect(() => {
    console.log('🗺️ Markers update effect triggered with:', {
      locationsCount: locations.length,
      selectedLocation,
      mapInitialized: !!map.current
    });
    
    if (!map.current) {
      console.log('❌ Map not initialized yet for markers update');
      return;
    }

    // Clear existing markers
    console.log('🗺️ Clearing', markersRef.current.length, 'existing markers');
    markersRef.current.forEach(marker => marker.remove());
    markersRef.current = [];

    // Add new markers
    console.log('🗺️ Adding', locations.length, 'new markers');
    locations.forEach((location, index) => {
      console.log(`📍 Adding marker ${index + 1}:`, {
        id: location.id,
        name: location.name,
        category: location.category,
        lat: location.lat,
        lng: location.lng,
        isSelected: selectedLocation === location.id
      });

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
        console.log('📍 Marker clicked:', location.id, location.name);
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

    console.log('✅ Markers update completed, total markers:', markersRef.current.length);
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
