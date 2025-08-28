import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '@/hooks/useAuth'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function SupabaseDebug() {
  const { user } = useAuth()
  const [config, setConfig] = useState<any>(null)
  const [testResult, setTestResult] = useState<any>(null)

  useEffect(() => {
    // Verificar configuração do Supabase
    const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
    const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

    setConfig({
      url: supabaseUrl,
      hasUrl: !!supabaseUrl,
      hasKey: !!supabaseAnonKey,
      keyLength: supabaseAnonKey?.length || 0,
    })
  }, [])

  const testConnection = async () => {
    try {
      const { data, error } = await supabase
        .from('folders')
        .select('count')
        .limit(1)

      setTestResult({
        success: !error,
        data,
        error: error?.message || null,
      })
    } catch (err: any) {
      setTestResult({
        success: false,
        error: err.message,
      })
    }
  }

  if (!user) {
    return (
      <Card className="w-full max-w-2xl mx-auto">
        <CardHeader>
          <CardTitle>Debug do Supabase</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-muted-foreground">Faça login para ver as informações de debug</p>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug do Supabase</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Configuração */}
        <div>
          <h3 className="font-semibold mb-2">Configuração</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span>URL configurada:</span>
              <Badge variant={config?.hasUrl ? "default" : "destructive"}>
                {config?.hasUrl ? "Sim" : "Não"}
              </Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Chave configurada:</span>
              <Badge variant={config?.hasKey ? "default" : "destructive"}>
                {config?.hasKey ? "Sim" : "Não"}
              </Badge>
            </div>
            {config?.hasKey && (
              <div className="flex items-center gap-2">
                <span>Tamanho da chave:</span>
                <Badge variant="outline">{config.keyLength} caracteres</Badge>
              </div>
            )}
          </div>
        </div>

        {/* Usuário */}
        <div>
          <h3 className="font-semibold mb-2">Usuário</h3>
          <div className="space-y-2 text-sm">
            <div>ID: {user.id}</div>
            <div>Email: {user.email}</div>
            <div>Email confirmado: {user.email_confirmed_at ? "Sim" : "Não"}</div>
          </div>
        </div>

        {/* Teste de conexão */}
        <div>
          <h3 className="font-semibold mb-2">Teste de Conexão</h3>
          <Button onClick={testConnection} className="mb-2">
            Testar Conexão
          </Button>
          
          {testResult && (
            <div className="space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <span>Status:</span>
                <Badge variant={testResult.success ? "default" : "destructive"}>
                  {testResult.success ? "Sucesso" : "Erro"}
                </Badge>
              </div>
              {testResult.error && (
                <div className="text-red-600 bg-red-50 p-2 rounded">
                  Erro: {testResult.error}
                </div>
              )}
              {testResult.data && (
                <div className="text-green-600 bg-green-50 p-2 rounded">
                  Dados recebidos: {JSON.stringify(testResult.data)}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Variáveis de ambiente (apenas para debug) */}
        <div>
          <h3 className="font-semibold mb-2">Variáveis de Ambiente</h3>
          <div className="text-xs bg-muted p-2 rounded">
            <div>VITE_SUPABASE_URL: {config?.url ? "Configurada" : "Não configurada"}</div>
            <div>VITE_SUPABASE_ANON_KEY: {config?.hasKey ? "Configurada" : "Não configurada"}</div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
