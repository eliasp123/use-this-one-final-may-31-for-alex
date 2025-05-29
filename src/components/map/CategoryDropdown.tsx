
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';

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

  // Typewriter effect for placeholder
  const [placeholderText, setPlaceholderText] = useState('');
  const fullPlaceholder = 'Show me Gov';

  useEffect(() => {
    if (!isFocused && !searchQuery) {
      let i = 0;
      const typeInterval = setInterval(() => {
        if (i < fullPlaceholder.length) {
          setPlaceholderText(fullPlaceholder.slice(0, i + 1));
          i++;
        } else {
          clearInterval(typeInterval);
          // After typing, wait and then clear
          setTimeout(() => {
            const clearIntervalId = setInterval(() => {
              setPlaceholderText(prev => {
                if (prev.length > 0) {
                  return prev.slice(0, -1);
                } else {
                  clearInterval(clearIntervalId);
                  return '';
                }
              });
            }, 50);
          }, 2000);
        }
      }, 100);

      return () => clearInterval(typeInterval);
    }
  }, [isFocused, searchQuery]);

  const handleInputFocus = () => {
    setIsFocused(true);
    setIsDropdownOpen(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    // Don't close dropdown immediately to allow category clicks
  };

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
          <div className="absolute left-12 top-1/2 transform -translate-y-1/2 text-gray-400 pointer-events-none">
            {placeholderText}
            <span className="animate-pulse">|</span>
          </div>
        )}
      </div>

      {/* Category Dropdown */}
      {isDropdownOpen && (
        <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-80 overflow-y-auto">
          <div className="p-4">
            {/* Category Grid */}
            <div className="grid grid-cols-3 gap-2 mb-4">
              {categories.map((category) => (
                <button
                  key={category.id}
                  onClick={() => onCategoryToggle(category.id)}
                  className="flex items-center gap-2 p-2 text-left hover:bg-gray-50 rounded-md transition-colors"
                >
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                </button>
              ))}
            </div>

            {/* Select All Button */}
            <div className="border-t border-gray-200 pt-3">
              <button
                onClick={onSelectAll}
                className="w-full flex items-center gap-2 p-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors"
              >
                <div className="w-3 h-3 bg-white rounded-sm flex-shrink-0" />
                <span className="text-sm font-medium">Or select all categories</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
