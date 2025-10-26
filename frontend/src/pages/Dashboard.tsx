import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Stethoscope } from 'lucide-react';
import PatientSelector from '../components/PatientSelector';
import NoteForm from '../components/NoteForm';
import NotesList from '../components/NotesList';
import AddPatientDialog from '../components/AddPatientDialog';
import apiService from '../services/api';
import { Patient, Note } from '../types';

const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [patients, setPatients] = useState<Patient[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedPatientId, setSelectedPatientId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [addPatientDialogOpen, setAddPatientDialogOpen] = useState(false);

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      const [patientsData, notesData] = await Promise.all([
        apiService.getPatients(),
        apiService.getNotes(),
      ]);
      setPatients(patientsData);
      setNotes(notesData);
    } catch (err) {
      setError('Failed to load data');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleCreateNote = async (content: string, audioFile?: File) => {
    if (!selectedPatientId) {
      setError('Please select a patient first');
      return;
    }

    try {
      const newNote = await apiService.createNote({
        patientId: selectedPatientId,
        content,
        audioFile,
      });
      setNotes(prev => [newNote, ...prev]);
      setError(null);
    } catch (err) {
      setError('Failed to create note');
      console.error(err);
    }
  };

  const handleNoteClick = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  const handleViewPatient = (patientId: string) => {
    navigate(`/patients/${patientId}`);
  };

  const handleCreatePatient = async (data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email?: string;
    phone?: string;
    address?: string;
  }) => {
    try {
      const newPatient = await apiService.createPatient(data);
      setPatients(prev => [newPatient, ...prev]);
    } catch (err) {
      throw err;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-2">
            <div className="flex items-center gap-3">
              <div className="bg-primary/10 p-2 rounded-lg">
                <Stethoscope className="h-6 w-6 sm:h-8 sm:w-8 text-primary" />
              </div>
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-foreground">AI Scribe</h1>
            </div>
          </div>
          <p className="text-sm sm:text-base text-muted-foreground">Clinical Notes Management System</p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-destructive/10 border border-destructive/20 rounded-lg text-destructive">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <div className="lg:col-span-1">
            <PatientSelector
              patients={patients}
              selectedPatientId={selectedPatientId}
              onSelectPatient={setSelectedPatientId}
              onViewPatient={handleViewPatient}
              onAddPatient={() => setAddPatientDialogOpen(true)}
            />
          </div>
          <div className="lg:col-span-2">
            <NoteForm
              selectedPatientId={selectedPatientId}
              onSubmit={handleCreateNote}
            />
          </div>
        </div>

        <NotesList notes={notes} onNoteClick={handleNoteClick} />

        <AddPatientDialog
          open={addPatientDialogOpen}
          onOpenChange={setAddPatientDialogOpen}
          onSubmit={handleCreatePatient}
        />
      </div>
    </div>
  );
};

export default Dashboard;

