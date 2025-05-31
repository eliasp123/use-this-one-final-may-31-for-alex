
import React from 'react';
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
  categories,
  showAddButton = false,
  onAddNewCategory,
  onReorder,
  startIndex
}) => {
  return (
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
  );
};

export default AccordionCategoryRow;
