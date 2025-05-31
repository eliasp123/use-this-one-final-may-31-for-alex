
import React from 'react';
import { ChevronDown } from 'lucide-react';
import { EmailCategory } from '../../hooks/useEmailCategoryData';
import DraggableCategoryCard from './DraggableCategoryCard';
import AddNewCategoryButton from './AddNewCategoryButton';

interface AccordionCategoryRowProps {
  title: string;
  categories: EmailCategory[];
  isOpen: boolean;
  onToggle: () => void;
  showAddButton?: boolean;
  onAddNewCategory?: () => void;
  onReorder: (dragIndex: number, hoverIndex: number) => void;
  startIndex: number;
  hideHeader?: boolean;
}

const AccordionCategoryRow: React.FC<AccordionCategoryRowProps> = ({
  title,
  categories,
  isOpen,
  onToggle,
  showAddButton = false,
  onAddNewCategory,
  onReorder,
  startIndex,
  hideHeader = false
}) => {
  return (
    <div className="space-y-4">
      {/* Accordion Header - only show if not hidden */}
      {!hideHeader && (
        <button
          onClick={onToggle}
          className="flex items-center justify-between w-full p-4 bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <h3 className="text-lg font-medium text-gray-800">{title}</h3>
          <ChevronDown 
            className={`h-5 w-5 text-gray-500 transition-transform duration-200 ${
              isOpen ? 'rotate-180' : ''
            }`} 
          />
        </button>
      )}

      {/* Accordion Content - using transition for smooth open/close */}
      <div className={`transition-all duration-300 ease-in-out overflow-hidden ${
        isOpen ? 'max-h-none opacity-100' : 'max-h-0 opacity-0'
      }`}>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {categories.map((category, index) => (
            <DraggableCategoryCard
              key={category.id}
              category={category}
              index={startIndex + index}
              onReorder={onReorder}
            />
          ))}
          
          {showAddButton && onAddNewCategory && (
            <AddNewCategoryButton 
              onClick={onAddNewCategory}
              categoriesInRow={categories.length}
            />
          )}
        </div>
      </div>
    </div>
  );
};

export default AccordionCategoryRow;
