import {useEffect, useRef, useState} from 'react';
import {ScrollArea} from '@/components/ui/scroll-area';
import {Button} from '@/components/ui/button';
import {BookmarkCheck, Search, Share} from 'lucide-react';
import {cn} from '@/lib/utils';
import {Folder} from '@/types/bible';
import {useToast} from '@/hooks/use-toast';

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
  const scrollAreaRef = useRef<HTMLDivElement>(null);
  const chapterRefs = useRef<{ [key: string]: HTMLElement | null }>({});
  const [zen, setZen] = useState(false);
  const { toast } = useToast();

  const handleShareVerse = async (book: string, chapter: string, verse: string, text: string) => {
    const verseReference = `${book} ${chapter}:${verse}`;
    const shareText = `"${text}"\n\n${verseReference}`;
    const shareUrl = `${window.location.origin}?book=${encodeURIComponent(book)}&chapter=${chapter}&verse=${verse}`;

    try {
      if (navigator.share) {
        await navigator.share({
          title: verseReference,
          text: shareText,
          url: shareUrl,
        });
      } else {
        await navigator.clipboard.writeText(`${shareText}\n\n${shareUrl}`);
        toast({
          title: "Copied to clipboard",
          description: "Verse link copied successfully",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
    }
  };

  useEffect(() => {
    if (chapter && chapterRefs.current[chapter]) {
      chapterRefs.current[chapter]?.scrollIntoView({
        behavior: 'instant',
        block: 'start'
      });
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
        <div className="flex-1 flex items-center justify-center bg-card">
          <p className="text-muted-foreground">
            Select a book and chapter to read
          </p>
        </div>
    );
  }

  return (
      <div className={cn(
          "flex flex-col bg-card",
          zen ? "fixed inset-0 z-50 h-full" : "flex-1"
      )}>
        <div className=" p-4 flex items-center justify-between">
          <h1 className={cn(
              "text-2xl font-bold text-foreground ",
              zen ? "opacity-0" : ""
          )}>{book}</h1>
          <div className="flex gap-2">
            {!zen ? <Button variant="outline" size="sm" onClick={onSearch}>
              <Search className="h-4 w-4 mr-2"/>
              Search
            </Button> : null}
            <Button variant="outline" size="sm" onClick={() => setZen(!zen)}>
              Zen
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
                      className="my-12 snap-start scroll-mt-8 p-4 bg-card rounded-xl shadow-sm"
                  >
                    <h2 className="text-xl font-semibold mb-6 text-accent">
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
                                  if (selectedFolderId && book && chapter && !isSaved) {
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
                                        isSaved && 'bg-accent/10'
                                    )}
                                     >
                                  {text}
                                </p>
                                <Share 
                                  className="h-4 w-4 opacity-0 group-hover:opacity-100 cursor-pointer transition-opacity" 
                                  onClick={() => handleShareVerse(book, ch, verse, text)}
                                />
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
