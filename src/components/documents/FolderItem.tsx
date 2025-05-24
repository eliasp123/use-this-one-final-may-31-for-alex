
import React from 'react';
import { Badge } from '../ui/badge';
import { SidebarMenuItem, SidebarMenuButton } from '../ui/sidebar';
import { DocumentFolder } from '../../utils/folderUtils';
import { Folder, ChevronRight, ChevronDown } from 'lucide-react';

interface FolderItemProps {
  folder: DocumentFolder;
  isActive: boolean;
  isExpanded: boolean;
  documentCount: number;
  onSelect: (folderId: string) => void;
  onToggleExpand: (folderId: string) => void;
  level: number;
}

const FolderItem: React.FC<FolderItemProps> = ({ 
  folder, 
  isActive, 
  isExpanded,
  documentCount,
  onSelect, 
  onToggleExpand,
  level 
}) => {
  const handleClick = () => {
    onSelect(folder.id);
  };

  const handleToggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    onToggleExpand(folder.id);
  };

  return (
    <SidebarMenuItem>
      <SidebarMenuButton 
        isActive={isActive}
        onClick={handleClick}
        className="relative group"
        style={{ paddingLeft: `${0.5 + level * 1}rem` }}
      >
        <div className="flex items-center w-full">
          {level > 0 && (
            <button
              onClick={handleToggleExpand}
              className="mr-1 hover:bg-gray-100 rounded p-0.5"
            >
              {isExpanded ? (
                <ChevronDown className="w-3 h-3" />
              ) : (
                <ChevronRight className="w-3 h-3" />
              )}
            </button>
          )}
          
          <div className={`w-5 h-5 rounded-md bg-gradient-to-r ${folder.color} flex items-center justify-center mr-2`}>
            <Folder className="w-3 h-3 text-white" />
          </div>
          
          <span className="flex-1 truncate">{folder.name}</span>
          
          {documentCount > 0 && (
            <Badge 
              variant="secondary" 
              className="ml-2 bg-gray-100 text-gray-600 text-xs"
            >
              {documentCount}
            </Badge>
          )}
        </div>
      </SidebarMenuButton>
    </SidebarMenuItem>
  );
};

export default FolderItem;
