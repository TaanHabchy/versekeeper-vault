import { ScrollArea } from '@/components/ui/scroll-area';
import { Button } from '@/components/ui/button';
import { Bookmark, Plus, Trash2, FolderOpen } from 'lucide-react';
import { Folder, SavedVerse } from '@/types/bible';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { cn } from '@/lib/utils';

interface SavedVersesSidebarProps {
  folders: Folder[];
  savedVerses: SavedVerse[];
  selectedFolderId: string | null;
  onSelectFolder: (folderId: string | null) => void;
  onCreateFolder: (name: string, description?: string) => void;
  onDeleteFolder: (folderId: string) => void;
  onDeleteVerse: (verseId: string) => void;
  onVerseClick: (book: string, chapter: number) => void;
}

export const SavedVersesSidebar = ({
  folders,
  savedVerses,
  selectedFolderId,
  onSelectFolder,
  onCreateFolder,
  onDeleteFolder,
  onDeleteVerse,
  onVerseClick,
}: SavedVersesSidebarProps) => {
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderDescription, setNewFolderDescription] = useState('');
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const handleCreateFolder = () => {
    if (newFolderName.trim()) {
      onCreateFolder(newFolderName.trim(), newFolderDescription.trim());
      setNewFolderName('');
      setNewFolderDescription('');
      setIsDialogOpen(false);
    }
  };

  const filteredVerses = selectedFolderId
    ? savedVerses.filter(v => (v.folderId || v.folder_id) === selectedFolderId)
    : savedVerses;

  return (
    <div className="w-80 border-l border-border bg-card flex flex-col">
      <div className="p-4 mb-4 border-b border-border">
        <div className="flex items-center justify-between mb-3">
          <h3 className="font-semibold text-sm text-foreground">Collections</h3>
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="ghost" size="sm">
                <Plus className="h-4 w-4 mr-1" />
                New
              </Button>
            </DialogTrigger>
            <DialogContent>
              <DialogHeader>
                <DialogTitle>Create New Collection</DialogTitle>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="folder-name">Name</Label>
                  <Input
                    id="folder-name"
                    value={newFolderName}
                    onChange={(e) => setNewFolderName(e.target.value)}
                    placeholder="e.g., Favorite Verses"
                  />
                </div>
                <div>
                  <Label htmlFor="folder-description">Description (optional)</Label>
                  <Textarea
                    id="folder-description"
                    value={newFolderDescription}
                    onChange={(e) => setNewFolderDescription(e.target.value)}
                    placeholder="What is this collection about?"
                  />
                </div>
                <Button onClick={handleCreateFolder} className="w-full">
                  Create Collection
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>

        <div className="space-y-1">
          {folders.map((folder) => (
            <div key={folder.id} className="flex items-center gap-1">
              <button
                onClick={() => {
                  onSelectFolder(folder.id)
                }}
                className={cn(
                  "flex-1 flex items-center gap-2 px-3 py-2 rounded text-sm transition-colors",
                  selectedFolderId === folder.id
                    ? "bg-accent/10 text-accent font-medium"
                    : "text-foreground hover:bg-muted"
                )}
              >
                {folder.name}{selectedFolderId === folder.id ? " • " + filteredVerses.length : null}
              </button>
              <Button
                variant="ghost"
                size="sm"
                className="h-8 w-8 p-0"
                onClick={() => onDeleteFolder(folder.id)}
              >
                <Trash2 className="h-3 w-3" />
              </Button>
            </div>
          ))}
        </div>
      </div>

      <div className="flex-1 overflow-hidden flex flex-col">
        <ScrollArea className="flex-1 px-4">
          <div className="space-y-3 pb-4">
            {filteredVerses.map((verse) => (
              <div
                key={verse.id}
                className="p-3 bg-background rounded-md space-y-2 group cursor-pointer hover:bg-muted/80 transition-colors"
                onClick={() => onVerseClick(verse.book, verse.chapter)}
              >
                <div className="flex items-start justify-between">
                  <p className="text-xs font-semibold text-accent">
                    {verse.book} {verse.chapter}:{verse.verse}
                  </p>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="h-6 w-6 p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => {
                      e.stopPropagation();
                      onDeleteVerse(verse.id);
                    }}
                  >
                    <Trash2 className="h-3 w-3" />
                  </Button>
                </div>
                <p className="text-xs text-foreground leading-relaxed line-clamp-3">
                  {verse.text}
                </p>
              </div>
            ))}
          </div>
        </ScrollArea>
      </div>
    </div>
  );
};
