import React, { useState, useEffect } from 'react';
import { Patient, Note } from './types';
import apiService from './services/api';
import PatientSelector from './components/PatientSelector';
import NoteForm from './components/NoteForm';
import NotesList from './components/NotesList';
import NoteDetail from './components/NoteDetail';
import PatientDetail from './components/PatientDetail';
import { Card, CardContent } from './components/ui/card';
import { Stethoscope } from 'lucide-react';

type ViewMode = 'dashboard' | 'note-detail' | 'patient-detail';

function App() {
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [viewPatientId, setViewPatientId] = useState<string | null>(null);
  const [viewMode, setViewMode] = useState<ViewMode>('dashboard');
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
    setViewMode('note-detail');
  };

  const handlePatientClick = async (patientId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      const patientData = await apiService.getPatientById(patientId);
      const updatedPatients = patients.map(p => 
        p.id === patientId ? patientData : p
      );
      setPatients(updatedPatients);
      setViewPatientId(patientId);
      setViewMode('patient-detail');
    } catch (err) {
      setError('Failed to load patient details. Please try again.');
      console.error('Error loading patient:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBackToDashboard = () => {
    setSelectedNoteId(null);
    setViewPatientId(null);
    setViewMode('dashboard');
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      setIsLoading(true);
      setError(null);
      await apiService.deleteNote(noteId);
      setNotes(prev => prev.filter(note => note.id !== noteId));
      
      if (viewPatientId) {
        const patientData = await apiService.getPatientById(viewPatientId);
        const updatedPatients = patients.map(p => 
          p.id === viewPatientId ? patientData : p
        );
        setPatients(updatedPatients);
      }
    } catch (err) {
      setError('Failed to delete note. Please try again.');
      console.error('Error deleting note:', err);
    } finally {
      setIsLoading(false);
    }
  };

  const selectedNote = selectedNoteId ? notes.find(note => note.id === selectedNoteId) : null;
  const viewPatient = viewPatientId ? patients.find(p => p.id === viewPatientId) : null;

  if (viewMode === 'note-detail' && selectedNote) {
    return <NoteDetail note={selectedNote} onBack={handleBackToDashboard} />;
  }

  if (viewMode === 'patient-detail' && viewPatient) {
    return (
      <PatientDetail 
        patient={viewPatient} 
        onBack={handleBackToDashboard}
        onNoteClick={handleNoteClick}
        onDeleteNote={handleDeleteNote}
      />
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center gap-4 mb-3">
            <div className="p-3 bg-primary/10 rounded-xl">
              <Stethoscope className="h-8 w-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-foreground">AI Scribe</h1>
              <p className="text-muted-foreground text-sm">
                AI-powered clinical notes management system
              </p>
            </div>
          </div>
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

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <PatientSelector
            patients={patients}
            selectedPatientId={selectedPatientId}
            onSelectPatient={setSelectedPatientId}
            onViewPatient={handlePatientClick}
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