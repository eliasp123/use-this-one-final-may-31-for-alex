
import React, { forwardRef, useImperativeHandle, useState, useCallback, useMemo } from 'react';
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
  toggleAll: () => void;
  allExpanded: boolean;
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
  
  // State to track which cards are expanded - first 9 categories (3 rows) default to open
  const [expandedCards, setExpandedCards] = useState<Set<string>>(() => {
    const firstNineCategories = orderedCategories.slice(0, 9);
    return new Set(firstNineCategories.map(cat => cat.id));
  });

  // Check if all cards are expanded
  const allExpanded = useMemo(() => {
    return orderedCategories.length > 0 && expandedCards.size === orderedCategories.length;
  }, [expandedCards.size, orderedCategories.length]);

  // Functions to control all card accordions
  const openAll = useCallback(() => {
    setExpandedCards(new Set(orderedCategories.map(cat => cat.id)));
  }, [orderedCategories]);

  const closeAll = useCallback(() => {
    setExpandedCards(new Set());
  }, []);

  const toggleAll = useCallback(() => {
    if (allExpanded) {
      closeAll();
    } else {
      openAll();
    }
  }, [allExpanded, openAll, closeAll]);

  // Function to toggle individual card
  const toggleCard = useCallback((categoryId: string) => {
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      if (newSet.has(categoryId)) {
        newSet.delete(categoryId);
      } else {
        newSet.add(categoryId);
      }
      return newSet;
    });
  }, []);

  // Calculate rows dynamically based on ordered categories
  const categoriesPerRow = 3;
  
  // Expose accordion controls to parent
  useImperativeHandle(ref, () => ({
    openAll,
    closeAll,
    toggleAll,
    allExpanded
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
          expandedCards={expandedCards}
          onToggleCard={toggleCard}
        />
      ))}
    </div>
  );
});

EmailCategoryGridContent.displayName = 'EmailCategoryGridContent';

export default EmailCategoryGridContent;
