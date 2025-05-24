
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { LayoutGrid, LayoutList } from 'lucide-react';

interface DocumentsViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
}

const DocumentsViewToggle = ({ viewMode, onViewModeChange }: DocumentsViewToggleProps) => {
  return (
    <div className="flex justify-end mb-6">
      <ToggleGroup 
        type="single" 
        value={viewMode} 
        onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}
        className="border border-gray-200 rounded-lg p-1 bg-white shadow-sm"
      >
        <ToggleGroupItem 
          value="grid" 
          aria-label="Grid view"
          className="px-3 py-2 rounded-md data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 hover:bg-gray-50"
        >
          <LayoutGrid className="h-4 w-4" />
        </ToggleGroupItem>
        <ToggleGroupItem 
          value="list" 
          aria-label="List view"
          className="px-3 py-2 rounded-md data-[state=on]:bg-blue-50 data-[state=on]:text-blue-600 hover:bg-gray-50"
        >
          <LayoutList className="h-4 w-4" />
        </ToggleGroupItem>
      </ToggleGroup>
    </div>
  );
};

export default DocumentsViewToggle;
