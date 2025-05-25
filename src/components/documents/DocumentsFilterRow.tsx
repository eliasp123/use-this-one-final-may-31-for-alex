
import React from 'react';
import { Button } from '../ui/button';
import { ToggleGroup, ToggleGroupItem } from '../ui/toggle-group';
import { LayoutGrid, LayoutList, ArrowDown, ArrowUp, Users, Calendar, Building } from 'lucide-react';

interface DocumentsFilterRowProps {
  selectedFilter: 'all' | 'person' | 'organization' | 'date';
  onFilterChange: (filter: 'all' | 'person' | 'organization' | 'date') => void;
  viewMode: 'grid' | 'list';
  onViewModeChange: (mode: 'grid' | 'list') => void;
  directionFilter: 'all' | 'received' | 'sent';
  onDirectionFilterChange: (direction: 'all' | 'received' | 'sent') => void;
  getFilterCount: (filterType: string) => number;
}

const DocumentsFilterRow = ({ 
  selectedFilter, 
  onFilterChange, 
  viewMode, 
  onViewModeChange, 
  directionFilter, 
  onDirectionFilterChange,
  getFilterCount 
}: DocumentsFilterRowProps) => {
  const filters = [
    { key: 'person', label: 'Person', icon: Users },
    { key: 'organization', label: 'Organization', icon: Building },
    { key: 'date', label: 'Month', icon: Calendar }
  ];

  return (
    <div className="flex flex-col lg:flex-row gap-6 items-start lg:items-center justify-between mb-8 bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60">
      {/* Left Side - Filters */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center">
        <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</span>
        <div className="flex gap-2">
          {filters.map(filter => {
            const IconComponent = filter.icon;
            const count = getFilterCount(filter.key);
            return (
              <Button
                key={filter.key}
                variant={selectedFilter === filter.key ? 'default' : 'outline'}
                size="sm"
                onClick={() => onFilterChange(filter.key as any)}
                className={`
                  px-4 py-2 rounded-xl font-medium transition-all duration-200
                  ${selectedFilter === filter.key 
                    ? "bg-gradient-to-r from-purple-500 to-purple-600 hover:from-purple-600 hover:to-purple-700 text-white shadow-lg shadow-purple-500/25" 
                    : "bg-white/80 hover:bg-white text-gray-700 border-gray-300/60 hover:border-purple-300"
                  }
                `}
              >
                <IconComponent className="h-4 w-4 mr-2" />
                {filter.label}
                <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
                  {count}
                </span>
              </Button>
            );
          })}
        </div>
      </div>

      {/* Right Side - View Controls */}
      <div className="flex gap-4 items-center">
        {/* View Mode Toggle - moved to left */}
        <ToggleGroup 
          type="single" 
          value={viewMode} 
          onValueChange={(value) => value && onViewModeChange(value as 'grid' | 'list')}
          className="border border-gray-200 rounded-lg p-1.5 bg-white shadow-sm"
        >
          <ToggleGroupItem 
            value="grid" 
            aria-label="Grid view"
            className="px-3 py-2 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            <LayoutGrid className="h-3 w-3 mr-1" />
            Grid
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="list" 
            aria-label="List view"
            className="px-3 py-2 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            <LayoutList className="h-3 w-3 mr-1" />
            List
          </ToggleGroupItem>
        </ToggleGroup>

        {/* Separator */}
        <div className="text-gray-300 text-lg">|</div>

        {/* Direction Filter Toggle - moved to right */}
        <ToggleGroup 
          type="single" 
          value={directionFilter} 
          onValueChange={(value) => value && onDirectionFilterChange(value as 'all' | 'received' | 'sent')}
          className="border border-gray-200 rounded-lg p-1.5 bg-white shadow-sm"
        >
          <ToggleGroupItem 
            value="all" 
            aria-label="All documents"
            className="px-3 py-2 rounded-md data-[state=on]:bg-blue-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            All
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="received" 
            aria-label="Received documents"
            className="px-3 py-2 rounded-md data-[state=on]:bg-green-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            <ArrowDown className="h-3 w-3 mr-1" />
            Received
          </ToggleGroupItem>
          <ToggleGroupItem 
            value="sent" 
            aria-label="Sent documents"
            className="px-3 py-2 rounded-md data-[state=on]:bg-orange-500 data-[state=on]:text-white hover:bg-gray-50 transition-all duration-200 text-sm"
          >
            <ArrowUp className="h-3 w-3 mr-1" />
            Sent
          </ToggleGroupItem>
        </ToggleGroup>
      </div>
    </div>
  );
};

export default DocumentsFilterRow;
