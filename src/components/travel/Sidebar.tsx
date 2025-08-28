import { MapPin, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { FolderTree } from './FolderTree';
import { useSupabaseData } from '@/hooks/useSupabaseData';

export function Sidebar() {
  const { createFolder, folders } = useSupabaseData();

  const handleCreateRootFolder = () => {
    const folderName = `Viagem ${new Date().toLocaleDateString()}`;
    createFolder(folderName);
  };

  return (
    <div className="w-80 bg-card border-r border-border flex flex-col h-full">
      {/* Header */}
      <div className="p-6 border-b border-border">
        <div className="flex items-center gap-3 mb-4">
          <div className="w-10 h-10 rounded-lg bg-gradient-ocean flex items-center justify-center shadow-soft">
            <MapPin className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-foreground">Travel Notes</h1>
            <p className="text-sm text-muted-foreground">Organize suas viagens</p>
          </div>
        </div>
        
        <Button 
          onClick={handleCreateRootFolder}
          className="w-full bg-gradient-ocean text-white shadow-soft hover:shadow-medium transition-all duration-200"
        >
          <Plus className="h-4 w-4 mr-2" />
          Nova Viagem
        </Button>
      </div>

      {/* Folder Tree */}
      <ScrollArea className="flex-1 p-4">
        {folders.length === 0 ? (
          <div className="text-center py-12">
            <div className="w-16 h-16 rounded-full bg-muted flex items-center justify-center mx-auto mb-4">
              <MapPin className="h-8 w-8 text-muted-foreground" />
            </div>
            <p className="text-sm text-muted-foreground mb-4">
              Nenhuma viagem ainda
            </p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={handleCreateRootFolder}
              className="hover:bg-ocean/5 hover:border-ocean"
            >
              <Plus className="h-4 w-4 mr-2" />
              Criar primeira viagem
            </Button>
          </div>
        ) : (
          <FolderTree />
        )}
      </ScrollArea>

      {/* Footer */}
      <div className="p-4 border-t border-border bg-muted/30">
        <p className="text-xs text-muted-foreground text-center">
          Dados sincronizados com o Supabase
        </p>
      </div>
    </div>
  );
}