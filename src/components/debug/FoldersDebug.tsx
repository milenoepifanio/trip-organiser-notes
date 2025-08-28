import { useSupabaseData } from '@/hooks/useSupabaseData'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'

export function FoldersDebug() {
  const { folders, createFolder, refreshData, getFoldersByParent } = useSupabaseData()

  const handleCreateTestFolder = async () => {
    const testName = `Teste ${new Date().toLocaleTimeString()}`
    console.log('Criando pasta de teste:', testName)
    const result = await createFolder(testName)
    console.log('Resultado da criação:', result)
  }

  const handleCreateRootFolder = async () => {
    const testName = `Raiz ${new Date().toLocaleTimeString()}`
    console.log('Criando pasta raiz de teste:', testName)
    const result = await createFolder(testName, undefined)
    console.log('Resultado da criação da pasta raiz:', result)
  }

  const rootFolders = getFoldersByParent(undefined)
  const childFolders = folders.filter(f => f.parentId)

  return (
    <Card className="w-full max-w-2xl mx-auto">
      <CardHeader>
        <CardTitle>Debug das Pastas</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Estado atual */}
        <div>
          <h3 className="font-semibold mb-2">Estado Atual</h3>
          <div className="space-y-2 text-sm">
            <div className="flex items-center gap-2">
              <span>Total de pastas:</span>
              <Badge variant="outline">{folders.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Pastas raiz:</span>
              <Badge variant="outline">{rootFolders.length}</Badge>
            </div>
            <div className="flex items-center gap-2">
              <span>Pastas filhas:</span>
              <Badge variant="outline">{childFolders.length}</Badge>
            </div>
            {folders.length > 0 && (
              <div className="bg-muted p-2 rounded text-xs">
                <div className="font-semibold mb-1">Todas as pastas no estado:</div>
                {folders.map((folder, index) => (
                  <div key={folder.id} className="flex items-center gap-2">
                    <span>{index + 1}.</span>
                    <span className="font-mono">{folder.id.substring(0, 8)}...</span>
                    <span>{folder.name}</span>
                    <span className="text-muted-foreground">
                      (parent: {folder.parentId || 'root'})
                    </span>
                  </div>
                ))}
              </div>
            )}
            {rootFolders.length > 0 && (
              <div className="bg-green-50 p-2 rounded text-xs">
                <div className="font-semibold mb-1 text-green-800">Pastas raiz (devem aparecer na sidebar):</div>
                {rootFolders.map((folder, index) => (
                  <div key={folder.id} className="flex items-center gap-2 text-green-700">
                    <span>{index + 1}.</span>
                    <span className="font-mono">{folder.id.substring(0, 8)}...</span>
                    <span>{folder.name}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Ações */}
        <div>
          <h3 className="font-semibold mb-2">Ações</h3>
          <div className="space-x-2">
            <Button onClick={handleCreateTestFolder} size="sm">
              Criar Pasta de Teste
            </Button>
            <Button onClick={handleCreateRootFolder} size="sm" variant="outline">
              Criar Pasta Raiz
            </Button>
            <Button onClick={refreshData} size="sm" variant="outline">
              Recarregar Dados
            </Button>
          </div>
        </div>

        {/* Logs */}
        <div>
          <h3 className="font-semibold mb-2">Logs Recentes</h3>
          <div className="bg-muted p-2 rounded text-xs max-h-32 overflow-y-auto">
            <div>Abra o console do navegador (F12) para ver os logs detalhados</div>
            <div className="mt-2 text-blue-600">
              <strong>Dica:</strong> Verifique se as pastas estão sendo criadas como "raiz" (parentId: null/undefined)
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
