import { useState } from 'react';
import { Search, Plus, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { useTravelData } from '@/hooks/useTravelData';

export function ModernSidebar() {
  const { createFolder, folders, getNotesByFolder, setSelectedFolderId, selectedFolderId } = useTravelData();
  const [searchTerm, setSearchTerm] = useState('');

  const handleCreateRootFolder = () => {
    const folderName = `Viagem ${new Date().toLocaleDateString()}`;
    createFolder(folderName);
  };

  const filteredFolders = folders.filter(folder => 
    !folder.parentId && folder.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="w-full md:w-64 lg:w-80 bg-muted/30 border-r border-border">
      <div className="p-4">
        <div className="relative">
          <Input
            type="text"
            placeholder="Pesquisar pastas e notas..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full pl-10 pr-4 py-2 rounded-lg border border-input focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
          />
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-muted-foreground" />
        </div>
        <Button 
          onClick={handleCreateRootFolder}
          className="mt-4 w-full bg-primary hover:bg-primary-hover text-primary-foreground py-2 px-4 rounded-lg flex items-center justify-center transition-all duration-300"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Pasta
        </Button>
      </div>

      <div className="p-2">
        <h2 className="font-medium text-foreground ml-2 mb-2">Minhas Viagens</h2>
        <ScrollArea className="h-[calc(100vh-12rem)]">
          <ul className="space-y-1">
            {filteredFolders.length === 0 ? (
              <div className="text-center py-12">
                <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
                  <Folder className="h-8 w-8 text-muted-foreground" />
                </div>
                <p className="text-sm text-muted-foreground mb-4">
                  Nenhuma viagem ainda
                </p>
                <Button 
                  variant="outline" 
                  size="sm"
                  onClick={handleCreateRootFolder}
                  className="hover:bg-primary/5 hover:border-primary"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Criar primeira viagem
                </Button>
              </div>
            ) : (
              filteredFolders.map((folder) => {
                const notesCount = getNotesByFolder(folder.id).length;
                const isSelected = selectedFolderId === folder.id;
                
                return (
                  <li key={folder.id} className={isSelected ? "bg-primary/10 rounded-lg" : ""}>
                    <button 
                      onClick={() => setSelectedFolderId(folder.id)}
                      className="w-full py-2.5 px-3 flex items-center justify-between hover:bg-muted rounded-lg transition-all duration-300"
                    >
                      <div className="flex items-center">
                        <Folder className={`mr-3 h-4 w-4 ${isSelected ? 'text-primary' : 'text-muted-foreground'}`} />
                        <span className={isSelected ? "font-medium text-primary" : "text-foreground"}>{folder.name}</span>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${isSelected ? 'bg-primary/20 text-primary' : 'bg-muted text-muted-foreground'}`}>
                        {notesCount}
                      </span>
                    </button>
                  </li>
                );
              })
            )}
          </ul>
        </ScrollArea>
      </div>
    </div>
  );
}