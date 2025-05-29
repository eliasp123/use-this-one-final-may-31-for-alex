
import React, { useState, useRef, useEffect } from 'react';
import { Search } from 'lucide-react';
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

  // Enhanced typewriter effect for cycling through category names
  const [placeholderText, setPlaceholderText] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [currentCategoryIndex, setCurrentCategoryIndex] = useState(0);

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
          
          // Wait before starting to delete
          setTimeout(() => {
            let deleteIndex = fullText.length;
            
            // Deleting phase
            const deleteInterval = setInterval(() => {
              if (deleteIndex > 0) {
                setPlaceholderText(fullText.slice(0, deleteIndex - 1));
                deleteIndex--;
              } else {
                clearInterval(deleteInterval);
                
                // Move to next category and start again
                setTimeout(() => {
                  setCurrentCategoryIndex((prev) => (prev + 1) % categories.length);
                  setIsTyping(false);
                }, 300);
              }
            }, 50);
          }, 2000); // Wait 2 seconds before deleting
        }
      }, 100);

      return () => clearInterval(typeInterval);
    } else if (isFocused || searchQuery) {
      setPlaceholderText('');
      setIsTyping(false);
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

  const handleCategorySelect = (categoryId: string) => {
    onCategoryToggle(categoryId);
  };

  const handleSelectAllToggle = () => {
    onSelectAll();
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
            <span className={`${isTyping ? 'animate-pulse' : 'opacity-0'} transition-opacity duration-300`}>|</span>
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
                <div
                  key={category.id}
                  onClick={() => handleCategorySelect(category.id)}
                  className="flex items-center gap-2 p-2 hover:bg-gray-50 rounded-md transition-colors cursor-pointer"
                >
                  <Checkbox
                    checked={selectedCategories.includes(category.id)}
                    onCheckedChange={() => handleCategorySelect(category.id)}
                    className="flex-shrink-0"
                  />
                  <div 
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: category.color }}
                  />
                  <span className="text-sm text-gray-700 flex-1">{category.name}</span>
                </div>
              ))}
            </div>

            {/* Select All Button */}
            <div className="border-t border-gray-200 pt-3">
              <div
                onClick={handleSelectAllToggle}
                className="w-full flex items-center gap-2 p-2 bg-teal-700 text-white rounded-md hover:bg-teal-800 transition-colors cursor-pointer"
              >
                <Checkbox
                  checked={selectedCategories.length === categories.length}
                  onCheckedChange={handleSelectAllToggle}
                  className="flex-shrink-0 border-white data-[state=checked]:bg-white data-[state=checked]:text-teal-700"
                />
                <span className="text-sm font-medium">Or select all categories</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CategoryDropdown;
