import { useState, useEffect } from 'react';
import { Folder, SavedVerse } from '@/types/bible';

const FOLDERS_KEY = 'bible_folders';
const VERSES_KEY = 'bible_verses';

export const useBibleStorage = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);

  useEffect(() => {
    const storedFolders = localStorage.getItem(FOLDERS_KEY);
    const storedVerses = localStorage.getItem(VERSES_KEY);
    
    if (storedFolders) setFolders(JSON.parse(storedFolders));
    if (storedVerses) setSavedVerses(JSON.parse(storedVerses));
  }, []);

  const saveToStorage = (key: string, data: any) => {
    localStorage.setItem(key, JSON.stringify(data));
  };

  const createFolder = (name: string, description?: string) => {
    const newFolder: Folder = {
      id: crypto.randomUUID(),
      name,
      description,
      createdAt: Date.now(),
    };
    const updated = [...folders, newFolder];
    setFolders(updated);
    saveToStorage(FOLDERS_KEY, updated);
    return newFolder;
  };

  const deleteFolder = (folderId: string) => {
    const updatedFolders = folders.filter(f => f.id !== folderId);
    const updatedVerses = savedVerses.filter(v => v.folderId !== folderId);
    setFolders(updatedFolders);
    setSavedVerses(updatedVerses);
    saveToStorage(FOLDERS_KEY, updatedFolders);
    saveToStorage(VERSES_KEY, updatedVerses);
  };

  const saveVerse = (book: string, chapter: number, verse: number, text: string, folderId: string, notes?: string) => {
    const newVerse: SavedVerse = {
      id: crypto.randomUUID(),
      folderId,
      book,
      chapter,
      verse,
      text,
      notes,
      createdAt: Date.now(),
    };
    const updated = [...savedVerses, newVerse];
    setSavedVerses(updated);
    saveToStorage(VERSES_KEY, updated);
  };

  const deleteVerse = (verseId: string) => {
    const updated = savedVerses.filter(v => v.id !== verseId);
    setSavedVerses(updated);
    saveToStorage(VERSES_KEY, updated);
  };

  const moveVerse = (verseId: string, newFolderId: string) => {
    const updated = savedVerses.map(v => 
      v.id === verseId ? { ...v, folderId: newFolderId } : v
    );
    setSavedVerses(updated);
    saveToStorage(VERSES_KEY, updated);
  };

  return {
    folders,
    savedVerses,
    createFolder,
    deleteFolder,
    saveVerse,
    deleteVerse,
    moveVerse,
  };
};
