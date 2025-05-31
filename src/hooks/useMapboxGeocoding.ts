
import { useState, useCallback } from 'react';
import { useToast } from './use-toast';

interface GeocodingResult {
  id: string;
  place_name: string;
  center: [number, number];
  place_type: string[];
  properties: {
    category?: string;
    tel?: string;
    website?: string;
    address?: string;
    foursquare?: string;
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
  text: string;
}

interface GeocodingResponse {
  features: GeocodingResult[];
}

export const useMapboxGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchLocations = useCallback(async (
    query: string, 
    center?: { lat: number; lng: number },
    categories?: string[]
  ) => {
    if (!query.trim()) return [];

    setIsLoading(true);
    
    try {
      const accessToken = 'pk.eyJ1IjoiZWxpYXNwMTIzIiwiYSI6ImNtOHFjdXl5eDBqaTkybXEyMGVvaWFsdzIifQ.dg0YQHjrTHMrobBHP35KJQ';
      
      // Build URL with enhanced search parameters
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}&limit=20`;
      
      // Include POI types for better healthcare/service results
      url += '&types=poi,address,place';
      
      if (center) {
        url += `&proximity=${center.lng},${center.lat}`;
      }

      // Add category filtering if provided
      if (categories && categories.length > 0) {
        // Map our categories to Mapbox category terms
        const mapboxCategories = categories.flatMap(cat => {
          switch (cat) {
            case 'hospitals': return ['hospital', 'medical', 'health'];
            case 'pharmacies': return ['pharmacy', 'drugstore'];
            case 'senior-living': return ['nursing home', 'senior living', 'assisted living'];
            case 'physical-therapy': return ['physical therapy', 'rehabilitation'];
            case 'elder-law-attorneys': return ['lawyer', 'attorney', 'legal'];
            case 'home-care': return ['home care', 'healthcare'];
            default: return [];
          }
        });
        
        if (mapboxCategories.length > 0) {
          // Use the category parameter for filtering
          url += `&category=${mapboxCategories.join(',')}`;
        }
      }

      console.log('Mapbox search URL:', url);

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data: GeocodingResponse = await response.json();
      console.log('Mapbox search results:', data.features);
      
      return data.features;
    } catch (error) {
      console.error('Geocoding error:', error);
      toast({
        title: "Search Error",
        description: "Failed to search for locations. Please try again.",
        variant: "destructive"
      });
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  const searchNearbyPlaces = useCallback(async (
    center: { lat: number; lng: number },
    categories?: string[],
    radius: number = 10000 // 10km default
  ) => {
    setIsLoading(true);
    
    try {
      const accessToken = 'pk.eyJ1IjoiZWxpYXNwMTIzIiwiYSI6ImNtOHFjdXl5eDBqaTkybXEyMGVvaWFsdzIifQ.dg0YQHjrTHMrobBHP35KJQ';
      
      // Search for general healthcare/service terms near the location
      const searchTerms = categories?.flatMap(cat => {
        switch (cat) {
          case 'hospitals': return ['hospital', 'medical center'];
          case 'pharmacies': return ['pharmacy', 'cvs', 'walgreens'];
          case 'senior-living': return ['nursing home', 'senior living'];
          case 'physical-therapy': return ['physical therapy'];
          case 'elder-law-attorneys': return ['attorney', 'law office'];
          case 'home-care': return ['home care'];
          default: return [];
        }
      }) || ['hospital', 'pharmacy', 'medical', 'healthcare'];

      const allResults: GeocodingResult[] = [];

      // Search for each term
      for (const term of searchTerms.slice(0, 3)) { // Limit to avoid too many requests
        const url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(term)}.json?access_token=${accessToken}&proximity=${center.lng},${center.lat}&types=poi&limit=10`;
        
        const response = await fetch(url);
        if (response.ok) {
          const data: GeocodingResponse = await response.json();
          allResults.push(...data.features);
        }
      }

      // Remove duplicates and filter by distance
      const uniqueResults = allResults.filter((result, index, self) => 
        index === self.findIndex(r => r.id === result.id)
      );

      console.log('Nearby places found:', uniqueResults);
      return uniqueResults;
    } catch (error) {
      console.error('Nearby search error:', error);
      return [];
    } finally {
      setIsLoading(false);
    }
  }, [toast]);

  return { searchLocations, searchNearbyPlaces, isLoading };
};
