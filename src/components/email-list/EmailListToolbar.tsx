
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
          <TabsList>
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="unread">Unread</TabsTrigger>
            <TabsTrigger value="pending">Pending</TabsTrigger>
            <TabsTrigger value="unresponded">Not Responded</TabsTrigger>
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
