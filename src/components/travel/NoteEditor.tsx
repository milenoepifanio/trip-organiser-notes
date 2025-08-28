import { useState, useEffect } from 'react';
import { Save, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { RichTextEditor } from './RichTextEditor';
import { useToast } from '@/hooks/use-toast';

export function NoteEditor() {
  const { selectedNoteId, getNote, updateNote } = useSupabaseData();
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [hasChanges, setHasChanges] = useState(false);
  const { toast } = useToast();

  const note = selectedNoteId ? getNote(selectedNoteId) : null;

  useEffect(() => {
    if (note) {
      setTitle(note.title);
      setContent(note.content);
      setHasChanges(false);
    } else {
      setTitle('');
      setContent('');
      setHasChanges(false);
    }
  }, [note]);

  const handleSave = () => {
    if (note && (title !== note.title || content !== note.content)) {
      updateNote(note.id, { title, content });
      setHasChanges(false);
      toast({
        title: "Nota salva!",
        description: "Suas alterações foram salvas com sucesso.",
      });
    }
  };

  const handleTitleChange = (newTitle: string) => {
    setTitle(newTitle);
    setHasChanges(true);
  };

  const handleContentChange = (newContent: string) => {
    setContent(newContent);
    setHasChanges(true);
  };

  if (!note) {
    return (
      <div className="flex flex-col items-center justify-center h-full text-center p-8">
        <div className="w-24 h-24 rounded-full bg-gradient-ocean flex items-center justify-center mb-6 shadow-travel">
          <FileText className="h-12 w-12 text-white" />
        </div>
        <h2 className="text-2xl font-semibold text-foreground mb-2">
          Selecione uma nota
        </h2>
        <p className="text-muted-foreground max-w-md">
          Escolha uma nota na barra lateral para começar a editar, ou crie uma nova nota em uma pasta.
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-full">
      {/* Header */}
      <div className="flex items-center gap-4 p-6 border-b border-border bg-card/50">
        <div className="flex-1">
          <Input
            value={title}
            onChange={(e) => handleTitleChange(e.target.value)}
            placeholder="Título da nota..."
            className="text-lg font-semibold border-none bg-transparent px-0 focus-visible:ring-0 focus-visible:ring-offset-0"
          />
        </div>
        
        <Button
          onClick={handleSave}
          disabled={!hasChanges}
          className={`transition-all duration-200 ${
            hasChanges 
              ? 'bg-gradient-ocean text-white shadow-travel hover:shadow-lg' 
              : 'bg-muted text-muted-foreground'
          }`}
        >
          <Save className="h-4 w-4 mr-2" />
          {hasChanges ? 'Salvar' : 'Salvo'}
        </Button>
      </div>

      {/* Content */}
      <div className="flex-1 p-6 overflow-auto">
        <RichTextEditor
          content={content}
          onChange={handleContentChange}
          placeholder="Comece a escrever suas anotações de viagem aqui..."
        />
      </div>
    </div>
  );
}