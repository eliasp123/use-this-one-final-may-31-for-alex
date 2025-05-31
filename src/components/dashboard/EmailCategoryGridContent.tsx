
import React, { forwardRef, useImperativeHandle } from 'react';
import { EmailCategory } from '../../hooks/useEmailCategoryData';
import { usePersistentCategoryOrder } from '../../hooks/usePersistentCategoryOrder';
import AccordionCategoryRow from './AccordionCategoryRow';

interface EmailCategoryGridContentProps {
  priorityCategories: EmailCategory[];
  compactCategories: EmailCategory[];
  addButtonInFirstRow: boolean;
  addButtonInCompactRows: boolean;
  onAddNewCategory: () => void;
}

export interface EmailCategoryGridContentRef {
  openAll: () => void;
  closeAll: () => void;
}

const EmailCategoryGridContent = forwardRef<EmailCategoryGridContentRef, EmailCategoryGridContentProps>(({
  priorityCategories,
  compactCategories,
  addButtonInFirstRow,
  addButtonInCompactRows,
  onAddNewCategory
}, ref) => {
  const allCategories = [...priorityCategories, ...compactCategories];
  const { orderedCategories, handleReorder } = usePersistentCategoryOrder(allCategories);
  
  // Calculate rows dynamically based on ordered categories
  const categoriesPerRow = 3;
  
  // Expose accordion controls to parent (these will control individual card accordions)
  useImperativeHandle(ref, () => ({
    openAll: () => {
      // Could implement card-level accordion control here if needed
      console.log('Open all card accordions');
    },
    closeAll: () => {
      // Could implement card-level accordion control here if needed
      console.log('Close all card accordions');
    }
  }));

  // Create rows from ordered categories
  const rows = [];
  for (let i = 0; i < orderedCategories.length; i += categoriesPerRow) {
    const rowCategories = orderedCategories.slice(i, i + categoriesPerRow);
    const rowIndex = Math.floor(i / categoriesPerRow);
    const isFirstRow = rowIndex === 0;
    
    rows.push({
      categories: rowCategories,
      startIndex: i,
      showAddButton: (isFirstRow && addButtonInFirstRow) || (!isFirstRow && addButtonInCompactRows && i + categoriesPerRow >= orderedCategories.length)
    });
  }

  return (
    <div className="space-y-8">
      {rows.map((row, rowIndex) => (
        <AccordionCategoryRow
          key={`row-${rowIndex}`}
          title=""
          categories={row.categories}
          isOpen={true}
          onToggle={() => {}}
          showAddButton={row.showAddButton}
          onAddNewCategory={onAddNewCategory}
          onReorder={handleReorder}
          startIndex={row.startIndex}
          hideHeader={true}
        />
      ))}
    </div>
  );
});

EmailCategoryGridContent.displayName = 'EmailCategoryGridContent';

export default EmailCategoryGridContent;
