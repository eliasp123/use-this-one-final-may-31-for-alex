
import { useState, useCallback, useRef } from 'react';

interface MapboxPlace {
  id: string;
  place_name: string;
  text: string;
  place_type: string[];
  center: [number, number];
}

export const useMapboxPlaceSuggestions = () => {
  const [suggestions, setSuggestions] = useState<MapboxPlace[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const debounceTimer = useRef<NodeJS.Timeout>();

  const getSuggestions = useCallback(async (query: string, center?: { lat: number; lng: number }) => {
    if (!query.trim() || query.length < 2) {
      setSuggestions([]);
      return;
    }

    // Clear previous timer
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }

    // Debounce the API call
    debounceTimer.current = setTimeout(async () => {
      setIsLoading(true);
      
      try {
        const accessToken = 'pk.eyJ1IjoiZWxpYXNwMTIzIiwiYSI6ImNtOHFjdXl5eDBqaTkybXEyMGVvaWFsdzIifQ.dg0YQHjrTHMrobBHP35KJQ';
        
        let url = `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(query)}.json?access_token=${accessToken}&limit=5&types=poi,address,place`;
        
        if (center) {
          url += `&proximity=${center.lng},${center.lat}`;
        }

        const response = await fetch(url);
        
        if (response.ok) {
          const data = await response.json();
          setSuggestions(data.features || []);
        } else {
          setSuggestions([]);
        }
      } catch (error) {
        console.error('Place suggestions error:', error);
        setSuggestions([]);
      } finally {
        setIsLoading(false);
      }
    }, 300); // 300ms debounce
  }, []);

  const clearSuggestions = useCallback(() => {
    setSuggestions([]);
    if (debounceTimer.current) {
      clearTimeout(debounceTimer.current);
    }
  }, []);

  return { suggestions, isLoading, getSuggestions, clearSuggestions };
};
