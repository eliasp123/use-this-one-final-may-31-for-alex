
import React from 'react';
import EmailCategoryGridPagination from './EmailCategoryGridPagination';
import EmailCategoryViewToggle from './EmailCategoryViewToggle';

interface EmailCategoryGridHeaderProps {
  activePage: number;
  totalPages: number;
  showPagination: boolean;
  onPageChange: (page: number) => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const EmailCategoryGridHeader: React.FC<EmailCategoryGridHeaderProps> = ({
  activePage,
  totalPages,
  showPagination,
  onPageChange,
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="text-center space-y-4">
      <div className="flex items-center justify-center">
        <EmailCategoryViewToggle 
          viewMode={viewMode}
          onViewModeChange={onViewModeChange}
        />
      </div>
      
      <EmailCategoryGridPagination
        activePage={activePage}
        totalPages={totalPages}
        showPagination={showPagination}
        onPageChange={onPageChange}
      />
    </div>
  );
};

export default EmailCategoryGridHeader;
