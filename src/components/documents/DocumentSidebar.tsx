
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu,
  SidebarHeader
} from '../ui/sidebar';
import { DocumentFolder, getAllFolders, getFoldersByParent, getDocumentsInFolder, createFolder } from '../../utils/folderUtils';
import FolderItem from './FolderItem';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { FolderPlus } from 'lucide-react';

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
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');

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

  const handleCreateFolder = (name: string) => {
    if (name.trim()) {
      createFolder(name.trim());
      onCreateFolder(name.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFolder(newFolderName);
    } else if (e.key === 'Escape') {
      setIsCreatingFolder(false);
      setNewFolderName('');
    }
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
      <SidebarHeader className="pt-20 pb-4 px-4">
        <div className="space-y-3">
          <h3 className="text-sm font-semibold text-gray-800">Document Folders</h3>
          
          {isCreatingFolder ? (
            <div className="space-y-2">
              <Input
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm h-8"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={() => handleCreateFolder(newFolderName)}
                  disabled={!newFolderName.trim()}
                  className="h-7 text-xs flex-1"
                >
                  Create
                </Button>
                <Button 
                  size="sm" 
                  variant="outline" 
                  onClick={() => {
                    setIsCreatingFolder(false);
                    setNewFolderName('');
                  }}
                  className="h-7 text-xs flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          ) : (
            <Button
              variant="outline"
              size="sm"
              onClick={() => setIsCreatingFolder(true)}
              className="flex items-center gap-2 h-8 w-full justify-start"
            >
              <FolderPlus className="w-4 h-4" />
              Create Folder
            </Button>
          )}
        </div>
      </SidebarHeader>
      
      <SidebarContent>
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
