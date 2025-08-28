import { supabase } from '@/lib/supabase'

export const authDebug = {
  // Verificar configuração atual
  checkConfig: () => {
    const config = {
      supabaseUrl: import.meta.env.VITE_SUPABASE_URL,
      hasAnonKey: !!import.meta.env.VITE_SUPABASE_ANON_KEY,
      currentOrigin: window.location.origin,
      currentPath: window.location.pathname,
      isProduction: import.meta.env.PROD,
      userAgent: navigator.userAgent,
    }
    
    console.log('🔍 Auth Debug - Configuração:', config)
    return config
  },

  // Testar conexão com Supabase
  testSupabaseConnection: async () => {
    try {
      const { data, error } = await supabase.auth.getSession()
      console.log('🔍 Auth Debug - Conexão Supabase:', { data, error })
      return { success: !error, data, error }
    } catch (err) {
      console.error('🔍 Auth Debug - Erro na conexão:', err)
      return { success: false, error: err }
    }
  },

  // Verificar URLs de redirecionamento
  checkRedirectUrls: () => {
    const redirectUrl = `${window.location.origin}/auth/callback`
    const config = {
      redirectUrl,
      expectedFormat: 'https://[DOMAIN]/auth/callback',
      isValid: redirectUrl.includes('/auth/callback'),
      hasHttps: redirectUrl.startsWith('https://'),
      hasHttp: redirectUrl.startsWith('http://'),
    }
    
    console.log('🔍 Auth Debug - URLs de Redirecionamento:', config)
    return config
  },

  // Simular login Google (sem redirecionar)
  simulateGoogleLogin: async () => {
    try {
      const redirectUrl = `${window.location.origin}/auth/callback`
      
      console.log('🔍 Auth Debug - Simulando login Google...')
      console.log('🔍 Auth Debug - URL de redirecionamento:', redirectUrl)
      
      const { data, error } = await supabase.auth.signInWithOAuth({
        provider: 'google',
        options: {
          redirectTo: redirectUrl,
          queryParams: {
            access_type: 'offline',
            prompt: 'consent',
          }
        }
      })
      
      console.log('🔍 Auth Debug - Resultado do login:', { data, error })
      return { data, error }
    } catch (err) {
      console.error('🔍 Auth Debug - Erro no login:', err)
      return { error: err }
    }
  },

  // Verificar logs de erro
  checkErrorLogs: () => {
    const errors = {
      commonIssues: [
        'URL de redirecionamento não configurada no Supabase',
        'URL de redirecionamento não configurada no Google Cloud Console',
        'Client ID ou Client Secret incorretos',
        'Domínio não autorizado',
        'Protocolo HTTP vs HTTPS incorreto',
      ],
      troubleshooting: [
        '1. Verifique Authentication > URL Configuration no Supabase',
        '2. Verifique Google Cloud Console > Credentials > OAuth 2.0',
        '3. Confirme se as URLs são exatamente iguais',
        '4. Verifique se não há espaços extras',
        '5. Teste com e sem www no domínio',
      ]
    }
    
    console.log('🔍 Auth Debug - Problemas comuns:', errors)
    return errors
  },

  // Gerar relatório completo
  generateReport: async () => {
    console.log('🔍 Auth Debug - Gerando relatório completo...')
    
    const report = {
      timestamp: new Date().toISOString(),
      config: authDebug.checkConfig(),
      redirectUrls: authDebug.checkRedirectUrls(),
      connection: await authDebug.testSupabaseConnection(),
      errors: authDebug.checkErrorLogs(),
    }
    
    console.log('🔍 Auth Debug - Relatório completo:', report)
    return report
  }
}

// Função para usar no console do navegador
if (typeof window !== 'undefined') {
  (window as any).authDebug = authDebug
}
