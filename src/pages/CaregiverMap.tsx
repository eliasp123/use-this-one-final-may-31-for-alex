
import React, { useState, useEffect } from 'react';
import { ArrowLeft } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CaregiverMapComponent from '../components/map/CaregiverMapComponent';
import MapSearchBar from '../components/map/MapSearchBar';
import MapCategoryToggle from '../components/map/MapCategoryToggle';
import LocationsList from '../components/map/LocationsList';
import { useToast } from '../hooks/use-toast';

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

// Sample data
const sampleLocations: Location[] = [
  {
    id: '1',
    name: 'City Elder Law Associates',
    category: 'elder-law-attorneys',
    address: '123 Main St, Downtown, CA 90210',
    phone: '(555) 123-4567',
    website: 'https://example.com',
    rating: 4.8,
    hours: 'Open until 6 PM',
    distance: '0.5 mi',
    lat: 34.0522,
    lng: -118.2437
  },
  {
    id: '2',
    name: 'ComfortCare Home Services',
    category: 'home-care',
    address: '456 Oak Ave, Westside, CA 90211',
    phone: '(555) 234-5678',
    rating: 4.6,
    hours: '24/7',
    distance: '1.2 mi',
    lat: 34.0622,
    lng: -118.2537
  },
  {
    id: '3',
    name: 'Sunny Gardens Senior Living',
    category: 'senior-living',
    address: '789 Pine St, Eastside, CA 90212',
    phone: '(555) 345-6789',
    website: 'https://example.com',
    rating: 4.9,
    hours: 'Open until 8 PM',
    distance: '2.1 mi',
    lat: 34.0422,
    lng: -118.2337
  }
];

const CaregiverMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [isLoading, setIsLoading] = useState(false);
  const [mapCenter, setMapCenter] = useState({ lat: 34.0522, lng: -118.2437 });
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    // Filter locations based on category and search
    let filtered = sampleLocations;
    
    if (selectedCategory !== 'all') {
      filtered = filtered.filter(location => location.category === selectedCategory);
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query) ||
        location.category.toLowerCase().includes(query)
      );
    }
    
    setLocations(filtered);
  }, [selectedCategory, searchQuery]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
  };

  const handleLocationRequest = () => {
    setIsLoading(true);
    
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setMapCenter({ lat: latitude, lng: longitude });
          setMapZoom(14);
          setIsLoading(false);
          
          toast({
            title: "Location Found",
            description: "Map centered on your current location",
          });
        },
        () => {
          setIsLoading(false);
          toast({
            title: "Location Access Denied",
            description: "Please enable location services or search manually",
            variant: "destructive",
          });
        }
      );
    } else {
      setIsLoading(false);
      toast({
        title: "Location Not Supported",
        description: "Your browser doesn't support location services",
        variant: "destructive",
      });
    }
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setMapCenter({ lat: location.lat, lng: location.lng });
      setMapZoom(16);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-4 py-4">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              onClick={() => navigate('/')}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <ArrowLeft className="h-5 w-5" />
            </button>
            <h1 className="text-xl font-semibold text-gray-900">Find Care Providers</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-6">
        {/* Search and Filters */}
        <div className="mb-6 space-y-4">
          <MapSearchBar
            onSearch={handleSearch}
            onLocationRequest={handleLocationRequest}
          />
          
          <div className="flex justify-center">
            <MapCategoryToggle
              selectedCategory={selectedCategory}
              onCategoryChange={setSelectedCategory}
            />
          </div>
        </div>

        {/* Map and Results */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Results List */}
          <div className="lg:col-span-1">
            <LocationsList
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              isLoading={isLoading}
            />
          </div>

          {/* Map */}
          <div className="lg:col-span-2 h-96 lg:h-[600px]">
            <CaregiverMapComponent
              locations={locations}
              selectedLocation={selectedLocation}
              onLocationSelect={handleLocationSelect}
              center={mapCenter}
              zoom={mapZoom}
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default CaregiverMap;
