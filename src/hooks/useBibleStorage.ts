import { useState, useEffect } from 'react';
import { Folder, SavedVerse } from '@/types/bible';
import { supabase } from '@/lib/supabase';
import { useToast } from '@/hooks/use-toast';

export const useBibleStorage = () => {
  const [folders, setFolders] = useState<Folder[]>([]);
  const [savedVerses, setSavedVerses] = useState<SavedVerse[]>([]);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  useEffect(() => {
    fetchFolders();
    fetchVerses();
  }, []);

  const fetchFolders = async () => {
    const { data, error } = await supabase
      .from('folders')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error loading folders',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      const mappedFolders = (data || []).map(f => ({
        id: String(f.id),
        name: f.name,
        description: f.description || undefined,
        createdAt: new Date(f.created_at).getTime()
      }));
      setFolders(mappedFolders);
    }
    setLoading(false);
  };

  const fetchVerses = async () => {
    const { data, error } = await supabase
      .from('saved_verses')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      toast({
        title: 'Error loading verses',
        description: error.message,
        variant: 'destructive'
      });
    } else {
      const mappedVerses = (data || []).map(v => ({
        id: String(v.id),
        folderId: String(v.folder_id),
        book: v.book,
        chapter: v.chapter,
        verse: v.verse,
        text: v.text,
        notes: v.notes || undefined,
        createdAt: new Date(v.created_at).getTime()
      }));
      setSavedVerses(mappedVerses);
    }
  };

  const createFolder = async (name: string, description?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const { data, error } = await supabase
      .from('folders')
      .insert({
        user_id: user.id,
        name,
        description,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error creating folder',
        description: error.message,
        variant: 'destructive'
      });
      return null;
    }

    const mappedFolder: Folder = {
      id: String(data.id),
      name: data.name,
      description: data.description || undefined,
      createdAt: new Date(data.created_at).getTime()
    };

    setFolders([mappedFolder, ...folders]);
    return mappedFolder;
  };

  const deleteFolder = async (folderId: string) => {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', parseInt(folderId));

    if (error) {
      toast({
        title: 'Error deleting folder',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    setFolders(folders.filter(f => f.id !== folderId));
    setSavedVerses(savedVerses.filter(v => v.folderId !== folderId));
  };

  const saveVerse = async (book: string, chapter: number, verse: number, text: string, folderId: string, notes?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return;

    const { data, error } = await supabase
      .from('saved_verses')
      .insert({
        user_id: user.id,
        folder_id: parseInt(folderId),
        book,
        chapter,
        verse,
        text,
        notes,
      })
      .select()
      .single();

    if (error) {
      toast({
        title: 'Error saving verse',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    const mappedVerse: SavedVerse = {
      id: String(data.id),
      folderId: String(data.folder_id),
      book: data.book,
      chapter: data.chapter,
      verse: data.verse,
      text: data.text,
      notes: data.notes || undefined,
      createdAt: new Date(data.created_at).getTime()
    };

    setSavedVerses([mappedVerse, ...savedVerses]);
  };

  const deleteVerse = async (verseId: string) => {
    const { error } = await supabase
      .from('saved_verses')
      .delete()
      .eq('id', parseInt(verseId));

    if (error) {
      toast({
        title: 'Error deleting verse',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    setSavedVerses(savedVerses.filter(v => v.id !== verseId));
  };

  const moveVerse = async (verseId: string, newFolderId: string) => {
    const { error } = await supabase
      .from('saved_verses')
      .update({ folder_id: parseInt(newFolderId) })
      .eq('id', parseInt(verseId));

    if (error) {
      toast({
        title: 'Error moving verse',
        description: error.message,
        variant: 'destructive'
      });
      return;
    }

    setSavedVerses(savedVerses.map(v => 
      v.id === verseId ? { ...v, folderId: newFolderId } : v
    ));
  };

  return {
    folders,
    savedVerses,
    createFolder,
    deleteFolder,
    saveVerse,
    deleteVerse,
    moveVerse,
    loading,
  };
};
