import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface ChaptersListProps {
  chapters: string[];
  selectedChapter: string | null;
  onSelectChapter: (chapter: string) => void;
}

export const ChaptersList = ({ chapters, selectedChapter, onSelectChapter }: ChaptersListProps) => {
  return (
    <div className="w-20 border-r border-border bg-card h-full">
      <ScrollArea className="h-full">
        <div className="p-2 space-y-1">
          {chapters.map((chapter) => (
            <button
              key={chapter}
              onClick={() => onSelectChapter(chapter)}
              className={cn(
                "w-full px-3 py-2 rounded text-sm font-medium transition-colors",
                selectedChapter === chapter
                  ? "bg-secondary"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {chapter}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
