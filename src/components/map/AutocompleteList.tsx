
import React from 'react';
import CategoryIcon from './CategoryIcon';

interface Category {
  id: string;
  name: string;
  color: string;
  count: number;
}

interface AutocompleteListProps {
  categories: Category[];
  onSelect: (categoryName: string) => void;
}

const AutocompleteList: React.FC<AutocompleteListProps> = ({
  categories,
  onSelect
}) => {
  if (categories.length === 0) return null;

  return (
    <div className="absolute top-full left-0 right-0 mt-1 bg-white border border-gray-200 rounded-lg shadow-lg z-50 max-h-40 overflow-y-auto">
      {categories.map((category) => (
        <div
          key={category.id}
          className="flex items-center gap-3 p-3 hover:bg-gray-50 cursor-pointer border-b border-gray-100 last:border-b-0"
          onClick={() => onSelect(category.name)}
        >
          <CategoryIcon categoryId={category.id} />
          <span className="text-sm text-gray-700">{category.name}</span>
        </div>
      ))}
    </div>
  );
};

export default AutocompleteList;
