import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';

interface BooksListProps {
  books: string[];
  selectedBook: string | null;
  onSelectBook: (book: string) => void;
}

export const BooksList = ({ books, selectedBook, onSelectBook }: BooksListProps) => {
  return (
    <div className="w-48 border-r border-border bg-card">
      <div className="p-4 border-b border-border">
        <h2 className="font-semibold text-sm text-muted-foreground">Old Testament</h2>
      </div>
      <ScrollArea className="h-[calc(100vh-5rem)]">
        <div className="p-2">
          {books.map((book) => (
            <button
              key={book}
              onClick={() => onSelectBook(book)}
              className={cn(
                "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                selectedBook === book
                  ? "bg-secondary text-secondary-foreground font-medium"
                  : "text-foreground hover:bg-muted"
              )}
            >
              {book}
            </button>
          ))}
        </div>
      </ScrollArea>
    </div>
  );
};
