
import React from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AutocompleteSearch from '@/components/AutocompleteSearch';

interface EmailListToolbarProps {
  activeTab: string;
  onTabChange: (value: string) => void;
  searchQuery: string;
  onSearch: (query: string) => void;
}

const EmailListToolbar: React.FC<EmailListToolbarProps> = ({
  activeTab,
  onTabChange,
  searchQuery,
  onSearch
}) => {
  return (
    <div className="mb-6">
      <div className="flex justify-between items-center">
        <Tabs defaultValue={activeTab} onValueChange={onTabChange}>
          <TabsList className="bg-slate-100/70 p-1 rounded-xl shadow-sm">
            <TabsTrigger 
              value="all" 
              className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800 rounded-lg transition-all"
            >
              All
            </TabsTrigger>
            <TabsTrigger 
              value="unread" 
              className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800 rounded-lg transition-all"
            >
              Unread
            </TabsTrigger>
            <TabsTrigger 
              value="pending" 
              className="data-[state=active]:bg-amber-100 data-[state=active]:text-amber-800 rounded-lg transition-all"
            >
              Pending
            </TabsTrigger>
            <TabsTrigger 
              value="unresponded" 
              className="data-[state=active]:bg-rose-100 data-[state=active]:text-rose-800 rounded-lg transition-all"
            >
              Not Responded
            </TabsTrigger>
          </TabsList>
        </Tabs>
        
        {/* Search */}
        <div className="w-64">
          <AutocompleteSearch onSearch={onSearch} initialValue={searchQuery} />
        </div>
      </div>
    </div>
  );
};

export default EmailListToolbar;
