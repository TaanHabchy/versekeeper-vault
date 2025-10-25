import {useEffect, useRef, useState} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {BookmarkCheck, Search} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Folder} from '@/types/bible';

interface ReadingPaneProps {
  book: string | null;
  chapter: string | null;
  folders: Folder[];
  savedVerseKeys: Set<string>;
  onSaveVerse: (
      book: string,
      chapter: number,
      verse: number,
      text: string,
      folderId: string
  ) => void;
  onSearch: () => void;
  chapters: string[];
  allChapterVerses: { [chapter: string]: { [verse: string]: string } };
  onChapterChange: (chapter: string) => void;
  selectedFolderId: string | null;
}

export const ReadingPane = ({
                              book,
                              chapter,
                              folders,
                              savedVerseKeys,
                              onSaveVerse,
                              onSearch,
                              chapters,
                              allChapterVerses,
                              onChapterChange,
                              selectedFolderId,
                            }: ReadingPaneProps) => {
  const [selectedVerse, setSelectedVerse] = useState<{
    verse: string;
    text: string;
  } | null>(null);
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<{ [key: string]: HTMLElement | null }>({});

  // Scroll to chapter when chapter prop changes
  useEffect(() => {
    if (chapter && chapterRefs.current[chapter]) {
      const scrollContainer = scrollAreaRef.current?.querySelector(
          '[data-radix-scroll-area-viewport]'
      ) as HTMLElement | null;
      const element = chapterRefs.current[chapter];

      if (scrollContainer && element) {
        scrollContainer.scrollTo({
          top: element.offsetTop - 32, // offset for padding
          behavior: 'smooth',
        });
      }
    }
  }, [chapter]);


  useEffect(() => {
    const scrollContainer = scrollAreaRef.current?.querySelector('[data-radix-scroll-area-viewport]');
    if (!scrollContainer) return;

    const handleScroll = () => {
      const scrollTop = scrollContainer.scrollTop;
      const containerHeight = scrollContainer.clientHeight;
      const midPoint = scrollTop + containerHeight / 3;

      for (const ch of chapters) {
        const element = chapterRefs.current[ch];
        if (element) {
          const rect = element.getBoundingClientRect();
          const containerRect = scrollContainer.getBoundingClientRect();
          const elementTop = rect.top - containerRect.top + scrollTop;
          const elementBottom = elementTop + rect.height;

          if (elementTop <= midPoint && elementBottom > midPoint) {
            onChapterChange(ch);
            break;
          }
        }
      }
    };

    scrollContainer.addEventListener('scroll', handleScroll);
    return () => scrollContainer.removeEventListener('scroll', handleScroll);
  }, [chapters, onChapterChange]);

  if (!book || !chapters || chapters.length === 0) {
    return (
        <div className="flex-1 flex items-center justify-center bg-background">
          <p className="text-muted-foreground">
            Select a book and chapter to read
          </p>
        </div>
    );
  }

  return (
      <div className="flex-1 flex flex-col bg-background">
        <div className="border-b border-border p-4 flex items-center justify-between">
          <h1 className="text-2xl font-bold text-foreground">{book}</h1>
          <div className="flex gap-2">
            <Button variant="outline" size="sm">
              <BookmarkCheck className="h-4 w-4 mr-2" />
              Read
            </Button>
            <Button variant="outline" size="sm" onClick={onSearch}>
              <Search className="h-4 w-4 mr-2" />
              Search
            </Button>
          </div>
        </div>

        {/* Main scroll container */}
        <ScrollArea
            ref={scrollAreaRef}
            className="flex-1 p-8 overflow-y-scroll snap-y snap-mandatory"
        >
          <div className="max-w-3xl mx-auto">
            {chapters.map((ch, index) => {
              const verses = allChapterVerses[ch];
              if (!verses) return null;

              return (
                  <section
                      key={ch}
                      ref={(el) => { chapterRefs.current[ch] = el; }}
                      className="my-12 snap-start scroll-mt-8 p-4 bg-background rounded-xl shadow-sm"
                  >
                    <h2 className="text-xl font-semibold mb-6">
                      {book} {ch}
                    </h2>

                    <div className="space-y-4">
                      {Object.entries(verses).map(([verse, text]) => {
                        const verseKey = `${book}-${ch}-${verse}`;
                        const isSaved = savedVerseKeys.has(verseKey);

                        return (
                            <div key={verse} className="group flex gap-4 items-start">
                        <span className="text-sm font-semibold text-primary min-w-[2rem]">
                          {verse}
                        </span>
                              <div className="flex-1 flex items-start gap-2">
                                <p    onClick={() => {
                                  if (selectedFolderId && book && chapter) {
                                    onSaveVerse(
                                        book,
                                        parseInt(chapter),
                                        parseInt(verse),
                                        text,
                                        selectedFolderId
                                    );
                                  }
                                }
                                }
                                    className={cn(
                                        "text-foreground leading-relaxed flex-1 hover:bg-gray-50 " +
                                        "rounded-lg px-2 cursor-pointer",
                                        isSaved && 'bg-blue-50'
                                    )}
                                     >
                                  {text}
                                </p>
                              </div>
                            </div>
                        );
                      })}
                    </div>
                  </section>
              );
            })}
          </div>
        </ScrollArea>
      </div>
  );
};
