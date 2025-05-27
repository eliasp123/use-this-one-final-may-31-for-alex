
import React from 'react';

interface EmailCategoryViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const EmailCategoryViewToggle: React.FC<EmailCategoryViewToggleProps> = ({
  viewMode,
  onViewModeChange
}) => {
  return (
    <div className="inline-flex items-center gap-1 text-sm text-gray-600">
      <span 
        className={`px-2 py-1 rounded cursor-pointer transition-colors ${
          viewMode === 'grid' 
            ? 'bg-gray-100 text-gray-800' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onViewModeChange('grid')}
      >
        Grid
      </span>
      <span className="text-gray-400">|</span>
      <span 
        className={`px-2 py-1 rounded cursor-pointer transition-colors ${
          viewMode === 'list' 
            ? 'bg-gray-100 text-gray-800' 
            : 'hover:bg-gray-50'
        }`}
        onClick={() => onViewModeChange('list')}
      >
        List
      </span>
    </div>
  );
};

export default EmailCategoryViewToggle;
