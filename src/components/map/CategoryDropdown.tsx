
import React, { useState, useRef, useEffect } from 'react';
import { Search, Scale, Briefcase, CreditCard, Home, Activity, Building2, Building, Cross, Pill } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface CategoryDropdownProps {
  categories: Category[];
  selectedCategories: string[];
  onCategoryToggle: (categoryId: string) => void;
  onSelectAll: () => void;
  searchQuery: string;
  onSearchChange: (query: string) => void;
}

const CategoryDropdown: React.FC<CategoryDropdownProps> = ({
  categories,
  selectedCategories,
  onCategoryToggle,
  onSelectAll,
  searchQuery,
  onSearchChange
}) => {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isFocused, setIsFocused] = useState(false);
  const [showAutocomplete, setShowAutocomplete] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Category icon mapping with background colors
  const getCategoryIcon = (categoryId: string) => {
    const iconMap: Record<string, { icon: React.ReactNode; bgColor: string }> = {
      'elder-law-attorneys': { icon: <Scale className="h-4 w-4" />, bgColor: '#F59E0B' },
      'professionals': { icon: <Briefcase className="h-4 w-4" />, bgColor: '#6B7280' },
      'paying-for-care': { icon: <CreditCard className="h-4 w-4" />, bgColor: '#F59E0B' },
      'home-care': { icon: <Home className="h-4 w-4" />, bgColor: '#10B981' },
      'physical-therapy': { icon: <Activity className="h-4 w-4" />, bgColor: '#10B981' },
      'senior-living': { icon: <Building2 className="h-4 w-4" />, bgColor: '#8B5CF6' },
      'government-va': { icon: <Building className="h-4 w-4" />, bgColor: '#3B82F6' },
      'hospitals': { icon: <Cross className="h-4 w-4" />, bgColor: '#EF4444' },
      'pharmacies': { icon: <Pill className="h-4 w-4" />, bgColor: '#EC4899' }
    };
    return iconMap[categoryId] || { icon: <Home className="h-4 w-4" />, bgColor: '#6B7280' };
  };

  // Organized category groups for vertical layout (3 categories per column)
  const categoryGroups = [
    ['elder-law-attorneys', 'professionals', 'paying-for-care'],
    ['home-care', 'physical-therapy', 'senior-living'],
    ['government-va', 'hospitals', 'pharmacies']
  ];

  // Filter categories based on search query for autocomplete
  const filteredCategories = categories.filter(category =>
    category.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Auto-check categories based on search query
  useEffect(() => {
    if (searchQuery.trim() && searchQuery.length > 2) {
      const matchingCategories = categories.filter(category =>
        category.name.toLowerCase().includes(searchQuery.toLowerCase().trim())
      );
      
      // Auto-check the first matching category if it's not already selected
      if (matchingCategories.length > 0) {
        const firstMatch = matchingCategories[0];
        if (!selectedCategories.includes(firstMatch.id)) {
          onCategoryToggle(firstMatch.id);
        }
      }
    }
  }, [searchQuery, categories, selectedCategories, onCategoryToggle]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setShowAutocomplete(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsDropdownOpen(true);
    if (searchQuery) {
      setShowAutocomplete(true);
    }
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Don't close dropdown immediately to allow category clicks
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    onSearchChange(value);
    setShowAutocomplete(value.length > 0);
    if (value.length > 0) {
      setIsDropdownOpen(false);
    } else {
      setIsDropdownOpen(true);
    }
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log('Category clicked:', categoryId);
    onCategoryToggle(categoryId);
  };

  const handleAutocompleteSelect = (categoryName: string) => {
    onSearchChange(categoryName);
    setShowAutocomplete(false);
    setIsDropdownOpen(true);
  };

  // Check if all categories are selected
  const allCategoriesSelected = selectedCategories.length === categories.length;

  const handleSelectAllClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Select all clicked, current state:', { selectedCategories, allCategoriesSelected });
    onSelectAll();
  };

  const handleGoClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Go button clicked');
    setIsDropdownOpen(false);
    setShowAutocomplete(false);
  };

  // Get category by ID
  const getCategoryById = (id: string) => categories.find(cat => cat.id === id);

  return (
    <div ref={dropdownRef} className="relative w-full">
      {/* Search Input */}
      <div className="relative">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
        <input
          ref={inputRef}
          type="text"
          value={searchQuery}
          onChange={handleInputChange}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder="Search categories or places..."
          className="w-full h-12 pl-12 pr-4 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
      </div>

      {/* Autocomplete Dropdown */}
      {showAutocomplete && filteredCategories.length > 0 && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
          {filteredCategories.map((category) => {
            const categoryIcon = getCategoryIcon(category.id);
            return (
              <div
                key={category.id}
                className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
                onClick={() => handleAutocompleteSelect(category.name)}
              >
                <div 
                  className="flex-shrink-0 p-1 rounded text-white"
                  style={{ backgroundColor: categoryIcon.bgColor }}
                >
                  {categoryIcon.icon}
                </div>
                <span className="text-sm text-gray-700">{category.name}</span>
              </div>
            );
          })}
        </div>
      )}

      {/* Category Dropdown */}
      {isDropdownOpen && !showAutocomplete && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-4">
            {/* Category Groups - 3 vertical columns */}
            <div className="grid grid-cols-3 gap-4 mb-4">
              {categoryGroups.map((group, groupIndex) => (
                <div key={groupIndex} className="space-y-2">
                  {group.map((categoryId) => {
                    const category = getCategoryById(categoryId);
                    if (!category) return null;
                    
                    const categoryIcon = getCategoryIcon(category.id);
                    return (
                      <div
                        key={category.id}
                        className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                        onClick={() => handleCategoryClick(category.id)}
                      >
                        <Checkbox
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={() => onCategoryToggle(category.id)}
                          className="flex-shrink-0 border-gray-300 data-[state=checked]:bg-white data-[state=checked]:border-gray-400 data-[state=checked]:text-gray-700"
                          onClick={(e) => e.stopPropagation()}
                        />
                        <div 
                          className="flex-shrink-0 p-1 rounded text-white"
                          style={{ backgroundColor: categoryIcon.bgColor }}
                        >
                          {categoryIcon.icon}
                        </div>
                        <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Select All Button with Go Button */}
            <div className="border-t border-gray-200 pt-3">
              <div className="w-full flex items-center gap-2 p-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors cursor-pointer">
                <div
                  className="flex items-center gap-2 flex-1"
                  onClick={handleSelectAllClick}
                >
                  <Checkbox
                    checked={allCategoriesSelected}
                    className="flex-shrink-0 border-white data-[state=checked]:bg-white data-[state=checked]:text-teal-700"
                  />
                  <span className="text-sm font-medium">
                    {allCategoriesSelected ? 'Deselect all categories' : 'Or select all categories'}
                  </span>
                </div>
                <span className="text-white">|</span>
                <button
                  onClick={handleGoClick}
                  className="text-white text-sm font-medium hover:underline"
                >
                  Go →
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
