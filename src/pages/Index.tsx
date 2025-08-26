import { Sidebar } from '@/components/travel/Sidebar';
import { NoteEditor } from '@/components/travel/NoteEditor';

const Index = () => {
  return (
    <div className="h-screen flex bg-background">
      <Sidebar />
      <main className="flex-1 flex flex-col overflow-hidden">
        <NoteEditor />
      </main>
    </div>
  );
};

export default Index;
