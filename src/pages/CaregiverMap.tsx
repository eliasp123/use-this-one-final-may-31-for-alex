import React, { useState, useEffect } from 'react';
import { Scale, Briefcase, CreditCard, Home, Activity, Building2, Building, Cross, Pill } from 'lucide-react';
import CaregiverMapComponent from '../components/map/CaregiverMapComponent';
import CategoryDropdown from '../components/map/CategoryDropdown';
import CaregiverLocationsList from '../components/map/CaregiverLocationsList';
import CaregiverMapHeader from '../components/map/CaregiverMapHeader';
import { useCaregiverLocations } from '../hooks/useCaregiverLocations';
import { useMapboxGeocoding } from '../hooks/useMapboxGeocoding';

interface Category {
  id: string;
  name: string;
  color: string;
  icon: React.ReactNode;
  count: number;
}

const categories: Category[] = [
  { id: 'elder-law-attorneys', name: 'Elder Law Attorneys', color: '#F59E0B', icon: <Scale className="h-5 w-5" />, count: 2 },
  { id: 'professionals', name: 'Other Professionals', color: '#6B7280', icon: <Briefcase className="h-5 w-5" />, count: 2 },
  { id: 'paying-for-care', name: 'Paying for Care', color: '#F59E0B', icon: <CreditCard className="h-5 w-5" />, count: 1 },
  { id: 'home-care', name: 'Home Care', color: '#10B981', icon: <Home className="h-5 w-5" />, count: 2 },
  { id: 'physical-therapy', name: 'Physical Therapy', color: '#10B981', icon: <Activity className="h-5 w-5" />, count: 2 },
  { id: 'senior-living', name: 'Senior Living', color: '#8B5CF6', icon: <Building2 className="h-5 w-5" />, count: 2 },
  { id: 'government-va', name: 'Government & VA', color: '#3B82F6', icon: <Building className="h-5 w-5" />, count: 2 },
  { id: 'hospitals', name: 'Hospitals', color: '#EF4444', icon: <Cross className="h-5 w-5" />, count: 1 },
  { id: 'pharmacies', name: 'Pharmacies', color: '#EC4899', icon: <Pill className="h-5 w-5" />, count: 3 }
];

const CaregiverMap = () => {
  const { isLoading } = useMapboxGeocoding();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [mapCenter, setMapCenter] = useState({ lat: 34.0522, lng: -118.2437 });
  const [mapZoom, setMapZoom] = useState(12);
  
  const { locations, searchCenter } = useCaregiverLocations(searchQuery, selectedCategories, mapCenter);

  // Update map center when search results are found
  useEffect(() => {
    if (searchCenter) {
      setMapCenter(searchCenter);
      setMapZoom(13); // Fixed zoom level
    }
  }, [searchCenter]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
      }
    });
  };

  const handleSelectAllCategories = () => {
    console.log('handleSelectAllCategories called');
    setSelectedCategories(prev => {
      const allCategoryIds = categories.map(cat => cat.id);
      if (prev.length === allCategoryIds.length) {
        console.log('Deselecting all categories');
        return [];
      } else {
        console.log('Selecting all categories');
        return allCategoryIds;
      }
    });
  };

  const handleLocationSelect = (locationId: string) => {
    setSelectedLocation(locationId);
    const location = locations.find(loc => loc.id === locationId);
    if (location) {
      setMapCenter({ lat: location.lat, lng: location.lng });
      setMapZoom(16);
    }
  };

  const handlePlaceSelect = (place: any) => {
    console.log('Place selected:', place);
    const newCenter = {
      lat: place.center[1],
      lng: place.center[0]
    };
    setMapCenter(newCenter);
    setMapZoom(14);
    // Clear selected location since we're showing a new place
    setSelectedLocation(null);
  };

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || '#6B7280';
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      <CaregiverMapHeader isLoading={isLoading} />

      {/* Search Bar with Dropdown */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <CategoryDropdown
          categories={categories}
          selectedCategories={selectedCategories}
          onCategoryToggle={handleCategoryToggle}
          onSelectAll={handleSelectAllCategories}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          mapCenter={mapCenter}
          onPlaceSelect={handlePlaceSelect}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        <CaregiverLocationsList
          locations={locations}
          selectedLocation={selectedLocation}
          onLocationSelect={handleLocationSelect}
          getCategoryColor={getCategoryColor}
          searchQuery={searchQuery}
        />

        {/* Map */}
        <div className="flex-1">
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
  );
};

export default CaregiverMap;
