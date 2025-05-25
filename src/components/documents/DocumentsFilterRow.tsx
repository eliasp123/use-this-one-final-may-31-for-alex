
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
      {/* Single button container spanning the width */}
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-lg flex items-center justify-center">
        {/* Filter by label with purple background */}
        <div className="bg-gradient-to-r from-purple-400 to-purple-400 text-white px-4 py-2 rounded-lg font-medium">
          Filter by:
        </div>

        <div className="text-gray-300 text-lg mx-3">|</div>

        {/* Person Filter */}
        <button
          onClick={() => onFilterChange('person')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedFilter === 'person' 
              ? "bg-gradient-to-r from-purple-400 to-purple-400 text-white shadow-lg shadow-purple-400/25" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Users className="h-4 w-4 mr-2" />
          Person
          <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
            {getFilterCount('person')}
          </span>
        </button>

        <div className="text-gray-300 text-lg mx-3">|</div>

        {/* Organization Filter */}
        <button
          onClick={() => onFilterChange('organization')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedFilter === 'organization' 
              ? "bg-gradient-to-r from-purple-400 to-purple-400 text-white shadow-lg shadow-purple-400/25" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Building className="h-4 w-4 mr-2" />
          Organization
          <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
            {getFilterCount('organization')}
          </span>
        </button>

        <div className="text-gray-300 text-lg mx-3">|</div>

        {/* Month Filter */}
        <button
          onClick={() => onFilterChange('date')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            selectedFilter === 'date' 
              ? "bg-gradient-to-r from-purple-400 to-purple-400 text-white shadow-lg shadow-purple-400/25" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <Calendar className="h-4 w-4 mr-2" />
          Month
          <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
            {getFilterCount('date')}
          </span>
        </button>

        <div className="text-gray-300 text-lg mx-3">|</div>

        {/* Grid Toggle */}
        <button
          onClick={() => onViewModeChange('grid')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            viewMode === 'grid' 
              ? "bg-blue-400 text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <LayoutGrid className="h-4 w-4 mr-2" />
          Grid
        </button>

        <div className="text-gray-300 text-lg mx-3">|</div>

        {/* List Toggle */}
        <button
          onClick={() => onViewModeChange('list')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            viewMode === 'list' 
              ? "bg-blue-400 text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <LayoutList className="h-4 w-4 mr-2" />
          List
        </button>

        <div className="text-gray-300 text-lg mx-3">|</div>

        {/* All Direction */}
        <button
          onClick={() => onDirectionFilterChange('all')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            directionFilter === 'all' 
              ? "bg-blue-400 text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          All
        </button>

        <div className="text-gray-300 text-lg mx-3">|</div>

        {/* Received Direction */}
        <button
          onClick={() => onDirectionFilterChange('received')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            directionFilter === 'received' 
              ? "bg-green-400 text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ArrowDown className="h-4 w-4 mr-2" />
          Received
        </button>

        <div className="text-gray-300 text-lg mx-3">|</div>

        {/* Sent Direction */}
        <button
          onClick={() => onDirectionFilterChange('sent')}
          className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
            directionFilter === 'sent' 
              ? "bg-orange-400 text-white" 
              : "text-gray-700 hover:bg-gray-50"
          }`}
        >
          <ArrowUp className="h-4 w-4 mr-2" />
          Sent
        </button>
      </div>
    </div>
  );
};

export default DocumentsFilterRow;
