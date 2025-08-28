import { SupabaseDebug } from '@/components/debug/SupabaseDebug'
import { FoldersDebug } from '@/components/debug/FoldersDebug'
import { ProtectedRoute } from '@/components/auth/ProtectedRoute'

const Debug = () => {
  return (
    <ProtectedRoute>
      <div className="min-h-screen bg-gradient-to-br from-background to-muted/50 p-4">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-2xl font-bold mb-6 text-center">Debug do Supabase</h1>
          <div className="space-y-6">
            <SupabaseDebug />
            <FoldersDebug />
          </div>
        </div>
      </div>
    </ProtectedRoute>
  )
}

export default Debug
