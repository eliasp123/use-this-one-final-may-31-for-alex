import React, { useState, useEffect } from 'react';
import { ArrowLeft, Search, MapPin, Phone, Globe, Scale, Briefcase, CreditCard, Home, Activity, Building2, Building, Cross, Pill } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import CaregiverMapComponent from '../components/map/CaregiverMapComponent';
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

// Sample data matching the reference
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

const CaregiverMap = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [selectedLocation, setSelectedLocation] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [locations, setLocations] = useState<Location[]>(sampleLocations);
  const [mapCenter, setMapCenter] = useState({ lat: 34.0522, lng: -118.2437 });
  const [mapZoom, setMapZoom] = useState(12);

  useEffect(() => {
    let filtered = sampleLocations;
    
    if (selectedCategories.length > 0) {
      filtered = filtered.filter(location => selectedCategories.includes(location.category));
    }
    
    if (searchQuery) {
      const query = searchQuery.toLowerCase();
      filtered = filtered.filter(location =>
        location.name.toLowerCase().includes(query) ||
        location.address.toLowerCase().includes(query)
      );
    }
    
    setLocations(filtered);
  }, [selectedCategories, searchQuery]);

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => {
      if (prev.includes(categoryId)) {
        return prev.filter(id => id !== categoryId);
      } else {
        return [...prev, categoryId];
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

  const getCategoryColor = (categoryId: string) => {
    return categories.find(cat => cat.id === categoryId)?.color || '#6B7280';
  };

  return (
    <div className="h-screen flex flex-col bg-gray-50">
      {/* Header */}
      <div className="bg-teal-700 text-white px-6 py-4 flex items-center gap-4">
        <button
          onClick={() => navigate('/')}
          className="p-1 hover:bg-teal-600 rounded transition-colors"
        >
          <ArrowLeft className="h-5 w-5" />
        </button>
        <h1 className="text-xl font-medium">Care Resources Map</h1>
      </div>

      {/* Search Bar */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder={selectedCategories.length > 0 ? `${selectedCategories.length} categories selected - search or select more` : "Show me Gov"}
            className="w-full h-12 pl-12 pr-4 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
          />
        </div>
      </div>

      {/* Category Filters - Simple List */}
      <div className="bg-white px-6 py-4 border-b border-gray-200">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => handleCategoryToggle(category.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 text-left ${
                  selectedCategories.includes(category.id)
                    ? 'text-white shadow-md'
                    : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                }`}
                style={{
                  backgroundColor: selectedCategories.includes(category.id) ? category.color : undefined
                }}
              >
                <div 
                  className="w-4 h-4 rounded-full flex items-center justify-center flex-shrink-0" 
                  style={{ 
                    backgroundColor: selectedCategories.includes(category.id) ? 'rgba(255,255,255,0.3)' : category.color
                  }}
                >
                  {React.cloneElement(category.icon as React.ReactElement, {
                    className: `h-2.5 w-2.5 text-white`
                  })}
                </div>
                <span className="flex-1">{category.name}</span>
              </button>
            ))}
          </div>
          
          {selectedCategories.length > 0 && (
            <div className="mt-4 text-center">
              <button
                onClick={() => setSelectedCategories([])}
                className="text-teal-600 hover:text-teal-700 text-sm font-medium"
              >
                Clear all filters
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex">
        {/* Results Sidebar */}
        <div className="w-80 bg-white border-r border-gray-200 flex flex-col">
          <div className="p-4 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900">
              {locations.length} location{locations.length !== 1 ? 's' : ''}
            </h3>
          </div>
          
          <div className="flex-1 overflow-y-auto">
            {locations.map((location) => (
              <div
                key={location.id}
                onClick={() => handleLocationSelect(location.id)}
                className={`p-4 border-b border-gray-100 cursor-pointer hover:bg-gray-50 ${
                  selectedLocation === location.id ? 'bg-blue-50 border-l-4 border-l-blue-500' : ''
                }`}
              >
                <div className="flex items-start gap-3">
                  <div 
                    className="w-6 h-6 rounded-sm mt-1 flex-shrink-0" 
                    style={{ backgroundColor: getCategoryColor(location.category) }}
                  />
                  
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-gray-900 mb-1">{location.name}</h4>
                    <p className="text-sm text-gray-600 capitalize mb-2">{location.category.replace('-', ' ')}</p>
                    
                    <div className="space-y-1 text-sm text-gray-600">
                      <div className="flex items-start gap-2">
                        <MapPin className="h-4 w-4 mt-0.5 flex-shrink-0" />
                        <span>{location.address}</span>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <Phone className="h-4 w-4 flex-shrink-0" />
                        <span>{location.phone}</span>
                      </div>
                      
                      {location.website && (
                        <div className="flex items-center gap-2">
                          <Globe className="h-4 w-4 flex-shrink-0" />
                          <span className="text-blue-600">{location.website}</span>
                        </div>
                      )}
                    </div>
                    
                    <div className="mt-3 flex gap-4">
                      <button className="bg-teal-600 text-white px-4 py-1 rounded text-sm hover:bg-teal-700 transition-colors">
                        Directions
                      </button>
                      <button className="bg-teal-600 text-white px-4 py-1 rounded text-sm hover:bg-teal-700 transition-colors">
                        Call
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

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
