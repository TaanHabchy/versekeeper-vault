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
      setFolders(data || []);
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
      setSavedVerses(data || []);
    }
  };

  const createFolder = async (name: string, description?: string) => {
    const { data: { user } } = await supabase.auth.getUser();
    if (!user) return null;

    const newFolder = {
      user_id: user.id,
      name,
      description,
      created_at: Date.now(),
    };

    const { data, error } = await supabase
      .from('folders')
      .insert(newFolder)
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

    setFolders([data, ...folders]);
    return data;
  };

  const deleteFolder = async (folderId: string) => {
    const { error } = await supabase
      .from('folders')
      .delete()
      .eq('id', folderId);

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

    const newVerse = {
      user_id: user.id,
      folder_id: folderId,
      book,
      chapter,
      verse,
      text,
      notes,
      created_at: Date.now(),
    };

    const { data, error } = await supabase
      .from('saved_verses')
      .insert(newVerse)
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

    setSavedVerses([data, ...savedVerses]);
  };

  const deleteVerse = async (verseId: string) => {
    const { error } = await supabase
      .from('saved_verses')
      .delete()
      .eq('id', verseId);

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
      .update({ folder_id: newFolderId })
      .eq('id', verseId);

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
