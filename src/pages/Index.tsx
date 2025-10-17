import { useState, useMemo } from 'react';
import bibleData from '@/data/bible.json';
import { BibleData } from '@/types/bible';
import { BooksList } from '@/components/BibleReader/BooksList';
import { ChaptersList } from '@/components/BibleReader/ChaptersList';
import { ReadingPane } from '@/components/BibleReader/ReadingPane';
import { SavedVersesSidebar } from '@/components/BibleReader/SavedVersesSidebar';
import { SearchDialog } from '@/components/BibleReader/SearchDialog';
import { useBibleStorage } from '@/hooks/useBibleStorage';

const Index = () => {
  const bible = bibleData as BibleData;
  const books = Object.keys(bible);
  
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  
  const {
    folders,
    savedVerses,
    createFolder,
    deleteFolder,
    saveVerse,
    deleteVerse,
  } = useBibleStorage();

  const chapters = selectedBook ? Object.keys(bible[selectedBook]) : [];
  const verses = selectedBook && selectedChapter ? bible[selectedBook][selectedChapter] : null;

  const savedVerseKeys = useMemo(() => {
    const keys = new Set<string>();
    savedVerses.forEach(v => {
      keys.add(`${v.book}-${v.chapter}-${v.verse}`);
    });
    return keys;
  }, [savedVerses]);

  const handleSelectBook = (book: string) => {
    setSelectedBook(book);
    setSelectedChapter(Object.keys(bible[book])[0]);
  };

  const handleVerseClick = (book: string, chapter: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter.toString());
  };

  const handleSearchResultClick = (book: string, chapter: string) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
  };

  const handleNextChapter = () => {
    if (!selectedBook || !selectedChapter) return;
    
    const currentChapters = Object.keys(bible[selectedBook]);
    const currentIndex = currentChapters.indexOf(selectedChapter);
    
    if (currentIndex < currentChapters.length - 1) {
      setSelectedChapter(currentChapters[currentIndex + 1]);
    }
  };

  return (
    <div className="flex h-screen overflow-hidden">
      <BooksList 
        books={books} 
        selectedBook={selectedBook} 
        onSelectBook={handleSelectBook} 
      />
      
      {selectedBook && (
        <ChaptersList 
          chapters={chapters} 
          selectedChapter={selectedChapter} 
          onSelectChapter={setSelectedChapter} 
        />
      )}
      
      <ReadingPane 
        book={selectedBook}
        chapter={selectedChapter}
        verses={verses}
        folders={folders}
        savedVerseKeys={savedVerseKeys}
        onSaveVerse={saveVerse}
        onSearch={() => setIsSearchOpen(true)}
        chapters={chapters}
        onNextChapter={handleNextChapter}
      />
      
      <SavedVersesSidebar 
        folders={folders}
        savedVerses={savedVerses}
        selectedFolderId={selectedFolderId}
        onSelectFolder={setSelectedFolderId}
        onCreateFolder={createFolder}
        onDeleteFolder={deleteFolder}
        onDeleteVerse={deleteVerse}
        onVerseClick={handleVerseClick}
      />

      <SearchDialog
        open={isSearchOpen}
        onOpenChange={setIsSearchOpen}
        bibleData={bible}
        onResultClick={handleSearchResultClick}
      />
    </div>
  );
};

export default Index;
