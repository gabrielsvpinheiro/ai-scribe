import React, { useState, useEffect } from 'react';
import { Patient, Note } from './types';
import apiService from './services/api';
import PatientSelector from './components/PatientSelector';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import NoteDetail from './components/NoteDetail';
import { Card, CardContent, CardHeader, CardTitle } from './components/ui/card';
import { Stethoscope, FileText } from 'lucide-react';

type ViewMode = 'list' | 'detail';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('list');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const [patientsData, notesData] = await Promise.all([
        apiService.getPatients(),
        apiService.getNotes(),
      ]);
      setPatients(patientsData);
      setNotes(notesData);
    } catch (err) {
      setError('Failed to load data. Please check if the backend is running.');
      console.error('Error loading data:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (data: { patientId: string; content?: string; audioFile?: File }) => {
    try {
      setIsLoading(true);
      setError(null);
      const newNote = await apiService.createNote(data);
      setNotes(prev => [newNote, ...prev]);
      setSelectedPatientId(null);
    } catch (err) {
      setError('Failed to create note. Please try again.');
      console.error('Error creating note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleNoteClick = (noteId: string) => {
    setSelectedNoteId(noteId);
    setViewMode('detail');
  };

  const handleBackToList = () => {
    setSelectedNoteId(null);
    setViewMode('list');
  };

  const selectedNote = selectedNoteId ? notes.find(note => note.id === selectedNoteId) : null;

  if (viewMode === 'detail' && selectedNote) {
    return <NoteDetail note={selectedNote} onBack={handleBackToList} />;
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <Stethoscope className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold">AI Scribe</h1>
          </div>
          <p className="text-muted-foreground">
            AI-powered clinical notes management system
          </p>
        </div>

        {error && (
          <Card className="mb-6 border-destructive">
            <CardContent className="pt-6">
              <p className="text-destructive">{error}</p>
              <button 
                onClick={loadData}
                className="mt-2 text-sm underline"
              >
                Retry
              </button>
            </CardContent>
          </Card>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <PatientSelector
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
          />
          <NoteForm
            selectedPatientId={selectedPatientId}
            onSubmit={handleCreateNote}
            isLoading={isLoading}
          />
        </div>

        <NotesList
          notes={notes}
          onNoteClick={handleNoteClick}
        />
      </div>
    </div>
  );
}

export default App;