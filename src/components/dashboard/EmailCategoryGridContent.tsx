
import React, { forwardRef, useImperativeHandle, useState, useCallback, useMemo, useEffect } from 'react';
import { EmailCategory } from '../../hooks/useEmailCategoryData';
import { usePersistentCategoryOrder } from '../../hooks/usePersistentCategoryOrder';
import AccordionCategoryRow from './AccordionCategoryRow';

interface EmailCategoryGridContentProps {
  priorityCategories: EmailCategory[];
  compactCategories: EmailCategory[];
  addButtonInFirstRow: boolean;
  addButtonInCompactRows: boolean;
  onAddNewCategory: () => void;
  onExpandedChange?: (allExpanded: boolean) => void;
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
  onAddNewCategory,
  onExpandedChange
}, ref) => {
  const allCategories = [...priorityCategories, ...compactCategories];
  const { orderedCategories, handleReorder } = usePersistentCategoryOrder(allCategories);
  
  // State to track which cards are expanded - first 3 categories (first row) default to open
  const [expandedCards, setExpandedCards] = useState<Set<string>>(() => {
    const firstThreeCategories = orderedCategories.slice(0, 3);
    return new Set(firstThreeCategories.map(cat => cat.id));
  });

  // Check if all CURRENTLY DISPLAYED cards are expanded (relative to what's on this page)
  const allExpanded = useMemo(() => {
    if (orderedCategories.length === 0) return false;
    // Only check against categories that are actually displayed on this page
    return orderedCategories.every(cat => expandedCards.has(cat.id));
  }, [expandedCards, orderedCategories]);

  // Notify parent whenever allExpanded state changes
  useEffect(() => {
    onExpandedChange?.(allExpanded);
  }, [allExpanded, onExpandedChange]);

  // Functions to control accordion for ONLY the categories displayed on this page
  const openAll = useCallback(() => {
    // Only expand the categories currently displayed on this page
    setExpandedCards(new Set(orderedCategories.map(cat => cat.id)));
  }, [orderedCategories]);

  const closeAll = useCallback(() => {
    // Only close the categories currently displayed on this page
    const currentPageCategoryIds = new Set(orderedCategories.map(cat => cat.id));
    setExpandedCards(prev => {
      const newSet = new Set(prev);
      // Remove only the categories that are on the current page
      currentPageCategoryIds.forEach(id => newSet.delete(id));
      return newSet;
    });
  }, [orderedCategories]);

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
  }), [openAll, closeAll, toggleAll, allExpanded]);

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
