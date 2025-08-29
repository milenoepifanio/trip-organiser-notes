import { useState, useEffect } from 'react';

interface BeforeInstallPromptEvent extends Event {
  readonly platforms: string[];
  readonly userChoice: Promise<{
    outcome: 'accepted' | 'dismissed';
    platform: string;
  }>;
  prompt(): Promise<void>;
}

interface PWAState {
  isInstallable: boolean;
  isInstalled: boolean;
  isOnline: boolean;
  isStandalone: boolean;
  installPrompt: BeforeInstallPromptEvent | null;
}

export const usePWA = () => {
  const [pwaState, setPwaState] = useState<PWAState>({
    isInstallable: false,
    isInstalled: false,
    isOnline: navigator.onLine,
    isStandalone: false,
    installPrompt: null,
  });

  useEffect(() => {
    // Verificar se está rodando em modo standalone (instalado)
    const isStandalone = 
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as any).standalone ||
      document.referrer.includes('android-app://');

    // Verificar se já está instalado
    const isInstalled = isStandalone || 
      localStorage.getItem('pwa-installed') === 'true';

    setPwaState(prev => ({
      ...prev,
      isStandalone,
      isInstalled,
    }));

    // Listener para o evento de instalação
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: true,
        installPrompt: installEvent,
      }));
    };

    // Listener para quando o app é instalado
    const handleAppInstalled = () => {
      console.log('PWA foi instalada!');
      localStorage.setItem('pwa-installed', 'true');
      
      setPwaState(prev => ({
        ...prev,
        isInstallable: false,
        isInstalled: true,
        installPrompt: null,
      }));
    };

    // Listeners para status online/offline
    const handleOnline = () => {
      setPwaState(prev => ({ ...prev, isOnline: true }));
    };

    const handleOffline = () => {
      setPwaState(prev => ({ ...prev, isOnline: false }));
    };

    // Adicionar event listeners
    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    // Cleanup
    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Função para instalar a PWA
  const installPWA = async () => {
    if (!pwaState.installPrompt) {
      console.log('Prompt de instalação não disponível');
      return false;
    }

    try {
      await pwaState.installPrompt.prompt();
      const choiceResult = await pwaState.installPrompt.userChoice;
      
      if (choiceResult.outcome === 'accepted') {
        console.log('Usuário aceitou instalar a PWA');
        return true;
      } else {
        console.log('Usuário rejeitou instalar a PWA');
        return false;
      }
    } catch (error) {
      console.error('Erro ao tentar instalar PWA:', error);
      return false;
    }
  };

  // Função para verificar se há atualizações
  const checkForUpdates = async () => {
    if ('serviceWorker' in navigator) {
      try {
        const registration = await navigator.serviceWorker.getRegistration();
        if (registration) {
          await registration.update();
          console.log('Verificação de atualização concluída');
        }
      } catch (error) {
        console.error('Erro ao verificar atualizações:', error);
      }
    }
  };

  // Função para compartilhar (Web Share API)
  const shareApp = async (data?: {
    title?: string;
    text?: string;
    url?: string;
  }) => {
    const shareData = {
      title: data?.title || 'Travel Notes',
      text: data?.text || 'Organize suas viagens com Travel Notes!',
      url: data?.url || window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        console.log('Conteúdo compartilhado com sucesso');
        return true;
      } catch (error) {
        console.error('Erro ao compartilhar:', error);
        return false;
      }
    } else {
      // Fallback: copiar URL para clipboard
      try {
        await navigator.clipboard.writeText(shareData.url);
        console.log('URL copiada para clipboard');
        return true;
      } catch (error) {
        console.error('Erro ao copiar URL:', error);
        return false;
      }
    }
  };

  return {
    ...pwaState,
    installPWA,
    checkForUpdates,
    shareApp,
  };
};
