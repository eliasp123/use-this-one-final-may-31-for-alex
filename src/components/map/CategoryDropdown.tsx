
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
    ['elder-law-attorneys', 'other-professionals', 'paying-for-care'],
    ['home-care', 'physical-therapy', 'senior-living'],
    ['government-va', 'hospitals', 'pharmacies']
  ];

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Simplified typewriter effect without backspacing
  const [placeholderText, setPlaceholderText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);
  const [opacity, setOpacity] = useState(1);

  useEffect(() => {
    if (!isFocused && !searchQuery && categories.length > 0) {
      setIsTyping(true);
      const currentCategory = categories[currentCategoryIndex];
      const fullText = `Show me ${currentCategory.name}`;
      let charIndex = 0;

      // Typing phase
      const typeInterval = setInterval(() => {
        if (charIndex < fullText.length) {
          setPlaceholderText(fullText.slice(0, charIndex + 1));
          charIndex++;
        } else {
          clearInterval(typeInterval);
          
          // Wait before starting to fade out
          setTimeout(() => {
            // Fade out phase
            let fadeOpacity = 1;
            const fadeInterval = setInterval(() => {
              fadeOpacity -= 0.1;
              setOpacity(fadeOpacity);
              
              if (fadeOpacity <= 0) {
                clearInterval(fadeInterval);
                setOpacity(1);
                setPlaceholderText('');
                
                // Move to next category and start again
                setTimeout(() => {
                  setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
                  setIsTyping(false);
                }, 300);
              }
            }, 100);
          }, 2000); // Wait 2 seconds before fading
        }
      }, 100);

      return () => clearInterval(typeInterval);
    } else if (isFocused || searchQuery) {
      setPlaceholderText('');
      setIsTyping(false);
      setOpacity(1);
    }
  }, [isFocused, searchQuery, categories, currentCategoryIndex, isTyping]);

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Don't close dropdown immediately to allow category clicks
  };

  const handleCategoryClick = (categoryId: string) => {
    console.log('Category clicked:', categoryId);
    onCategoryToggle(categoryId);
  };

  const handleSelectAllClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Select all clicked');
    onSelectAll();
  };

  const handleGoClick = (event: React.MouseEvent) => {
    event.preventDefault();
    event.stopPropagation();
    console.log('Go button clicked');
    setIsDropdownOpen(false);
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
          onChange={(e) => onSearchChange(e.target.value)}
          onFocus={handleInputFocus}
          onBlur={handleInputBlur}
          placeholder={isFocused || searchQuery ? '' : ''}
          className="w-full h-12 pl-12 pr-4 text-base bg-white border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent"
        />
        
        {/* Typewriter placeholder */}
        {!isFocused && !searchQuery && (
          <div 
            className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none transition-opacity duration-300"
            style={{ opacity }}
          >
            {placeholderText}
            <span className={`${isTyping ? 'animate-pulse' : 'opacity-0'} transition-opacity duration-300`}>|</span>
          </div>
        )}
      </div>

      {/* Category Dropdown */}
      {isDropdownOpen && (
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
              <div className="w-full flex items-center justify-between p-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors">
                <div
                  className="flex items-center gap-2 cursor-pointer"
                  onClick={handleSelectAllClick}
                >
                  <Checkbox
                    checked={selectedCategories.length === categories.length}
                    onCheckedChange={onSelectAll}
                    className="flex-shrink-0 border-white data-[state=checked]:bg-white data-[state=checked]:text-teal-700"
                    onClick={(e) => e.stopPropagation()}
                  />
                  <span className="text-sm font-medium">Or select all categories</span>
                </div>
                <div className="flex items-center gap-2">
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
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
