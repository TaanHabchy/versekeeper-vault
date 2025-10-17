import { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Search } from 'lucide-react';
import { BibleData } from '@/types/bible';

interface SearchResult {
  book: string;
  chapter: string;
  verse: string;
  text: string;
}

interface SearchDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  bibleData: BibleData;
  onResultClick: (book: string, chapter: string) => void;
}

export const SearchDialog = ({ open, onOpenChange, bibleData, onResultClick }: SearchDialogProps) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [results, setResults] = useState<SearchResult[]>([]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (query.trim().length < 3) {
      setResults([]);
      return;
    }

    const searchResults: SearchResult[] = [];
    const lowerQuery = query.toLowerCase();

    Object.entries(bibleData).forEach(([book, chapters]) => {
      Object.entries(chapters).forEach(([chapter, verses]) => {
        Object.entries(verses).forEach(([verse, text]) => {
          if (text.toLowerCase().includes(lowerQuery)) {
            searchResults.push({ book, chapter, verse, text });
            if (searchResults.length >= 50) return;
          }
        });
        if (searchResults.length >= 50) return;
      });
      if (searchResults.length >= 50) return;
    });

    setResults(searchResults);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh] flex flex-col">
        <DialogHeader>
          <DialogTitle>Search the Bible</DialogTitle>
        </DialogHeader>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search for verses..."
            value={searchQuery}
            onChange={(e) => handleSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <ScrollArea className="flex-1 -mx-6 px-6">
          <div className="space-y-3 py-4">
            {searchQuery.length < 3 && (
              <p className="text-sm text-muted-foreground text-center">
                Enter at least 3 characters to search
              </p>
            )}
            {searchQuery.length >= 3 && results.length === 0 && (
              <p className="text-sm text-muted-foreground text-center">
                No results found
              </p>
            )}
            {results.map((result, index) => (
              <div
                key={`${result.book}-${result.chapter}-${result.verse}-${index}`}
                className="p-3 bg-muted rounded-md cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => {
                  onResultClick(result.book, result.chapter);
                  onOpenChange(false);
                }}
              >
                <p className="text-xs font-semibold text-accent mb-1">
                  {result.book} {result.chapter}:{result.verse}
                </p>
                <p className="text-sm text-foreground">{result.text}</p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
};
