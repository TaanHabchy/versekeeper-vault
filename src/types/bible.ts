export interface BibleData {
  [book: string]: {
    [chapter: string]: {
      [verse: string]: string;
    };
  };
}

export interface Folder {
  id: string;
  name: string;
  description?: string;
  createdAt: number;
}

export interface SavedVerse {
  id: string;
  folderId?: string;
  folder_id?: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  notes?: string;
  createdAt?: number;
  created_at?: number;
}
