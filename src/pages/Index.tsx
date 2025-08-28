import { Header } from '@/components/travel/Header';
import { ModernSidebar } from '@/components/travel/ModernSidebar';
import { NotesGrid } from '@/components/travel/NotesGrid';
import { NoteEditor } from '@/components/travel/NoteEditor';
import { useSupabaseData } from '@/hooks/useSupabaseData';
import { ProtectedRoute } from '@/components/auth/ProtectedRoute';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const { selectedNoteId, loading } = useSupabaseData();

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-8 w-8 animate-spin mx-auto mb-4 text-muted-foreground" />
          <p className="text-muted-foreground">Carregando seus dados...</p>
        </div>
      </div>
    );
  }

  return (
    <ProtectedRoute>
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
    </ProtectedRoute>
  );
};

export default Index;
