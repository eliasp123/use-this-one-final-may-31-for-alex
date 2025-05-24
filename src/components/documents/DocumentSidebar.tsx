
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

  // Create array of all folder items for spacing calculation
  const defaultFolders = [
    {
      id: 'all',
      name: 'All Files',
      parentId: null,
      createdAt: '',
      color: 'from-purple-400 to-purple-500'
    },
    {
      id: 'insurance',
      name: 'Insurance',
      parentId: null,
      createdAt: '',
      color: 'from-blue-400 to-blue-500'
    },
    {
      id: 'medical',
      name: 'Medical',
      parentId: null,
      createdAt: '',
      color: 'from-emerald-400 to-emerald-500'
    },
    {
      id: 'legal',
      name: 'Legal',
      parentId: null,
      createdAt: '',
      color: 'from-purple-400 to-purple-500'
    },
    {
      id: 'finances',
      name: 'Finances',
      parentId: null,
      createdAt: '',
      color: 'from-amber-400 to-orange-500'
    },
    {
      id: 'discounts',
      name: 'Discounts',
      parentId: null,
      createdAt: '',
      color: 'from-rose-400 to-pink-500'
    },
    {
      id: 'housing',
      name: 'Housing',
      parentId: null,
      createdAt: '',
      color: 'from-teal-400 to-teal-500'
    }
  ];

  return (
    <Sidebar variant="sidebar" className="min-w-[240px] max-w-[280px]">
      <SidebarContent className="pt-16">
        <SidebarGroup className="pt-8">
          {/* Create Folder Button moved higher with proper spacing */}
          <div className="px-3 mb-6">
            {isCreatingFolder ? (
              <div className="space-y-3">
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
                    className="h-7 text-xs flex-1 bg-purple-600 hover:bg-purple-700 text-white"
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
                className="flex items-center gap-2 h-8 w-full justify-start bg-purple-600 hover:bg-purple-700 text-white border-purple-600"
              >
                <FolderPlus className="w-4 h-4" />
                Create Folder
              </Button>
            )}
          </div>
          
          <SidebarMenu className="space-y-1">
            {/* Default Category Folders with 3-at-a-time spacing */}
            {defaultFolders.map((folder, index) => (
              <div key={folder.id}>
                <FolderItem
                  folder={folder}
                  isActive={selectedFolderId === folder.id}
                  isExpanded={false}
                  documentCount={folder.id === 'all' ? 0 : getDocumentCount(folder.id)}
                  onSelect={() => onFolderSelect(folder.id === 'all' ? null : folder.id)}
                  onToggleExpand={() => {}}
                  level={0}
                />
                {/* Add extra space every 3 items with increased spacing */}
                {(index + 1) % 3 === 0 && index < defaultFolders.length - 1 && (
                  <div className="h-8" />
                )}
              </div>
            ))}
            
            {/* Custom user-created folders */}
            {renderFolderTree(rootFolders)}
          </SidebarMenu>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  );
};

export default DocumentSidebar;
