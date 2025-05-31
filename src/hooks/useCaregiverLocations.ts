
import { useState, useEffect } from 'react';
import { useMapboxGeocoding } from './useMapboxGeocoding';

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

const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'Sunrise Senior Living Beverly Hills',
    category: 'senior-living',
    address: '9131 Pico Blvd, Los Angeles, CA 90035',
    phone: '(310) 888-3751',
    website: 'sunriseseniorliving.com',
    rating: 4.8,
    hours: 'Open until 6 PM',
    distance: '0.5 mi',
    lat: 34.0522,
    lng: -118.2437
  },
  {
    id: '2',
    name: 'Visiting Angels Home Care',
    category: 'home-care',
    address: '1234 Wilshire Blvd, Los Angeles, CA 90017',
    phone: '(323) 555-0123',
    website: 'visitingangels.com',
    rating: 4.6,
    hours: '24/7',
    distance: '1.2 mi',
    lat: 34.0622,
    lng: -118.2537
  }
];

export const useCaregiverLocations = (
  searchQuery: string,
  selectedCategories: string[],
  mapCenter: { lat: number; lng: number }
) => {
  const { searchLocations, searchNearbyPlaces } = useMapboxGeocoding();
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);

  // Convert geocoding result to Location format
  const convertGeocodingToLocation = (result: any): Location => {
    const address = result.place_name;
    const phone = result.properties?.tel || '(555) 000-0000';
    const website = result.properties?.website;
    
    // Determine category based on place type, properties, or text
    let category = 'professionals';
    const text = result.text?.toLowerCase() || '';
    const placeName = result.place_name?.toLowerCase() || '';
    const properties = result.properties || {};
    
    // Enhanced category detection
    if (text.includes('hospital') || placeName.includes('hospital') || placeName.includes('medical center')) {
      category = 'hospitals';
    } else if (text.includes('pharmacy') || placeName.includes('pharmacy') || text.includes('cvs') || text.includes('walgreens')) {
      category = 'pharmacies';
    } else if (text.includes('senior') || text.includes('nursing') || text.includes('assisted living')) {
      category = 'senior-living';
    } else if (text.includes('therapy') || text.includes('rehabilitation') || text.includes('physical therapy')) {
      category = 'physical-therapy';
    } else if (text.includes('attorney') || text.includes('lawyer') || text.includes('law')) {
      category = 'elder-law-attorneys';
    } else if (text.includes('care') && (text.includes('home') || text.includes('health'))) {
      category = 'home-care';
    } else if (properties.category) {
      const cat = properties.category.toLowerCase();
      if (cat.includes('hospital') || cat.includes('medical')) category = 'hospitals';
      else if (cat.includes('pharmacy')) category = 'pharmacies';
      else if (cat.includes('senior') || cat.includes('care')) category = 'senior-living';
      else if (cat.includes('therapy')) category = 'physical-therapy';
    }

    return {
      id: result.id,
      name: result.text || result.place_name.split(',')[0],
      category,
      address,
      phone,
      website,
      rating: 4.0 + Math.random(),
      hours: 'Hours not available',
      distance: '0.0 mi',
      lat: result.center[1],
      lng: result.center[0]
    };
  };

  // Handle search query changes
  useEffect(() => {
    const performSearch = async () => {
      if (searchQuery.trim() && searchQuery.length > 2) {
        console.log('Searching for:', searchQuery);
        
        // First search for the location itself
        const locationResults = await searchLocations(searchQuery, mapCenter);
        
        if (locationResults.length > 0) {
          const firstResult = locationResults[0];
          const newCenter = {
            lat: firstResult.center[1],
            lng: firstResult.center[0]
          };
          
          setSearchCenter(newCenter);
          
          // Then search for nearby places in selected categories
          let nearbyResults: any[] = [];
          if (selectedCategories.length > 0) {
            nearbyResults = await searchNearbyPlaces(newCenter, selectedCategories);
          } else {
            // If no categories selected, search for general healthcare places
            nearbyResults = await searchNearbyPlaces(newCenter, ['hospitals', 'pharmacies', 'senior-living']);
          }
          
          // Combine location results with nearby results, prioritizing nearby places
          const allResults = [...nearbyResults, ...locationResults.slice(1)];
          const convertedResults = allResults.map(convertGeocodingToLocation);
          
          // Filter by selected categories if any
          let filteredResults = convertedResults;
          if (selectedCategories.length > 0) {
            filteredResults = convertedResults.filter(location => 
              selectedCategories.includes(location.category)
            );
          }
          
          setSearchResults(filteredResults);
          setLocations(filteredResults.length > 0 ? filteredResults : sampleLocations);
        } else {
          // No location found, just show sample data
          setSearchResults([]);
          setSearchCenter(null);
          setLocations(sampleLocations);
        }
      } else {
        setSearchResults([]);
        setSearchCenter(null);
        let filtered = sampleLocations;
        
        if (selectedCategories.length > 0) {
          filtered = filtered.filter(location => selectedCategories.includes(location.category));
        }
        
        setLocations(filtered);
      }
    };

    const debounceTimer = setTimeout(performSearch, 300);
    return () => clearTimeout(debounceTimer);
  }, [searchQuery, searchLocations, searchNearbyPlaces, mapCenter, selectedCategories]);

  // Filter by categories
  useEffect(() => {
    if (selectedCategories.length > 0 && !searchQuery.trim()) {
      const filtered = sampleLocations.filter(location => selectedCategories.includes(location.category));
      setLocations(filtered);
    } else if (!searchQuery.trim()) {
      setLocations(sampleLocations);
    }
  }, [selectedCategories, searchQuery]);

  return { locations, searchCenter };
};
