import { useState, useCallback, useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { TravelFolder, TravelNote } from '@/types/travel'
import { useAuth } from './useAuth'

export function useSupabaseData() {
  const { user } = useAuth()
  const [folders, setFolders] = useState<TravelFolder[]>([])
  const [notes, setNotes] = useState<TravelNote[]>([])
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null)
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null)
  const [loading, setLoading] = useState(true)

  // Carregar dados do usuário
  const loadData = useCallback(async () => {
    console.log('loadData chamada, user:', user?.id)
    
    if (!user) {
      console.log('Usuário não autenticado, limpando dados')
      setFolders([])
      setNotes([])
      setLoading(false)
      return
    }

    try {
      console.log('Iniciando carregamento de dados...')
      setLoading(true)
      
      // Carregar pastas
      const { data: foldersData, error: foldersError } = await supabase
        .from('folders')
        .select('*')
        .eq('user_id', user.id)
        .order('created_at', { ascending: true })

      if (foldersError) throw foldersError

      // Carregar notas
      const { data: notesData, error: notesError } = await supabase
        .from('notes')
        .select('*')
        .eq('user_id', user.id)
        .order('updated_at', { ascending: false })

      if (notesError) throw notesError

      // Converter dados do Supabase para o formato da aplicação
      const convertedFolders: TravelFolder[] = (foldersData || []).map(folder => {
        console.log('Convertendo pasta do Supabase:', {
          id: folder.id,
          name: folder.name,
          parent_id: folder.parent_id,
          parent_id_type: typeof folder.parent_id
        })
        
        return {
          id: folder.id,
          name: folder.name,
          parentId: folder.parent_id,
          children: [],
          notes: [],
          createdAt: new Date(folder.created_at),
          updatedAt: new Date(folder.updated_at),
        }
      })

      const convertedNotes: TravelNote[] = (notesData || []).map(note => ({
        id: note.id,
        title: note.title,
        content: note.content,
        folderId: note.folder_id,
        createdAt: new Date(note.created_at),
        updatedAt: new Date(note.updated_at),
      }))

      console.log('Dados carregados:', {
        folders: convertedFolders.length,
        notes: convertedNotes.length
      })
      
      setFolders(convertedFolders)
      setNotes(convertedNotes)
    } catch (error) {
      console.error('Erro ao carregar dados:', error)
    } finally {
      setLoading(false)
    }
  }, [user])

  useEffect(() => {
    console.log('useEffect loadData executado, user:', user?.id)
    loadData()
  }, [loadData])

  const createFolder = useCallback(async (name: string, parentId?: string) => {
    if (!user) {
      console.error('Usuário não autenticado')
      return null
    }

    try {
      console.log('Criando pasta:', { name, parentId, userId: user.id })
      console.log('parentId type:', typeof parentId, 'value:', parentId)
      
      const newFolder = {
        name,
        parent_id: parentId || null,
        user_id: user.id,
      }

      console.log('Dados da pasta a ser criada:', newFolder)

      const { data, error } = await supabase
        .from('folders')
        .insert(newFolder)
        .select()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw error
      }

      console.log('Pasta criada com sucesso:', data)

      const createdFolder = data[0]
      const travelFolder: TravelFolder = {
        id: createdFolder.id,
        name: createdFolder.name,
        parentId: createdFolder.parent_id,
        children: [],
        notes: [],
        createdAt: new Date(createdFolder.created_at),
        updatedAt: new Date(createdFolder.updated_at),
      }

      console.log('TravelFolder criado:', travelFolder)

      setFolders(prev => {
        const newFolders = [...prev, travelFolder]
        console.log('Estado anterior:', prev.length, 'pastas')
        console.log('Novo estado:', newFolders.length, 'pastas')
        console.log('Pastas no estado:', newFolders.map(f => ({ id: f.id, name: f.name })))
        return newFolders
      })
      
      return travelFolder
    } catch (error) {
      console.error('Erro ao criar pasta:', error)
      return null
    }
  }, [user])

  const updateFolder = useCallback(async (id: string, updates: Partial<TravelFolder>) => {
    if (!user) return

    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (updates.name !== undefined) updateData.name = updates.name
      if (updates.parentId !== undefined) updateData.parent_id = updates.parentId

      const { error } = await supabase
        .from('folders')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setFolders(prev => 
        prev.map(folder => 
          folder.id === id 
            ? { ...folder, ...updates, updatedAt: new Date() }
            : folder
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar pasta:', error)
    }
  }, [user])

  const deleteFolder = useCallback(async (id: string) => {
    if (!user) return

    try {
      // Primeiro deletar todas as notas da pasta
      const { error: notesError } = await supabase
        .from('notes')
        .delete()
        .eq('folder_id', id)
        .eq('user_id', user.id)

      if (notesError) throw notesError

      // Depois deletar a pasta
      const { error: folderError } = await supabase
        .from('folders')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (folderError) throw folderError

      // Atualizar estado local
      setNotes(prev => prev.filter(note => note.folderId !== id))
      setFolders(prev => prev.filter(folder => folder.id !== id))
      
      if (selectedFolderId === id) {
        setSelectedFolderId(null)
      }
    } catch (error) {
      console.error('Erro ao deletar pasta:', error)
    }
  }, [user, selectedFolderId])

  const createNote = useCallback(async (title: string, folderId: string) => {
    if (!user) {
      console.error('Usuário não autenticado')
      return null
    }

    try {
      console.log('Criando nota:', { title, folderId, userId: user.id })
      
      const newNote = {
        title,
        content: '',
        folder_id: folderId,
        user_id: user.id,
      }

      console.log('Dados da nota a ser criada:', newNote)

      const { data, error } = await supabase
        .from('notes')
        .insert(newNote)
        .select()

      if (error) {
        console.error('Erro do Supabase:', error)
        throw error
      }

      console.log('Nota criada com sucesso:', data)

      const createdNote = data[0]
      const travelNote: TravelNote = {
        id: createdNote.id,
        title: createdNote.title,
        content: createdNote.content,
        folderId: createdNote.folder_id,
        createdAt: new Date(createdNote.created_at),
        updatedAt: new Date(createdNote.updated_at),
      }

      setNotes(prev => [...prev, travelNote])
      return travelNote
    } catch (error) {
      console.error('Erro ao criar nota:', error)
      return null
    }
  }, [user])

  const updateNote = useCallback(async (id: string, updates: Partial<TravelNote>) => {
    if (!user) return

    try {
      const updateData: any = {
        updated_at: new Date().toISOString(),
      }

      if (updates.title !== undefined) updateData.title = updates.title
      if (updates.content !== undefined) updateData.content = updates.content
      if (updates.folderId !== undefined) updateData.folder_id = updates.folderId

      const { error } = await supabase
        .from('notes')
        .update(updateData)
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setNotes(prev => 
        prev.map(note => 
          note.id === id 
            ? { ...note, ...updates, updatedAt: new Date() }
            : note
        )
      )
    } catch (error) {
      console.error('Erro ao atualizar nota:', error)
    }
  }, [user])

  const deleteNote = useCallback(async (id: string) => {
    if (!user) return

    try {
      const { error } = await supabase
        .from('notes')
        .delete()
        .eq('id', id)
        .eq('user_id', user.id)

      if (error) throw error

      setNotes(prev => prev.filter(note => note.id !== id))
      if (selectedNoteId === id) {
        setSelectedNoteId(null)
      }
    } catch (error) {
      console.error('Erro ao deletar nota:', error)
    }
  }, [user, selectedNoteId])

  const getFoldersByParent = useCallback((parentId?: string) => {
    const result = folders.filter(folder => folder.parentId === parentId)
    console.log(`getFoldersByParent(${parentId || 'root'}) retornou:`, result.length, 'pastas')
    return result
  }, [folders])

  const getNotesByFolder = useCallback((folderId: string) => {
    return notes.filter(note => note.folderId === folderId)
  }, [notes])

  const getFolder = useCallback((id: string) => {
    return folders.find(folder => folder.id === id)
  }, [folders])

  const getNote = useCallback((id: string) => {
    return notes.find(note => note.id === id)
  }, [notes])

  return {
    folders,
    notes,
    selectedFolderId,
    selectedNoteId,
    setSelectedFolderId,
    setSelectedNoteId,
    createFolder,
    updateFolder,
    deleteFolder,
    createNote,
    updateNote,
    deleteNote,
    getFoldersByParent,
    getNotesByFolder,
    getFolder,
    getNote,
    loading,
    refreshData: loadData,
  }
}
