import { useState, useCallback } from 'react';
import { useLocalStorage } from './useLocalStorage';
import { TravelFolder, TravelNote } from '@/types/travel';

export function useTravelData() {
  const [folders, setFolders] = useLocalStorage<TravelFolder[]>('travel-folders', []);
  const [notes, setNotes] = useLocalStorage<TravelNote[]>('travel-notes', []);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

  const createFolder = useCallback((name: string, parentId?: string) => {
    const newFolder: TravelFolder = {
      id: crypto.randomUUID(),
      name,
      parentId,
      children: [],
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setFolders(prev => [...prev, newFolder]);
    return newFolder;
  }, [setFolders]);

  const updateFolder = useCallback((id: string, updates: Partial<TravelFolder>) => {
    setFolders(prev => 
      prev.map(folder => 
        folder.id === id 
          ? { ...folder, ...updates, updatedAt: new Date() }
          : folder
      )
    );
  }, [setFolders]);

  const deleteFolder = useCallback((id: string) => {
    // Delete all notes in this folder and subfolders
    const getAllFolderIds = (folderId: string): string[] => {
      const subfolder = folders.find(f => f.parentId === folderId);
      return subfolder ? [folderId, ...getAllFolderIds(subfolder.id)] : [folderId];
    };
    
    const folderIdsToDelete = getAllFolderIds(id);
    
    setNotes(prev => prev.filter(note => !folderIdsToDelete.includes(note.folderId)));
    setFolders(prev => prev.filter(folder => !folderIdsToDelete.includes(folder.id)));
    
    if (selectedFolderId === id) {
      setSelectedFolderId(null);
    }
  }, [folders, setFolders, setNotes, selectedFolderId]);

  const createNote = useCallback((title: string, folderId: string) => {
    const newNote: TravelNote = {
      id: crypto.randomUUID(),
      title,
      content: '',
      folderId,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    
    setNotes(prev => [...prev, newNote]);
    return newNote;
  }, [setNotes]);

  const updateNote = useCallback((id: string, updates: Partial<TravelNote>) => {
    setNotes(prev => 
      prev.map(note => 
        note.id === id 
          ? { ...note, ...updates, updatedAt: new Date() }
          : note
      )
    );
  }, [setNotes]);

  const deleteNote = useCallback((id: string) => {
    setNotes(prev => prev.filter(note => note.id !== id));
    if (selectedNoteId === id) {
      setSelectedNoteId(null);
    }
  }, [setNotes, selectedNoteId]);

  const getFoldersByParent = useCallback((parentId?: string) => {
    return folders.filter(folder => folder.parentId === parentId);
  }, [folders]);

  const getNotesByFolder = useCallback((folderId: string) => {
    return notes.filter(note => note.folderId === folderId);
  }, [notes]);

  const getFolder = useCallback((id: string) => {
    return folders.find(folder => folder.id === id);
  }, [folders]);

  const getNote = useCallback((id: string) => {
    return notes.find(note => note.id === id);
  }, [notes]);

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
  };
}