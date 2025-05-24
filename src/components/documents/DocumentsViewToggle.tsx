
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { LayoutGrid, LayoutList } from 'lucide-react';

interface DocumentsViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const DocumentsViewToggle = ({ viewMode, onViewModeChange }: DocumentsViewToggleProps) => {
  return (
    <div className="flex justify-center mb-8">
      <ToggleGroup 
        type="single" 
        value={viewMode} 
        onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}
        className="border border-gray-200 rounded-lg p-1.5 bg-white shadow-md"
      >
        <ToggleGroupItem 
          value="grid" 
          aria-label="Grid view"
          className="px-5 py-3 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200"
        >
          <LayoutGrid className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">Grid</span>
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="list" 
          aria-label="List view"
          className="px-5 py-3 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200"
        >
          <LayoutList className="h-5 w-5 mr-2" />
          <span className="text-sm font-medium">List</span>
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default DocumentsViewToggle;
