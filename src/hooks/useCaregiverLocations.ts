
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
  const { searchLocations } = useMapboxGeocoding();
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [searchResults, setSearchResults] = useState<Location[]>([]);
  const [searchCenter, setSearchCenter] = useState<{ lat: number; lng: number } | null>(null);

  // Convert geocoding result to Location format
  const convertGeocodingToLocation = (result: any): Location => {
    const address = result.place_name;
    const phone = result.properties?.tel || '(555) 000-0000';
    const website = result.properties?.website;
    
    // Determine category based on place type or properties
    let category = 'professionals';
    if (result.properties?.category) {
      const cat = result.properties.category.toLowerCase();
      if (cat.includes('hospital')) category = 'hospitals';
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
        const results = await searchLocations(searchQuery, mapCenter);
        const convertedResults = results.map(convertGeocodingToLocation);
        setSearchResults(convertedResults);
        setLocations([...sampleLocations, ...convertedResults]);
        
        // Set search center to the first result if available
        if (convertedResults.length > 0) {
          setSearchCenter({
            lat: convertedResults[0].lat,
            lng: convertedResults[0].lng
          });
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
  }, [searchQuery, searchLocations, mapCenter, selectedCategories]);

  // Filter by categories
  useEffect(() => {
    if (selectedCategories.length > 0) {
      const allLocations = [...sampleLocations, ...searchResults];
      const filtered = allLocations.filter(location => selectedCategories.includes(location.category));
      setLocations(filtered);
    } else if (!searchQuery.trim()) {
      setLocations(sampleLocations);
    }
  }, [selectedCategories, searchResults, searchQuery]);

  return { locations, searchCenter };
};
