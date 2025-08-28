import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '@/lib/supabase'
import { useToast } from '@/hooks/use-toast'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2, CheckCircle, XCircle } from 'lucide-react'

export function AuthCallback() {
  const [status, setStatus] = useState<'loading' | 'success' | 'error'>('loading')
  const [message, setMessage] = useState('Processando autenticação...')
  const navigate = useNavigate()
  const { toast } = useToast()

  useEffect(() => {
    const handleAuthCallback = async () => {
      try {
        const { data, error } = await supabase.auth.getSession()
        
        if (error) {
          console.error('Erro na autenticação:', error)
          setStatus('error')
          setMessage('Erro na autenticação. Tente novamente.')
          
          toast({
            title: "Erro na autenticação",
            description: error.message || "Ocorreu um erro durante o login",
            variant: "destructive",
          })
          
          // Redirecionar para login após 3 segundos
          setTimeout(() => {
            navigate('/')
          }, 3000)
          return
        }

        if (data.session) {
          setStatus('success')
          setMessage('Login realizado com sucesso! Redirecionando...')
          
          toast({
            title: "Login realizado!",
            description: "Bem-vindo ao Travel Notes!",
          })
          
          // Redirecionar para a aplicação principal
          setTimeout(() => {
            navigate('/')
          }, 2000)
        } else {
          setStatus('error')
          setMessage('Sessão não encontrada. Tente novamente.')
          
          setTimeout(() => {
            navigate('/')
          }, 3000)
        }
      } catch (error: any) {
        console.error('Erro inesperado:', error)
        setStatus('error')
        setMessage('Erro inesperado. Tente novamente.')
        
        setTimeout(() => {
          navigate('/')
        }, 3000)
      }
    }

    handleAuthCallback()
  }, [navigate, toast])

  return (
    <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 rounded-full bg-gradient-ocean flex items-center justify-center mx-auto mb-4 shadow-soft">
            {status === 'loading' && <Loader2 className="h-8 w-8 text-white animate-spin" />}
            {status === 'success' && <CheckCircle className="h-8 w-8 text-white" />}
            {status === 'error' && <XCircle className="h-8 w-8 text-white" />}
          </div>
          <CardTitle className="text-2xl font-bold">Travel Notes</CardTitle>
          <CardDescription>
            {status === 'loading' && 'Processando autenticação...'}
            {status === 'success' && 'Autenticação concluída!'}
            {status === 'error' && 'Erro na autenticação'}
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center">
          <p className="text-muted-foreground">{message}</p>
          {status === 'loading' && (
            <div className="mt-4">
              <Loader2 className="h-6 w-6 animate-spin mx-auto" />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}
