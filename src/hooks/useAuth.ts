import { useState, useEffect } from 'react'
import { User, AuthError } from '@supabase/supabase-js'
import { supabase } from '@/lib/supabase'

export function useAuth() {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<AuthError | null>(null)

  useEffect(() => {
    // Verificar sessão atual
    const getSession = async () => {
      const { data: { session }, error } = await supabase.auth.getSession()
      setUser(session?.user ?? null)
      setError(error)
      setLoading(false)
    }

    getSession()

    // Escutar mudanças de autenticação
    const { data: { subscription } } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        setUser(session?.user ?? null)
        setLoading(false)
      }
    )

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })
      
      if (error) {
        console.error('Erro no signin:', error)
        setError(error)
      } else {
        console.log('Signin realizado com sucesso:', data)
      }
      
      setLoading(false)
      return { data, error }
    } catch (err: any) {
      console.error('Erro inesperado no signin:', err)
      setError(err)
      setLoading(false)
      return { data: null, error: err }
    }
  }

  const signUp = async (email: string, password: string) => {
    setLoading(true)
    setError(null)
    
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })
      
      if (error) {
        console.error('Erro no signup:', error)
        setError(error)
      } else {
        console.log('Signup realizado com sucesso:', data)
      }
      
      setLoading(false)
      return { data, error }
    } catch (err: any) {
      console.error('Erro inesperado no signup:', err)
      setError(err)
      setLoading(false)
      return { data: null, error: err }
    }
  }

  const signOut = async () => {
    setLoading(true)
    const { error } = await supabase.auth.signOut()
    setError(error)
    setLoading(false)
    return { error }
  }

  const resetPassword = async (email: string) => {
    setLoading(true)
    setError(null)
    
    const { data, error } = await supabase.auth.resetPasswordForEmail(email)
    
    setError(error)
    setLoading(false)
    return { data, error }
  }

  return {
    user,
    loading,
    error,
    signIn,
    signUp,
    signOut,
    resetPassword,
  }
}
