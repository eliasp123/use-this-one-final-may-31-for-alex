
import React, { useEffect, forwardRef, useImperativeHandle } from 'react';
import { EmailCategory } from '../../hooks/useEmailCategoryData';
import { usePersistentCategoryOrder } from '../../hooks/usePersistentCategoryOrder';
import { useAccordionStates } from '../../hooks/useAccordionStates';
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
  const totalRows = Math.ceil(orderedCategories.length / categoriesPerRow);
  const hasAddButton = addButtonInFirstRow || addButtonInCompactRows;
  const actualTotalRows = hasAddButton ? totalRows + 1 : totalRows;
  
  const { 
    accordionStates, 
    toggleRow, 
    openAll, 
    closeAll, 
    updateRowCount 
  } = useAccordionStates(actualTotalRows);

  // Update row count when categories change
  useEffect(() => {
    updateRowCount(actualTotalRows);
  }, [actualTotalRows, updateRowCount]);

  // Expose accordion controls to parent
  useImperativeHandle(ref, () => ({
    openAll,
    closeAll
  }));

  // Create rows from ordered categories
  const rows = [];
  for (let i = 0; i < orderedCategories.length; i += categoriesPerRow) {
    const rowCategories = orderedCategories.slice(i, i + categoriesPerRow);
    const rowIndex = Math.floor(i / categoriesPerRow);
    const isFirstRow = rowIndex === 0;
    
    rows.push({
      title: isFirstRow ? 'Priority Categories' : `Categories ${rowIndex + 1}`,
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
          title={row.title}
          categories={row.categories}
          isOpen={accordionStates[rowIndex] || false}
          onToggle={() => toggleRow(rowIndex)}
          showAddButton={row.showAddButton}
          onAddNewCategory={onAddNewCategory}
          onReorder={handleReorder}
          startIndex={row.startIndex}
        />
      ))}
    </div>
  );
});

EmailCategoryGridContent.displayName = 'EmailCategoryGridContent';

export default EmailCategoryGridContent;
