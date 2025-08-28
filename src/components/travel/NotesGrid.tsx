import { useState } from 'react';
import { Plus, Edit, MoreVertical, FileText, Calendar, Folder } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { formatDistanceToNow } from 'date-fns';
import { ptBR } from 'date-fns/locale';

export function NotesGrid() {
  const { 
    selectedFolderId, 
    getFolder, 
    getNotesByFolder, 
    createNote, 
    deleteNote,
    setSelectedNoteId 
  } = useSupabaseData();

  const folder = selectedFolderId ? getFolder(selectedFolderId) : null;
  const notes = selectedFolderId ? getNotesByFolder(selectedFolderId) : [];

  const handleCreateNote = () => {
    if (selectedFolderId) {
      const noteName = `Nova Nota ${new Date().toLocaleDateString()}`;
      const newNote = createNote(noteName, selectedFolderId);
      setSelectedNoteId(newNote.id);
    }
  };

  const truncateContent = (content: string, maxLength: number = 150) => {
    const textContent = content.replace(/<[^>]*>/g, '');
    return textContent.length > maxLength 
      ? textContent.substring(0, maxLength) + '...'
      : textContent;
  };

  if (!folder) {
    return (
      <div className="flex-1 flex flex-col">
        <div className="bg-card border-b border-border p-4 flex justify-between items-center">
          <div className="flex items-center">
            <Folder className="text-2xl text-primary mr-2 h-6 w-6" />
            <h2 className="text-xl font-semibold">Selecione uma pasta</h2>
          </div>
        </div>
        
        <div className="p-4 flex-1 bg-muted/30 flex items-center justify-center">
          <div className="text-center">
            <Folder className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
            <p className="text-muted-foreground">
              Escolha uma pasta na barra lateral para ver suas notas de viagem
            </p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 flex flex-col">
      {/* Folder Header */}
      <div className="bg-card border-b border-border p-4 flex justify-between items-center">
        <div className="flex items-center">
          <Folder className="text-2xl text-primary mr-2 h-6 w-6" />
          <h2 className="text-xl font-semibold">{folder.name}</h2>
        </div>
        <div className="flex space-x-2">
          <Button
            onClick={handleCreateNote}
            className="flex items-center bg-primary hover:bg-primary-hover text-primary-foreground px-4 py-2 rounded-lg transition-all duration-300"
          >
            <Plus className="mr-1 h-4 w-4" />
            Nova Nota
          </Button>
        </div>
      </div>

      {/* Notes Grid */}
      <div className="p-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 overflow-auto flex-1 bg-muted/30">
        {notes.map((note) => (
          <Card 
            key={note.id}
            className="bg-card hover:shadow-medium transition-all duration-300 border border-border flex flex-col cursor-pointer"
            onClick={() => setSelectedNoteId(note.id)}
          >
            <CardContent className="p-4 flex-1">
              <h3 className="font-semibold text-lg mb-1 text-card-foreground">{note.title}</h3>
              <p className="text-muted-foreground text-sm mb-4">
                {note.content ? truncateContent(note.content) : 'Nota vazia - clique para editar'}
              </p>
              <div className="flex items-center text-xs text-muted-foreground">
                <Calendar className="text-sm mr-1 h-3 w-3" />
                Atualizado: {formatDistanceToNow(new Date(note.updatedAt), { 
                  addSuffix: true, 
                  locale: ptBR 
                })}
              </div>
            </CardContent>
            <div className="bg-muted/50 p-3 border-t border-border flex justify-between items-center">
              <div className="flex items-center text-xs">
                <span className="inline-block h-6 w-6 bg-accent/20 text-accent rounded-full flex items-center justify-center mr-1">
                  <FileText className="text-sm h-3 w-3" />
                </span>
                <span className="text-muted-foreground">Nota manual</span>
              </div>
              <div className="flex space-x-1">
                <Button 
                  variant="ghost"
                  size="sm"
                  className="p-1.5 hover:bg-muted rounded-full transition-all duration-300"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedNoteId(note.id);
                  }}
                >
                  <Edit className="text-muted-foreground text-sm h-3 w-3" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost"
                      size="sm"
                      className="p-1.5 hover:bg-muted rounded-full transition-all duration-300"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <MoreVertical className="text-muted-foreground text-sm h-3 w-3" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem 
                      onClick={(e) => {
                        e.stopPropagation();
                        deleteNote(note.id);
                      }}
                      className="text-destructive focus:text-destructive"
                    >
                      Excluir Nota
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            </div>
          </Card>
        ))}

        {/* Create Note Card */}
        <Card 
          className="border-2 border-dashed border-border hover:border-primary/50 transition-all duration-300 cursor-pointer bg-card/50 hover:bg-card flex flex-col items-center justify-center p-6"
          onClick={handleCreateNote}
        >
          <Plus className="h-8 w-8 text-muted-foreground mb-2" />
          <p className="text-muted-foreground font-medium">Criar Nova Nota</p>
          <p className="text-xs text-muted-foreground mt-1 text-center">
            Clique para adicionar uma nova nota<br />sobre sua viagem
          </p>
        </Card>
      </div>
    </div>
  );
}