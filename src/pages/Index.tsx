import { Header } from '@/components/travel/Header';
import { ModernSidebar } from '@/components/travel/ModernSidebar';
import { NotesGrid } from '@/components/travel/NotesGrid';
import { NoteEditor } from '@/components/travel/NoteEditor';
import { useTravelData } from '@/hooks/useTravelData';

const Index = () => {
  const { selectedNoteId } = useTravelData();

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50">
      <div className="max-w-7xl mx-auto bg-card shadow-travel rounded-xl overflow-hidden min-h-screen">
        <Header />
        
        <div className="flex flex-col md:flex-row min-h-[calc(100vh-5rem)]">
          <ModernSidebar />
          
          {selectedNoteId ? (
            <NoteEditor />
          ) : (
            <NotesGrid />
          )}
        </div>
      </div>
    </div>
  );
};

export default Index;
