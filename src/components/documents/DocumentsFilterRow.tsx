
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
    <div className="flex justify-center mb-8">
      <div className="bg-white/50 backdrop-blur-sm rounded-2xl p-6 border border-gray-200/60 shadow-lg">
        <div className="flex items-center gap-6">
          <span className="text-sm font-medium text-gray-700 whitespace-nowrap">Filter by:</span>
          
          {/* Single unified button container */}
          <div className="flex items-center bg-white rounded-xl border border-gray-300/60 p-3 shadow-sm">
            {/* Person Filter */}
            <button
              onClick={() => onFilterChange('person')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedFilter === 'person' 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Users className="h-4 w-4 mr-2" />
              Person
              <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
                {getFilterCount('person')}
              </span>
            </button>

            <div className="text-gray-300 text-lg mx-2">|</div>

            {/* Organization Filter */}
            <button
              onClick={() => onFilterChange('organization')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedFilter === 'organization' 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Building className="h-4 w-4 mr-2" />
              Organization
              <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
                {getFilterCount('organization')}
              </span>
            </button>

            <div className="text-gray-300 text-lg mx-2">|</div>

            {/* Month Filter */}
            <button
              onClick={() => onFilterChange('date')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                selectedFilter === 'date' 
                  ? "bg-gradient-to-r from-purple-500 to-purple-600 text-white shadow-lg shadow-purple-500/25" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <Calendar className="h-4 w-4 mr-2" />
              Month
              <span className="ml-2 text-xs bg-black/10 px-2 py-0.5 rounded-full">
                {getFilterCount('date')}
              </span>
            </button>

            <div className="text-gray-300 text-lg mx-2">|</div>

            {/* Grid/List Toggle */}
            <button
              onClick={() => onViewModeChange(viewMode === 'grid' ? 'list' : 'grid')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'grid' 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <LayoutGrid className="h-3 w-3 mr-1" />
              Grid
            </button>

            <span className="text-gray-400 mx-1">/</span>

            <button
              onClick={() => onViewModeChange(viewMode === 'list' ? 'grid' : 'list')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                viewMode === 'list' 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <LayoutList className="h-3 w-3 mr-1" />
              List
            </button>

            <div className="text-gray-300 text-lg mx-2">|</div>

            {/* Direction Filter Toggles */}
            <button
              onClick={() => onDirectionFilterChange('all')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                directionFilter === 'all' 
                  ? "bg-blue-500 text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              All
            </button>

            <span className="text-gray-400 mx-1">/</span>

            <button
              onClick={() => onDirectionFilterChange('received')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                directionFilter === 'received' 
                  ? "bg-green-500 text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ArrowDown className="h-3 w-3 mr-1" />
              Received
            </button>

            <span className="text-gray-400 mx-1">/</span>

            <button
              onClick={() => onDirectionFilterChange('sent')}
              className={`flex items-center px-4 py-2 rounded-lg font-medium transition-all duration-200 ${
                directionFilter === 'sent' 
                  ? "bg-orange-500 text-white" 
                  : "text-gray-700 hover:bg-gray-50"
              }`}
            >
              <ArrowUp className="h-3 w-3 mr-1" />
              Sent
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default DocumentsFilterRow;
