import React, { useState } from 'react';
import { Patient, Note } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, User, Calendar, Mail, Phone, MapPin, Trash2, FileText, Mic } from 'lucide-react';
import DeleteNoteDialog from './DeleteNoteDialog';

interface PatientDetailProps {
  patient: Patient;
  onBack: () => void;
  onNoteClick: (noteId: string) => void;
  onDeleteNote: (noteId: string) => void;
}

const PatientDetail: React.FC<PatientDetailProps> = ({ patient, onBack, onNoteClick, onDeleteNote }) => {
  const [deletingNoteId, setDeletingNoteId] = useState<string | null>(null);
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [noteToDelete, setNoteToDelete] = useState<string | null>(null);

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getPreview = (note: Note) => {
    const previewContent = note.summary || note.transcription || note.content;
    return previewContent ? `${previewContent.substring(0, 150)}...` : 'No content preview';
  };

  const handleDeleteClick = (noteId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    setNoteToDelete(noteId);
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!noteToDelete) return;
    
    setDeletingNoteId(noteToDelete);
    try {
      await onDeleteNote(noteToDelete);
      setDeleteDialogOpen(false);
      setNoteToDelete(null);
    } finally {
      setDeletingNoteId(null);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <Button 
              variant="outline" 
              onClick={onBack}
              className="hover:bg-accent transition-colors"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Dashboard
            </Button>
            <h1 className="text-3xl font-bold text-foreground">Patient Details</h1>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-1">
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="flex items-center gap-3 text-xl">
                    <div className="p-2 bg-primary/10 rounded-lg">
                      <User className="h-5 w-5 text-primary" />
                    </div>
                    Patient Information
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-5">
                  <div className="space-y-2">
                    <h3 className="text-2xl font-bold text-foreground">
                      {patient.firstName} {patient.lastName}
                    </h3>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-medium text-muted-foreground">Patient ID:</span>
                      <span className="text-sm font-mono bg-muted px-2 py-1 rounded">
                        {patient.patientId}
                      </span>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-border space-y-3">
                    <div className="flex items-center gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                      <Calendar className="h-4 w-4 text-primary flex-shrink-0" />
                      <div>
                        <span className="text-xs text-muted-foreground block">Date of Birth</span>
                        <span className="font-medium text-foreground">
                          {formatDate(patient.dateOfBirth)}
                        </span>
                      </div>
                    </div>

                    {patient.email && (
                      <div className="flex items-center gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                        <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block">Email</span>
                          <span className="font-medium text-foreground break-all">
                            {patient.email}
                          </span>
                        </div>
                      </div>
                    )}

                    {patient.phone && (
                      <div className="flex items-center gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                        <Phone className="h-4 w-4 text-primary flex-shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block">Phone</span>
                          <span className="font-medium text-foreground">
                            {patient.phone}
                          </span>
                        </div>
                      </div>
                    )}

                    {patient.address && (
                      <div className="flex items-center gap-3 text-sm bg-muted/30 p-3 rounded-lg">
                        <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                        <div>
                          <span className="text-xs text-muted-foreground block">Address</span>
                          <span className="font-medium text-foreground">
                            {patient.address}
                          </span>
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </div>

            <div className="lg:col-span-2">
              <Card className="shadow-md">
                <CardHeader className="pb-4">
                  <CardTitle className="text-xl">
                    Patient Notes ({patient.notes?.length || 0})
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!patient.notes || patient.notes.length === 0 ? (
                    <div className="text-center py-12">
                      <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-muted-foreground">
                        No notes found for this patient.
                      </p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {patient.notes.map((note) => (
                        <div
                          key={note.id}
                          className="border rounded-xl p-5 hover:bg-accent cursor-pointer transition-all duration-200 hover:shadow-md bg-card relative group"
                          onClick={() => onNoteClick(note.id)}
                        >
                          <div className="flex items-start justify-between gap-4">
                            <div className="flex-1 min-w-0">
                              <div className="flex items-center gap-3 mb-3">
                                <div className="p-2 bg-primary/10 rounded-lg flex-shrink-0">
                                  <FileText className="h-4 w-4 text-primary" />
                                </div>
                                <div className="flex-1 min-w-0">
                                  <div className="flex items-center gap-2 flex-wrap">
                                    <span className="text-sm font-semibold text-foreground">
                                      Note from {formatDateTime(note.createdAt)}
                                    </span>
                                  </div>
                                </div>
                              </div>
                              
                              <p className="text-sm text-muted-foreground mb-3 leading-relaxed">
                                {getPreview(note)}
                              </p>
                              
                              <div className="flex items-center gap-3 flex-wrap">
                                {note.audioUrl && (
                                  <div className="flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded-md text-xs">
                                    <Mic className="h-3 w-3" />
                                    Audio
                                  </div>
                                )}
                                {note.summary && (
                                  <div className="flex items-center gap-1 bg-green-50 text-green-700 px-2 py-1 rounded-md text-xs">
                                    <FileText className="h-3 w-3" />
                                    AI Summary
                                  </div>
                                )}
                              </div>
                            </div>
                            
                            <div className="flex items-start gap-2 flex-shrink-0">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="hover:bg-primary/10"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  onNoteClick(note.id);
                                }}
                              >
                                View
                              </Button>
                              <Button
                                variant="ghost"
                                size="sm"
                                className="hover:bg-destructive/10 hover:text-destructive"
                                onClick={(e) => handleDeleteClick(note.id, e)}
                                disabled={deletingNoteId === note.id}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
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
        isDeleting={deletingNoteId !== null}
      />
    </div>
  );
};

export default PatientDetail;

