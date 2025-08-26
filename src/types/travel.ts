export interface TravelFolder {
  id: string;
  name: string;
  parentId?: string;
  children: TravelFolder[];
  notes: TravelNote[];
  createdAt: Date;
  updatedAt: Date;
}

export interface TravelNote {
  id: string;
  title: string;
  content: string;
  folderId: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface FolderTreeItem {
  id: string;
  name: string;
  type: 'folder' | 'note';
  parentId?: string;
  children?: FolderTreeItem[];
}