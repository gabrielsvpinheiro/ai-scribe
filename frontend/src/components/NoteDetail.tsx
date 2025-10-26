import React, { useState } from 'react';
import { Note } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, User, Calendar, FileText, Mic, Trash2 } from 'lucide-react';
import DeleteNoteDialog from './DeleteNoteDialog';

interface NoteDetailProps {
  note: Note;
  onBack: () => void;
  onDelete: (noteId: string) => void;
}

const NoteDetail: React.FC<NoteDetailProps> = ({ note, onBack, onDelete }) => {
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatPatientDOB = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const handleDeleteClick = () => {
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    setIsDeleting(true);
    try {
      await onDelete(note.id);
      setDeleteDialogOpen(false);
      onBack();
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-4">
              <Button 
                variant="outline" 
                onClick={onBack}
                className="hover:bg-accent transition-colors w-full sm:w-auto"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Notes
              </Button>
              <h1 className="text-xl sm:text-2xl md:text-3xl font-bold text-foreground">Note Details</h1>
            </div>
            <Button
              variant="destructive"
              onClick={handleDeleteClick}
              className="hover:bg-destructive/90 w-full sm:w-auto"
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete Note
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-6">
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <FileText className="h-5 w-5 text-primary" />
                    </div>
                    Note Content
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  {note.content && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-base text-foreground">Original Content</h4>
                      <div className="bg-muted/50 p-4 rounded-lg border border-border">
                        <p className="text-sm leading-relaxed text-foreground">{note.content}</p>
                      </div>
                    </div>
                  )}

                  {note.transcription && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-base text-foreground">Transcription</h4>
                      <div className="bg-blue-50 p-4 rounded-lg border border-blue-200">
                        <p className="text-sm leading-relaxed text-blue-900">{note.transcription}</p>
                      </div>
                    </div>
                  )}

                  {note.summary && (
                    <div className="space-y-3">
                      <div className="flex items-center gap-2">
                        <h4 className="font-semibold text-base text-foreground">AI Summary</h4>
                        <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full font-medium">
                          SOAP Format
                        </span>
                      </div>
                      <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-5 rounded-lg border-l-4 border-green-500 shadow-sm">
                        <pre className="whitespace-pre-wrap text-sm leading-relaxed text-green-900 font-sans">
                          {note.summary}
                        </pre>
                      </div>
                    </div>
                  )}

                  {note.audioUrl && (
                    <div className="space-y-3">
                      <h4 className="font-semibold text-base text-foreground flex items-center gap-2">
                        <Mic className="h-4 w-4 text-primary" />
                        Audio Recording
                      </h4>
                      <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-5 rounded-lg border border-blue-200 shadow-sm">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-blue-500 rounded-full">
                            <Mic className="h-4 w-4 text-white" />
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-blue-900">Original Recording</p>
                            <p className="text-xs text-blue-700">Listen to the audio note</p>
                          </div>
                        </div>
                        <audio 
                          controls 
                          className="w-full h-10"
                          style={{ 
                            filter: 'hue-rotate(200deg) saturate(1.2)',
                          }}
                        >
                          <source src={`http://localhost:3001${note.audioUrl}`} type="audio/mpeg" />
                          <source src={`http://localhost:3001${note.audioUrl}`} type="audio/wav" />
                          <source src={`http://localhost:3001${note.audioUrl}`} type="audio/mp4" />
                          Your browser does not support the audio element.
                        </audio>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>

            <div className="space-y-6">
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-lg">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <h4 className="font-semibold text-lg text-foreground">
                      {note.patient.firstName} {note.patient.lastName}
                    </h4>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Patient ID:</span>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {note.patient.patientId}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border">
                    <div className="flex items-center gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Date of Birth</span>
                        <span className="font-medium text-foreground">
                          {formatPatientDOB(note.patient.dateOfBirth)}
                        </span>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Note Metadata</CardTitle>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="flex items-center gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                    <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                    <div>
                      <span className="text-xs text-muted-foreground block">Created</span>
                      <span className="font-medium text-foreground">{formatDate(note.createdAt)}</span>
                    </div>
                  </div>
                  
                  {note.audioUrl && (
                    <div className="flex items-center gap-3 text-sm bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <Mic className="h-4 w-4 text-blue-600 flex-shrink-0" />
                      <span className="text-blue-900 font-medium">Audio recording available</span>
                    </div>
                  )}
                  
                  {note.summary && (
                    <div className="flex items-center gap-3 text-sm bg-green-50 p-3 rounded-lg border border-green-200">
                      <FileText className="h-4 w-4 text-green-600 flex-shrink-0" />
                      <span className="text-green-900 font-medium">AI summary generated</span>
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          </div>
        </div>
      </div>

      <DeleteNoteDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleConfirmDelete}
        isDeleting={isDeleting}
      />
    </div>
  );
};

export default NoteDetail;
