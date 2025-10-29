import { useState, useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import bibleData from '@/data/bible.json';
import { BibleData } from '@/types/bible';
import { BooksList } from '@/components/BibleReader/BooksList';
import { ChaptersList } from '@/components/BibleReader/ChaptersList';
import { ReadingPane } from '@/components/BibleReader/ReadingPane';
import { SavedVersesSidebar } from '@/components/BibleReader/SavedVersesSidebar';
import { SearchDialog } from '@/components/BibleReader/SearchDialog';
import { useBibleStorage } from '@/hooks/useBibleStorage';
import { supabase } from '@/lib/supabase';
import { User } from '@supabase/supabase-js';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { Book, List, Bookmark, LogOut } from 'lucide-react';

const Index = () => {
  const bible = bibleData as BibleData;
  const books = Object.keys(bible);
  const navigate = useNavigate();
  
  const [user, setUser] = useState<User | null>(null);
  const [selectedBook, setSelectedBook] = useState<string | null>(null);
  const [selectedChapter, setSelectedChapter] = useState<string | null>(null);
  const [selectedFolderId, setSelectedFolderId] = useState<string | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isBooksOpen, setIsBooksOpen] = useState(false);
  const [isChaptersOpen, setIsChaptersOpen] = useState(false);
  const [isSavedOpen, setIsSavedOpen] = useState(false);

  useEffect(() => {
    supabase.auth.getSession().then(({ data: { session } }) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      }
    });

    const { data: { subscription } } = supabase.auth.onAuthStateChange((event, session) => {
      setUser(session?.user ?? null);
      if (!session) {
        navigate('/auth');
      }
    });

    return () => subscription.unsubscribe();
  }, [navigate]);

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };
  
  const {
    folders,
    savedVerses,
    createFolder,
    deleteFolder,
    saveVerse,
    deleteVerse,
  } = useBibleStorage();

  const chapters = selectedBook ? Object.keys(bible[selectedBook]) : [];
  const allChapterVerses = selectedBook ? bible[selectedBook] : {};

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
    setIsBooksOpen(false);
    setIsChaptersOpen(true);
  };

  const handleVerseClick = (book: string, chapter: number) => {
    setSelectedBook(book);
    setSelectedChapter(chapter.toString());
  };

  const handleSearchResultClick = (book: string, chapter: string) => {
    setSelectedBook(book);
    setSelectedChapter(chapter);
  };

  if (!user) {
    return null;
  }

  return (
    <div className="flex h-screen overflow-hidden flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden flex items-center justify-between p-3 border-b border-border bg-card">
        <div className="flex items-center gap-2">
          <Sheet open={isBooksOpen} onOpenChange={setIsBooksOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Book className="h-4 w-4 mr-2" />
                {selectedBook || 'Books'}
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="w-[280px] p-0">
              <BooksList 
                books={books} 
                selectedBook={selectedBook} 
                onSelectBook={handleSelectBook} 
              />
            </SheetContent>
          </Sheet>

          {selectedBook && (
            <Sheet open={isChaptersOpen} onOpenChange={setIsChaptersOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="sm">
                  <List className="h-4 w-4 mr-2" />
                  {selectedChapter || 'Ch'}
                </Button>
              </SheetTrigger>
              <SheetContent side="left" className="w-[200px] p-0">
                <ChaptersList 
                  chapters={chapters} 
                  selectedChapter={selectedChapter} 
                  onSelectChapter={(ch) => {
                    setSelectedChapter(ch);
                    setIsChaptersOpen(false);
                  }} 
                />
              </SheetContent>
            </Sheet>
          )}
        </div>

        <div className="flex items-center gap-2">
          <Sheet open={isSavedOpen} onOpenChange={setIsSavedOpen}>
            <SheetTrigger asChild>
              <Button variant="outline" size="sm">
                <Bookmark className="h-4 w-4" />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[320px] p-0">
              <SavedVersesSidebar
                folders={folders}
                savedVerses={savedVerses}
                selectedFolderId={selectedFolderId}
                onSelectFolder={setSelectedFolderId}
                onCreateFolder={createFolder}
                onDeleteFolder={deleteFolder}
                onDeleteVerse={deleteVerse}
                onVerseClick={(book, chapter) => {
                  handleVerseClick(book, chapter);
                  setIsSavedOpen(false);
                }}
              />
            </SheetContent>
          </Sheet>

          <Button variant="ghost" size="sm" onClick={handleLogout}>
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Desktop Sidebars */}
      <div className="hidden md:block">
        <BooksList 
          books={books} 
          selectedBook={selectedBook} 
          onSelectBook={handleSelectBook} 
        />
      </div>
      
      {selectedBook && (
        <div className="hidden md:block">
          <ChaptersList 
            chapters={chapters} 
            selectedChapter={selectedChapter} 
            onSelectChapter={setSelectedChapter} 
          />
        </div>
      )}
      
      <ReadingPane 
        book={selectedBook}
        chapter={selectedChapter}
        folders={folders}
        savedVerseKeys={savedVerseKeys}
        onSaveVerse={saveVerse}
        onSearch={() => setIsSearchOpen(true)}
        chapters={chapters}
        allChapterVerses={allChapterVerses}
        onChapterChange={setSelectedChapter}
        selectedFolderId={selectedFolderId}
      />
      
      <div className="hidden md:block">
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
      </div>

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
