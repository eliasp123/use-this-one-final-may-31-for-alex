
import React from 'react';
import EmailCategoryGridPagination from './EmailCategoryGridPagination';

interface EmailCategoryGridHeaderProps {
  activePage: number;
  totalPages: number;
  showPagination: boolean;
  onPageChange: (page: number) => void;
}

const EmailCategoryGridHeader: React.FC<EmailCategoryGridHeaderProps> = ({
  activePage,
  totalPages,
  showPagination,
  onPageChange
}) => {
  return (
    <div className="text-center space-y-4">
      <h2 className="text-lg font-medium text-gray-800">Organized Emails For Your Review</h2>
      
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
