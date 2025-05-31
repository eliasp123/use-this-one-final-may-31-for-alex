
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
  };
  context?: Array<{
    id: string;
    text: string;
  }>;
}

interface GeocodingResponse {
  features: GeocodingResult[];
}

export const useMapboxGeocoding = () => {
  const [isLoading, setIsLoading] = useState(false);
  const { toast } = useToast();

  const searchLocations = useCallback(async (query: string, center?: { lat: number; lng: number }) => {
    if (!query.trim()) return [];

    setIsLoading(true);
    
    try {
      const accessToken = 'pk.eyJ1IjoiZWxpYXNwMTIzIiwiYSI6ImNtOHFjdXl5eDBqaTkybXEyMGVvaWFsdzIifQ.dg0YQHjrTHMrobBHP35KJQ';
      
      let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}&limit=10&types=poi,address,place`;
      
      if (center) {
        url += `&proximity=${center.lng},${center.lat}`;
      }

      const response = await fetch(url);
      
      if (!response.ok) {
        throw new Error('Geocoding request failed');
      }

      const data: GeocodingResponse = await response.json();
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

  return { searchLocations, isLoading };
};
