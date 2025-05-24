
export interface DocumentFolder {
  id: string;
  name: string;
  parentId: string | null;
  createdAt: string;
  color: string;
}

export interface FolderAssignment {
  documentId: string;
  emailId: string;
  folderId: string;
}

// Mock data for folders - in a real app this would come from a backend
const mockFolders: DocumentFolder[] = [
  {
    id: 'folder-1',
    name: 'Marketing Materials',
    parentId: null,
    createdAt: '2024-01-15T10:00:00Z',
    color: 'from-blue-500 to-blue-600'
  },
  {
    id: 'folder-2', 
    name: 'Financial Reports',
    parentId: null,
    createdAt: '2024-01-10T14:30:00Z',
    color: 'from-green-500 to-green-600'
  },
  {
    id: 'folder-3',
    name: 'Q1 2024',
    parentId: 'folder-2',
    createdAt: '2024-01-20T09:15:00Z',
    color: 'from-green-400 to-green-500'
  },
  {
    id: 'folder-4',
    name: 'Legal Documents', 
    parentId: null,
    createdAt: '2024-01-05T16:45:00Z',
    color: 'from-purple-500 to-purple-600'
  }
];

// Mock assignments - which documents are in which folders
const mockAssignments: FolderAssignment[] = [
  { documentId: 'att-1', emailId: 'email-1', folderId: 'folder-1' },
  { documentId: 'att-2', emailId: 'email-2', folderId: 'folder-2' },
  { documentId: 'att-5', emailId: 'email-3', folderId: 'folder-3' },
];

export const getAllFolders = (): DocumentFolder[] => {
  return mockFolders;
};

export const getFolderById = (id: string): DocumentFolder | undefined => {
  return mockFolders.find(folder => folder.id === id);
};

export const getFoldersByParent = (parentId: string | null): DocumentFolder[] => {
  return mockFolders.filter(folder => folder.parentId === parentId);
};

export const getDocumentFolder = (documentId: string, emailId: string): DocumentFolder | null => {
  const assignment = mockAssignments.find(
    a => a.documentId === documentId && a.emailId === emailId
  );
  if (!assignment) return null;
  return getFolderById(assignment.folderId) || null;
};

export const getDocumentsInFolder = (folderId: string): FolderAssignment[] => {
  return mockAssignments.filter(assignment => assignment.folderId === folderId);
};

export const createFolder = (name: string, parentId: string | null = null): DocumentFolder => {
  const colors = [
    'from-blue-500 to-blue-600',
    'from-green-500 to-green-600', 
    'from-purple-500 to-purple-600',
    'from-orange-500 to-orange-600',
    'from-pink-500 to-pink-600',
    'from-indigo-500 to-indigo-600'
  ];
  
  const newFolder: DocumentFolder = {
    id: `folder-${Date.now()}`,
    name,
    parentId,
    createdAt: new Date().toISOString(),
    color: colors[Math.floor(Math.random() * colors.length)]
  };
  
  mockFolders.push(newFolder);
  return newFolder;
};

export const assignDocumentToFolder = (documentId: string, emailId: string, folderId: string): void => {
  // Remove existing assignment
  const existingIndex = mockAssignments.findIndex(
    a => a.documentId === documentId && a.emailId === emailId
  );
  if (existingIndex >= 0) {
    mockAssignments.splice(existingIndex, 1);
  }
  
  // Add new assignment
  mockAssignments.push({ documentId, emailId, folderId });
};

export const removeDocumentFromFolder = (documentId: string, emailId: string): void => {
  const index = mockAssignments.findIndex(
    a => a.documentId === documentId && a.emailId === emailId
  );
  if (index >= 0) {
    mockAssignments.splice(index, 1);
  }
};
