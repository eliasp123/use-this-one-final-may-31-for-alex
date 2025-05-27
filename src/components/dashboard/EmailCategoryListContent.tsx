
import React from 'react';
import EmailCategoryListItem from './EmailCategoryListItem';
import { EmailCategory } from '../../hooks/useEmailCategoryData';

interface EmailCategoryListContentProps {
  categories: EmailCategory[];
  onAddNewCategory: () => void;
  showAddButton: boolean;
}

const EmailCategoryListContent: React.FC<EmailCategoryListContentProps> = ({
  categories,
  onAddNewCategory,
  showAddButton
}) => {
  return (
    <div className="space-y-3">
      {categories.map((category) => (
        <EmailCategoryListItem
          key={category.id}
          category={category}
        />
      ))}
      
      {showAddButton && (
        <button
          onClick={onAddNewCategory}
          className="w-full p-4 border-2 border-dashed border-gray-300 rounded-lg hover:border-gray-400 hover:bg-gray-50 transition-colors text-gray-500 hover:text-gray-600"
        >
          + Add New Category
        </button>
      )}
    </div>
  );
};

export default EmailCategoryListContent;
