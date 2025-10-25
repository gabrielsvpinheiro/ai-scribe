import React from 'react';
import { Note } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Calendar, User, FileText, Mic } from 'lucide-react';

interface NotesListProps {
  notes: Note[];
  onNoteClick: (noteId: string) => void;
}

const NotesList: React.FC<NotesListProps> = ({ notes, onNoteClick }) => {
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPreview = (note: Note) => {
    if (note.summary) {
      return note.summary.substring(0, 100) + (note.summary.length > 100 ? '...' : '');
    }
    if (note.transcription) {
      return note.transcription.substring(0, 100) + (note.transcription.length > 100 ? '...' : '');
    }
    return note.content.substring(0, 100) + (note.content.length > 100 ? '...' : '');
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Notes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {notes.length === 0 ? (
            <p className="text-muted-foreground text-center py-8">
              No notes found. Create your first note above.
            </p>
          ) : (
            notes.map((note) => (
              <div
                key={note.id}
                className="border rounded-lg p-4 hover:bg-accent cursor-pointer transition-colors"
                onClick={() => onNoteClick(note.id)}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-2">
                      <User className="h-4 w-4 text-muted-foreground" />
                      <span className="font-medium">
                        {note.patient.firstName} {note.patient.lastName}
                      </span>
                      <span className="text-sm text-muted-foreground">
                        ({note.patient.patientId})
                      </span>
                    </div>
                    <p className="text-sm text-muted-foreground mb-2">
                      {getPreview(note)}
                    </p>
                    <div className="flex items-center gap-4 text-xs text-muted-foreground">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(note.createdAt)}
                      </div>
                      {note.audioUrl && (
                        <div className="flex items-center gap-1">
                          <Mic className="h-3 w-3" />
                          Audio
                        </div>
                      )}
                      {note.summary && (
                        <div className="flex items-center gap-1">
                          <FileText className="h-3 w-3" />
                          AI Summary
                        </div>
                      )}
                    </div>
                  </div>
                  <Button variant="ghost" size="sm">
                    View
                  </Button>
                </div>
              </div>
            ))
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default NotesList;
