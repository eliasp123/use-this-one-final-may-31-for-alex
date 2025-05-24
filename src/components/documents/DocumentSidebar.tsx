
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu
} from '../ui/sidebar';
import { DocumentFolder, getAllFolders, getFoldersByParent, getDocumentsInFolder, createFolder } from '../../utils/folderUtils';
import FolderItem from './FolderItem';

interface DocumentSidebarProps {
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
  onCreateFolder: (name: string) => void;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({ 
  selectedFolderId, 
  onFolderSelect,
  onCreateFolder
}) => {
  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());

  const allFolders = getAllFolders();
  const rootFolders = getFoldersByParent(null);

  const toggleExpanded = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const getDocumentCount = (folderId: string): number => {
    return getDocumentsInFolder(folderId).length;
  };

  const renderFolderTree = (folders: DocumentFolder[], level: number = 0): React.ReactNode[] => {
    return folders.map(folder => {
      const childFolders = getFoldersByParent(folder.id);
      const hasChildren = childFolders.length > 0;
      const isExpanded = expandedFolders.has(folder.id);
      const documentCount = getDocumentCount(folder.id);

      return (
        <React.Fragment key={folder.id}>
          <FolderItem
            folder={folder}
            isActive={selectedFolderId === folder.id}
            isExpanded={isExpanded}
            documentCount={documentCount}
            onSelect={onFolderSelect}
            onToggleExpand={toggleExpanded}
            level={level}
          />
          {hasChildren && isExpanded && renderFolderTree(childFolders, level + 1)}
        </React.Fragment>
      );
    });
  };

  return (
    <Sidebar variant="sidebar" className="min-w-[240px] max-w-[280px]">
      <SidebarContent className="pt-4">
        <SidebarGroup>
          <SidebarMenu className="space-y-1">
            {/* All Files option */}
            <FolderItem
              folder={{
                id: 'all',
                name: 'All Files',
                parentId: null,
                createdAt: '',
                color: 'from-gray-400 to-gray-500'
              }}
              isActive={selectedFolderId === null}
              isExpanded={false}
              documentCount={0}
              onSelect={() => onFolderSelect(null)}
              onToggleExpand={() => {}}
              level={0}
            />
            
            {/* Folder tree */}
            {renderFolderTree(rootFolders)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DocumentSidebar;
