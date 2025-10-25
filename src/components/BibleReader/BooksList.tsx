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
      <ScrollArea className="h-[100vh]">
        <div className="p-2">
          {books.map((book) => (
            <button
              key={book}
              onClick={() => onSelectBook(book)}
              className={cn(
                "w-full text-left px-3 py-2 rounded text-sm transition-colors",
                selectedBook === book
                  ? "bg-accent/10 text-accent"
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
