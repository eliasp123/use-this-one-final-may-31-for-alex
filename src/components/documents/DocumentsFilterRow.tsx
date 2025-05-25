
import React from 'react';
import { Button } from '../ui/button';
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
  return (
    <div className="w-full max-w-7xl mx-auto pt-8 mb-8">
      <div className="flex items-stretch h-16">
        {/* Single card containing all controls */}
        <div className="bg-white/50 backdrop-blur-sm rounded-2xl border border-gray-200/60 shadow-lg flex items-stretch w-full">
          {/* Filter by label with purple background */}
          <div className="bg-gradient-to-r from-purple-500 to-purple-500 text-white flex-1 rounded-l-2xl flex items-center justify-center h-full">
            Filter by:
          </div>

          {/* Person Filter */}
          <button
            onClick={() => onFilterChange('person')}
            className={`flex items-center justify-center flex-[2] transition-all duration-200 h-full ${
              selectedFilter === 'person' 
                ? "bg-gradient-to-r from-purple-500 to-purple-500 text-white shadow-lg shadow-purple-500/25" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Users className="h-4 w-4 mr-2" />
            Person
            <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
              {getFilterCount('person')}
            </span>
          </button>

          {/* Organization Filter */}
          <button
            onClick={() => onFilterChange('organization')}
            className={`flex items-center justify-center flex-[2] transition-all duration-200 h-full ${
              selectedFilter === 'organization' 
                ? "bg-gradient-to-r from-purple-500 to-purple-500 text-white shadow-lg shadow-purple-500/25" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Building className="h-4 w-4 mr-2" />
            Organization
            <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
              {getFilterCount('organization')}
            </span>
          </button>

          {/* Month Filter */}
          <button
            onClick={() => onFilterChange('date')}
            className={`flex items-center justify-center flex-[2] transition-all duration-200 h-full ${
              selectedFilter === 'date' 
                ? "bg-gradient-to-r from-purple-500 to-purple-500 text-white shadow-lg shadow-purple-500/25" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <Calendar className="h-4 w-4 mr-2" />
            Month
            <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
              {getFilterCount('date')}
            </span>
          </button>

          {/* Subtle separator before view controls */}
          <div className="w-px bg-gray-200/40 mx-2"></div>

          {/* Grid Toggle */}
          <button
            onClick={() => onViewModeChange('grid')}
            className={`flex items-center justify-center flex-1 transition-all duration-200 h-full ${
              viewMode === 'grid' 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutGrid className="h-4 w-4 mr-2" />
            Grid
          </button>

          {/* List Toggle */}
          <button
            onClick={() => onViewModeChange('list')}
            className={`flex items-center justify-center flex-1 transition-all duration-200 h-full ${
              viewMode === 'list' 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <LayoutList className="h-4 w-4 mr-2" />
            List
          </button>

          {/* Subtle separator before direction filters */}
          <div className="w-px bg-gray-200/40 mx-1"></div>

          {/* All Direction */}
          <button
            onClick={() => onDirectionFilterChange('all')}
            className={`flex items-center justify-center flex-1 transition-all duration-200 h-full ${
              directionFilter === 'all' 
                ? "text-blue-600 bg-blue-50" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            All
          </button>

          {/* Received Direction */}
          <button
            onClick={() => onDirectionFilterChange('received')}
            className={`flex items-center justify-center flex-1 transition-all duration-200 h-full ${
              directionFilter === 'received' 
                ? "text-green-600 bg-green-50" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ArrowDown className="h-4 w-4 mr-2" />
            Received
          </button>

          {/* Sent Direction */}
          <button
            onClick={() => onDirectionFilterChange('sent')}
            className={`flex items-center justify-center flex-1 transition-all duration-200 h-full rounded-r-2xl ${
              directionFilter === 'sent' 
                ? "text-orange-600 bg-orange-50" 
                : "text-gray-700 hover:bg-gray-50"
            }`}
          >
            <ArrowUp className="h-4 w-4 mr-2" />
            Sent
          </button>
        </div>
      </div>
    </div>
  );
};

export default DocumentsFilterRow;
