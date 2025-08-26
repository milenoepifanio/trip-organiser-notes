import { MapPin, Search, Bell, Settings, User } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function Header() {
  return (
    <header className="bg-primary text-primary-foreground p-4 flex justify-between items-center">
      <h1 className="text-xl md:text-2xl font-bold flex items-center">
        <MapPin className="mr-2 h-6 w-6" />
        Travel Notes
      </h1>
      <div className="flex items-center space-x-3">
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-primary-hover p-2 rounded-full transition-all duration-300 text-primary-foreground hover:text-primary-foreground"
        >
          <Bell className="h-5 w-5" />
        </Button>
        <Button 
          variant="ghost" 
          size="sm"
          className="hover:bg-primary-hover p-2 rounded-full transition-all duration-300 text-primary-foreground hover:text-primary-foreground"
        >
          <Settings className="h-5 w-5" />
        </Button>
        <div className="h-8 w-8 bg-primary-hover rounded-full flex items-center justify-center">
          <User className="h-4 w-4" />
        </div>
      </div>
    </header>
  );
}