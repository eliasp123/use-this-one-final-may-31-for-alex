
import React, { useState } from 'react';
import { 
  Sidebar, 
  SidebarContent, 
  SidebarGroup, 
  SidebarMenu,
  SidebarHeader 
} from '../ui/sidebar';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { DocumentFolder, getAllFolders, getFoldersByParent, getDocumentsInFolder, createFolder } from '../../utils/folderUtils';
import FolderItem from './FolderItem';
import { Plus, FolderPlus } from 'lucide-react';

interface DocumentSidebarProps {
  selectedFolderId: string | null;
  onFolderSelect: (folderId: string | null) => void;
}

const DocumentSidebar: React.FC<DocumentSidebarProps> = ({ 
  selectedFolderId, 
  onFolderSelect 
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

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      createFolder(newFolderName.trim());
      setNewFolderName('');
      setIsCreatingFolder(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleCreateFolder();
    } else if (e.key === 'Escape') {
      setIsCreatingFolder(false);
      setNewFolderName('');
    }
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
    <Sidebar variant="sidebar" className="min-w-[280px] max-w-[320px]">
      <SidebarHeader className="p-4 border-b border-gray-200">
        <div className="space-y-3">
          <h3 className="font-semibold text-gray-800">Document Folders</h3>
          
          {isCreatingFolder ? (
            <div className="space-y-2">
              <Input
                placeholder="Folder name..."
                value={newFolderName}
                onChange={(e) => setNewFolderName(e.target.value)}
                onKeyDown={handleKeyDown}
                className="text-sm"
                autoFocus
              />
              <div className="flex gap-2">
                <Button 
                  size="sm" 
                  onClick={handleCreateFolder}
                  disabled={!newFolderName.trim()}
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
              className="w-full justify-start"
            >
              <FolderPlus className="w-4 h-4 mr-2" />
              Create Folder
            </Button>
          )}
        </div>
      </SidebarHeader>
      
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
