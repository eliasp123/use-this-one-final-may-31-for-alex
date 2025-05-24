
import React from 'react';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { LayoutGrid, LayoutList, ArrowDown, ArrowUp } from 'lucide-react';

interface DocumentsViewToggleProps {
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  directionFilter: 'all' | 'received' | 'sent';
  onDirectionFilterChange: (direction: 'all' | 'received' | 'sent') => void;
}

const DocumentsViewToggle = ({ 
  viewMode, 
  onViewModeChange, 
  directionFilter, 
  onDirectionFilterChange 
}: DocumentsViewToggleProps) => {
  return (
    <div className="flex justify-center mb-8">
      <div className="flex gap-8 items-center">
        {/* View Mode Toggle */}
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}
          className="border border-gray-200 rounded-lg p-1.5 bg-white shadow-md"
        >
          <ToggleGroupItem 
            value="grid" 
            aria-label="Grid view"
            className="px-4 py-2.5 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200"
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Grid</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="list" 
            aria-label="List view"
            className="px-4 py-2.5 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200"
          >
            <LayoutList className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">List</span>
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Direction Filter Toggle */}
        <ToggleGroup 
          type="single" 
          value={directionFilter} 
          onValueChange={(value) => value && onDirectionFilterChange(value as 'all' | 'received' | 'sent')}
          className="border border-gray-200 rounded-lg p-1.5 bg-white shadow-md"
        >
          <ToggleGroupItem 
            value="received" 
            aria-label="Received documents"
            className="px-4 py-2.5 rounded-md data-[state=on]:bg-green-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Received</span>
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="sent" 
            aria-label="Sent documents"
            className="px-4 py-2.5 rounded-md data-[state=on]:bg-orange-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200"
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            <span className="text-sm font-medium">Sent</span>
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default DocumentsViewToggle;
