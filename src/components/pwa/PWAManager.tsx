import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { usePWA } from '@/hooks/usePWA';
import { 
  Download, 
  Wifi, 
  WifiOff, 
  Smartphone, 
  Share2,
  RefreshCw,
  CheckCircle,
  AlertCircle
} from 'lucide-react';

export const PWAManager = () => {
  const { 
    isInstallable, 
    isInstalled, 
    isOnline, 
    isStandalone,
    installPWA,
    checkForUpdates,
    shareApp
  } = usePWA();
  
  const [swStatus, setSWStatus] = useState<'installing' | 'installed' | 'error' | 'updating'>('installing');
  const [updateAvailable, setUpdateAvailable] = useState(false);

  useEffect(() => {
    registerServiceWorker();
  }, []);

  const registerServiceWorker = async () => {
    if ('serviceWorker' in navigator) {
      try {
        console.log('Registrando Service Worker...');
        
        const registration = await navigator.serviceWorker.register('/sw.js', {
          scope: '/'
        });

        console.log('Service Worker registrado com sucesso:', registration);
        setSWStatus('installed');

        // Verificar atualizações
        registration.addEventListener('updatefound', () => {
          console.log('Atualização do Service Worker encontrada');
          setSWStatus('updating');
          
          const newWorker = registration.installing;
          if (newWorker) {
            newWorker.addEventListener('statechange', () => {
              if (newWorker.state === 'installed') {
                if (navigator.serviceWorker.controller) {
                  console.log('Nova versão disponível');
                  setUpdateAvailable(true);
                } else {
                  console.log('Service Worker instalado pela primeira vez');
                  setSWStatus('installed');
                }
              }
            });
          }
        });

        // Listener para quando o SW está controlando a página
        if (registration.active) {
          console.log('Service Worker ativo');
          setSWStatus('installed');
        }

      } catch (error) {
        console.error('Erro ao registrar Service Worker:', error);
        setSWStatus('error');
      }
    } else {
      console.log('Service Workers não são suportados');
      setSWStatus('error');
    }
  };

  const handleInstallPWA = async () => {
    const success = await installPWA();
    if (success) {
      console.log('PWA instalada com sucesso!');
    }
  };

  const handleUpdateApp = async () => {
    await checkForUpdates();
    window.location.reload();
  };

  const handleShareApp = async () => {
    const success = await shareApp({
      title: 'Travel Notes',
      text: 'Confira este app incrível para organizar suas viagens!',
    });
    
    if (success) {
      console.log('App compartilhado!');
    }
  };

  // Não mostrar o componente se estiver em modo standalone e tudo estiver OK
  if (isStandalone && swStatus === 'installed' && !updateAvailable) {
    return null;
  }

  return (
    <div className="fixed bottom-4 right-4 z-50 max-w-sm">
      <Card className="shadow-lg border-2">
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Smartphone className="h-5 w-5 text-blue-600" />
              <CardTitle className="text-lg">Travel Notes PWA</CardTitle>
            </div>
            <div className="flex items-center gap-2">
              {isOnline ? (
                <Badge variant="outline" className="text-green-600">
                  <Wifi className="h-3 w-3 mr-1" />
                  Online
                </Badge>
              ) : (
                <Badge variant="destructive">
                  <WifiOff className="h-3 w-3 mr-1" />
                  Offline
                </Badge>
              )}
            </div>
          </div>
          <CardDescription>
            {isInstalled ? 'App instalado' : 'Instale para uma melhor experiência'}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-3">
          {/* Status do Service Worker */}
          <div className="flex items-center gap-2">
            {swStatus === 'installed' && (
              <>
                <CheckCircle className="h-4 w-4 text-green-600" />
                <span className="text-sm text-green-600">Cache offline ativo</span>
              </>
            )}
            {swStatus === 'installing' && (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-blue-600" />
                <span className="text-sm text-blue-600">Configurando cache...</span>
              </>
            )}
            {swStatus === 'updating' && (
              <>
                <RefreshCw className="h-4 w-4 animate-spin text-orange-600" />
                <span className="text-sm text-orange-600">Atualizando...</span>
              </>
            )}
            {swStatus === 'error' && (
              <>
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-sm text-red-600">Erro no cache</span>
              </>
            )}
          </div>

          {/* Alerta de atualização disponível */}
          {updateAvailable && (
            <Alert>
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>
                Nova versão disponível! 
                <Button 
                  variant="link" 
                  size="sm" 
                  className="p-0 h-auto ml-1"
                  onClick={handleUpdateApp}
                >
                  Atualizar agora
                </Button>
              </AlertDescription>
            </Alert>
          )}

          {/* Botões de ação */}
          <div className="flex flex-col gap-2">
            {isInstallable && !isInstalled && (
              <Button onClick={handleInstallPWA} className="w-full">
                <Download className="h-4 w-4 mr-2" />
                Instalar App
              </Button>
            )}
            
            <div className="flex gap-2">
              <Button 
                variant="outline" 
                size="sm" 
                onClick={handleShareApp}
                className="flex-1"
              >
                <Share2 className="h-4 w-4 mr-2" />
                Compartilhar
              </Button>
              
              <Button 
                variant="outline" 
                size="sm" 
                onClick={checkForUpdates}
                className="flex-1"
              >
                <RefreshCw className="h-4 w-4 mr-2" />
                Atualizar
              </Button>
            </div>
          </div>

          {/* Informações adicionais */}
          <div className="text-xs text-muted-foreground space-y-1">
            {isStandalone && (
              <div className="flex items-center gap-1">
                <CheckCircle className="h-3 w-3" />
                <span>Rodando como app instalado</span>
              </div>
            )}
            {!isOnline && (
              <div className="text-orange-600">
                Modo offline - algumas funcionalidades podem estar limitadas
              </div>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
