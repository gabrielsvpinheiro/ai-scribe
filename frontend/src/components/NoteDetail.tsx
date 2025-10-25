import React from 'react';
import { Note } from '../types';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { ArrowLeft, User, Calendar, Phone, Mail, MapPin, FileText, Mic } from 'lucide-react';

interface NoteDetailProps {
  note: Note;
  onBack: () => void;
}

const NoteDetail: React.FC<NoteDetailProps> = ({ note, onBack }) => {
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

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button variant="outline" onClick={onBack}>
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Notes
        </Button>
        <h1 className="text-2xl font-bold">Note Details</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                Note Content
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {note.content && (
                <div>
                  <h4 className="font-medium mb-2">Original Content:</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{note.content}</p>
                </div>
              )}

              {note.transcription && (
                <div>
                  <h4 className="font-medium mb-2">Transcription:</h4>
                  <p className="text-sm bg-muted p-3 rounded-md">{note.transcription}</p>
                </div>
              )}

              {note.summary && (
                <div>
                  <h4 className="font-medium mb-2">AI Summary (SOAP Format):</h4>
                  <div className="text-sm bg-primary/5 p-3 rounded-md border-l-4 border-primary">
                    <pre className="whitespace-pre-wrap">{note.summary}</pre>
                  </div>
                </div>
              )}

              {note.audioUrl && (
                <div>
                  <h4 className="font-medium mb-2">Audio Recording:</h4>
                  <audio controls className="w-full">
                    <source src={note.audioUrl} type="audio/mpeg" />
                    Your browser does not support the audio element.
                  </audio>
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="h-5 w-5" />
                Patient Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-medium text-lg">
                  {note.patient.firstName} {note.patient.lastName}
                </h4>
                <p className="text-sm text-muted-foreground">
                  Patient ID: {note.patient.patientId}
                </p>
              </div>

              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm">
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                  <span>DOB: {formatPatientDOB(note.patient.dateOfBirth)}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Note Metadata</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <div className="flex items-center gap-2 text-sm">
                <Calendar className="h-4 w-4 text-muted-foreground" />
                <span>Created: {formatDate(note.createdAt)}</span>
              </div>
              {note.audioUrl && (
                <div className="flex items-center gap-2 text-sm">
                  <Mic className="h-4 w-4 text-muted-foreground" />
                  <span>Audio recording available</span>
                </div>
              )}
              {note.summary && (
                <div className="flex items-center gap-2 text-sm">
                  <FileText className="h-4 w-4 text-muted-foreground" />
                  <span>AI summary generated</span>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default NoteDetail;
