
import React from 'react';
import EmailCategoryCard from '../EmailCategoryCard';
import CompactCategoryItem from './CompactCategoryItem';
import AddNewCategoryButton from './AddNewCategoryButton';

interface EmailCategory {
  id: string;
  title: string;
  icon: any;
  unread: number;
  pending: number;
  total: number;
  color: string;
  bgColor: string;
  textColor: string;
}

interface EmailCategoryGridContentProps {
  priorityCategories: EmailCategory[];
  compactCategories: EmailCategory[];
  addButtonInFirstRow: boolean;
  addButtonInCompactRows: boolean;
  onAddNewCategory: () => void;
}

const EmailCategoryGridContent: React.FC<EmailCategoryGridContentProps> = ({
  priorityCategories,
  compactCategories,
  addButtonInFirstRow,
  addButtonInCompactRows,
  onAddNewCategory
}) => {
  return (
    <div className="space-y-8">
      {/* Priority Categories Section - Full Cards (First Row Only) */}
      {(priorityCategories.length > 0 || addButtonInFirstRow) && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
          {priorityCategories.map((category) => (
            <EmailCategoryCard
              key={category.id}
              category={category}
            />
          ))}
          
          {addButtonInFirstRow && (
            <AddNewCategoryButton 
              onClick={onAddNewCategory}
              categoriesInRow={priorityCategories.length}
            />
          )}
        </div>
      )}

      {/* Compact Categories Section */}
      {(compactCategories.length > 0 || addButtonInCompactRows) && (
        <div className="space-y-8" data-section="more-categories">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8 lg:gap-10">
            {compactCategories.map((category) => (
              <CompactCategoryItem
                key={category.id}
                category={category}
              />
            ))}
            
            {addButtonInCompactRows && (
              <AddNewCategoryButton 
                onClick={onAddNewCategory}
                categoriesInRow={compactCategories.length % 3}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default EmailCategoryGridContent;
