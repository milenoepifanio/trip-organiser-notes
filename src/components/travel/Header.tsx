import { useState } from 'react';
import { MapPin, Search, Bell, Settings, User, LogOut, Shield, HelpCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/hooks/useAuth';
import { useToast } from '@/hooks/use-toast';
import { 
  DropdownMenu, 
  DropdownMenuContent, 
  DropdownMenuItem, 
  DropdownMenuTrigger 
} from '@/components/ui/dropdown-menu';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';

export function Header() {
  const { user, signOut } = useAuth();
  const { toast } = useToast();
  const [showLogoutConfirm, setShowLogoutConfirm] = useState(false);

  const handleSignOutClick = () => {
    setShowLogoutConfirm(true);
  };

  const handleSignOut = async () => {
    setShowLogoutConfirm(false);
    
    try {
      toast({
        title: "Saindo...",
        description: "Fazendo logout da sua conta.",
      });

      const { error } = await signOut();
      if (error) throw error;
      
      toast({
        title: "Logout realizado!",
        description: "Você foi desconectado com sucesso. Até logo! 👋",
      });
    } catch (error: any) {
      toast({
        title: "Erro ao fazer logout",
        description: error.message || "Tente novamente em alguns instantes.",
        variant: "destructive",
      });
    }
  };

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
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              variant="ghost" 
              size="sm"
              className="h-8 w-8 bg-primary-hover rounded-full flex items-center justify-center hover:bg-primary-hover/80 transition-all duration-300 text-primary-foreground hover:text-primary-foreground"
            >
              <User className="h-4 w-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56">
            <div className="px-2 py-1.5 text-sm text-muted-foreground border-b border-border pb-2">
              <div className="font-medium">{user?.email}</div>
              <div className="text-xs">Usuário logado</div>
            </div>
            <DropdownMenuItem className="text-muted-foreground">
              <Shield className="mr-2 h-4 w-4" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuItem className="text-muted-foreground">
              <Settings className="mr-2 h-4 w-4" />
              Configurações
            </DropdownMenuItem>
            <DropdownMenuItem className="text-muted-foreground">
              <HelpCircle className="mr-2 h-4 w-4" />
              Ajuda
            </DropdownMenuItem>
            <div className="border-t border-border my-1" />
            <DropdownMenuItem onClick={handleSignOutClick} className="text-red-600 focus:text-red-600">
              <LogOut className="mr-2 h-4 w-4" />
              Sair da Conta
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      
      <ConfirmDialog
        open={showLogoutConfirm}
        onOpenChange={setShowLogoutConfirm}
        title="Sair da Conta"
        description="Tem certeza que deseja sair da sua conta? Todas as alterações não salvas serão perdidas."
        confirmText="Sair"
        cancelText="Cancelar"
        onConfirm={handleSignOut}
        variant="destructive"
      />
    </header>
  );
}