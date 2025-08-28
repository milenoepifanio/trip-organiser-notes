import { useState } from 'react';
import { ChevronRight, ChevronDown, Folder, FolderOpen, FileText, Plus, MoreHorizontal } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { TravelFolder } from '@/types/travel';

interface FolderTreeProps {
  parentId?: string;
  level?: number;
}

export function FolderTree({ parentId, level = 0 }: FolderTreeProps) {
  const {
    getFoldersByParent,
    getNotesByFolder,
    createFolder,
    createNote,
    updateFolder,
    deleteFolder,
    deleteNote,
    selectedFolderId,
    selectedNoteId,
    setSelectedFolderId,
    setSelectedNoteId,
  } = useSupabaseData();

  const [expandedFolders, setExpandedFolders] = useState<Set<string>>(new Set());
  const [editingFolder, setEditingFolder] = useState<string | null>(null);
  const [editingName, setEditingName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState<string | null>(null);
  const [newFolderName, setNewFolderName] = useState('');

  const folders = getFoldersByParent(parentId);
  console.log(`FolderTree level ${level}, parentId: ${parentId}, folders:`, folders.length, folders.map(f => ({ id: f.id, name: f.name })));

  const toggleFolder = (folderId: string) => {
    const newExpanded = new Set(expandedFolders);
    if (newExpanded.has(folderId)) {
      newExpanded.delete(folderId);
    } else {
      newExpanded.add(folderId);
    }
    setExpandedFolders(newExpanded);
  };

  const startEditingFolder = (folder: TravelFolder) => {
    setEditingFolder(folder.id);
    setEditingName(folder.name);
  };

  const saveEditingFolder = () => {
    if (editingFolder && editingName.trim()) {
      updateFolder(editingFolder, { name: editingName.trim() });
    }
    setEditingFolder(null);
    setEditingName('');
  };

  const startCreatingFolder = (parentId?: string) => {
    setCreatingFolder(parentId || 'root');
    setNewFolderName('');
  };

  const saveNewFolder = async () => {
    if (newFolderName.trim()) {
      console.log('Criando pasta filha:', { name: newFolderName.trim(), parentId: creatingFolder === 'root' ? undefined : creatingFolder });
      const newFolder = await createFolder(newFolderName.trim(), creatingFolder === 'root' ? undefined : creatingFolder);
      console.log('Resultado da criação da pasta filha:', newFolder);
      if (newFolder) {
        setExpandedFolders(prev => new Set(prev).add(newFolder.id));
      }
    }
    setCreatingFolder(null);
    setNewFolderName('');
  };

  const handleCreateNote = (folderId: string) => {
    const noteName = `Nova Nota ${new Date().toLocaleDateString()}`;
    const newNote = createNote(noteName, folderId);
    setSelectedNoteId(newNote.id);
    setSelectedFolderId(folderId);
  };

  return (
    <div className="space-y-1">
      {folders.map((folder) => {
        const isExpanded = expandedFolders.has(folder.id);
        const isSelected = selectedFolderId === folder.id;
        const notes = getNotesByFolder(folder.id);
        const hasChildren = getFoldersByParent(folder.id).length > 0;

        return (
          <div key={folder.id} className="relative">
            <div 
              className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 group ${
                isSelected ? 'bg-ocean/10 text-ocean border border-ocean/20' : 'hover:bg-muted/50'
              }`}
              style={{ paddingLeft: `${level * 1.5 + 0.5}rem` }}
            >
              <Button
                variant="ghost"
                size="sm"
                className="h-6 w-6 p-0 hover:bg-ocean/10"
                onClick={() => toggleFolder(folder.id)}
              >
                {hasChildren ? (
                  isExpanded ? <ChevronDown className="h-4 w-4" /> : <ChevronRight className="h-4 w-4" />
                ) : (
                  <div className="w-4 h-4" />
                )}
              </Button>

              <div 
                className="flex items-center gap-2 flex-1 min-w-0"
                onClick={() => setSelectedFolderId(folder.id)}
              >
                {isExpanded ? (
                  <FolderOpen className="h-4 w-4 text-ocean flex-shrink-0" />
                ) : (
                  <Folder className="h-4 w-4 text-ocean flex-shrink-0" />
                )}
                
                {editingFolder === folder.id ? (
                  <Input
                    value={editingName}
                    onChange={(e) => setEditingName(e.target.value)}
                    onBlur={saveEditingFolder}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter') saveEditingFolder();
                      if (e.key === 'Escape') {
                        setEditingFolder(null);
                        setEditingName('');
                      }
                    }}
                    className="h-6 px-2 text-sm"
                    autoFocus
                  />
                ) : (
                  <span className="text-sm font-medium truncate">{folder.name}</span>
                )}
              </div>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  >
                    <MoreHorizontal className="h-4 w-4" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-48">
                  <DropdownMenuItem onClick={() => startCreatingFolder(folder.id)}>
                    <Plus className="h-4 w-4 mr-2" />
                    Nova Pasta
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => handleCreateNote(folder.id)}>
                    <FileText className="h-4 w-4 mr-2" />
                    Nova Nota
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => startEditingFolder(folder)}>
                    Renomear
                  </DropdownMenuItem>
                  <DropdownMenuItem 
                    onClick={() => deleteFolder(folder.id)}
                    className="text-destructive focus:text-destructive"
                  >
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>

            {/* Creating new folder */}
            {creatingFolder === folder.id && (
              <div 
                className="flex items-center gap-2 p-2 mt-1"
                style={{ paddingLeft: `${(level + 1) * 1.5 + 0.5}rem` }}
              >
                <div className="w-6" />
                <Folder className="h-4 w-4 text-muted-foreground" />
                <Input
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  onBlur={saveNewFolder}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter') saveNewFolder();
                    if (e.key === 'Escape') {
                      setCreatingFolder(null);
                      setNewFolderName('');
                    }
                  }}
                  placeholder="Nome da pasta..."
                  className="h-6 px-2 text-sm"
                  autoFocus
                />
              </div>
            )}

            {/* Notes in this folder */}
            {isExpanded && notes.map((note) => (
              <div
                key={note.id}
                className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer transition-all duration-200 group ${
                  selectedNoteId === note.id ? 'bg-nature/10 text-nature border border-nature/20' : 'hover:bg-muted/30'
                }`}
                style={{ paddingLeft: `${(level + 1) * 1.5 + 0.5}rem` }}
                onClick={() => {
                  setSelectedNoteId(note.id);
                  setSelectedFolderId(folder.id);
                }}
              >
                <div className="w-6" />
                <FileText className="h-4 w-4 text-nature flex-shrink-0" />
                <span className="text-sm truncate flex-1">{note.title}</span>
                
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={() => deleteNote(note.id)}
                      className="text-destructive focus:text-destructive"
                    >
                      Excluir Nota
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            ))}

            {/* Subfolders */}
            {isExpanded && (
              <FolderTree parentId={folder.id} level={level + 1} />
            )}
          </div>
        );
      })}

      {/* Creating new folder at root level */}
      {creatingFolder === 'root' && level === 0 && (
        <div className="flex items-center gap-2 p-2">
          <div className="w-6" />
          <Folder className="h-4 w-4 text-muted-foreground" />
          <Input
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            onBlur={saveNewFolder}
            onKeyDown={(e) => {
              if (e.key === 'Enter') saveNewFolder();
              if (e.key === 'Escape') {
                setCreatingFolder(null);
                setNewFolderName('');
              }
            }}
            placeholder="Nome da pasta..."
            className="h-6 px-2 text-sm"
            autoFocus
          />
        </div>
      )}

      {/* Add folder button for root level */}
      {level === 0 && creatingFolder !== 'root' && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => startCreatingFolder()}
          className="w-full justify-start gap-2 text-muted-foreground hover:text-ocean hover:bg-ocean/5"
        >
          <Plus className="h-4 w-4" />
          Nova Pasta de Viagem
        </Button>
      )}
    </div>
  );
}