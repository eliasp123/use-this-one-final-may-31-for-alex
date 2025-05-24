
import React from 'react';
import { Button } from '../ui/button';
import { FileText, FolderOpen, FileSpreadsheet, Image, User, Users, Calendar } from 'lucide-react';

interface FilterOption {
  key: string;
  label: string;
  icon: any;
}

interface DocumentsFilterButtonsProps {
  selectedFilter: string;
  onFilterChange: (filter: string) => void;
  getFilterCount: (filterType: string) => number;
}

const DocumentsFilterButtons = ({ selectedFilter, onFilterChange, getFilterCount }: DocumentsFilterButtonsProps) => {
  const filterOptions: FilterOption[] = [
    { key: 'all', label: 'All Files', icon: FolderOpen },
    { key: 'documents', label: 'Documents', icon: FileText },
    { key: 'images', label: 'Images', icon: Image },
    { key: 'spreadsheets', label: 'Spreadsheets', icon: FileSpreadsheet },
    { key: 'person', label: 'Person', icon: User },
    { key: 'organization', label: 'Organization', icon: Users },
    { key: 'date', label: 'Date', icon: Calendar }
  ];

  return (
    <div className="mb-12 sm:mb-16">
      <div className="w-full max-w-7xl mx-auto">
        <div className="grid grid-cols-7 gap-3">
          {filterOptions.map((filter) => {
            const IconComponent = filter.icon;
            const count = getFilterCount(filter.key);
            return (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? "default" : "outline"}
                onClick={() => onFilterChange(filter.key)}
                className={`
                  px-3 py-3 rounded-lg font-medium transition-all duration-200 flex flex-col items-center h-16 w-full
                  ${selectedFilter === filter.key 
                    ? "bg-purple-500 hover:bg-purple-600 text-white shadow-md" 
                    : "bg-white text-gray-700 border-gray-200 hover:bg-gray-50"
                  }
                `}
              >
                <div className="flex items-center gap-1">
                  <IconComponent className="h-4 w-4" />
                  <span className="text-xs">{filter.label}</span>
                </div>
                <span className="text-xs font-bold mt-1">{count}</span>
              </Button>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default DocumentsFilterButtons;
