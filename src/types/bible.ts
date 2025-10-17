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
  folderId: string;
  book: string;
  chapter: number;
  verse: number;
  text: string;
  notes?: string;
  createdAt: number;
}
