import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import PatientDetail from '../components/PatientDetail';
import apiService from '../services/api';
import { Patient } from '../types';

const PatientDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [patient, setPatient] = useState<Patient | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (id) {
      loadPatient(id);
    }
  }, [id]);

  const loadPatient = async (patientId: string) => {
    try {
      setIsLoading(true);
      const patientData = await apiService.getPatientById(patientId);
      setPatient(patientData);
    } catch (err) {
      setError('Failed to load patient');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleBack = () => {
    navigate('/');
  };

  const handleNoteClick = (noteId: string) => {
    navigate(`/notes/${noteId}`);
  };

  const handleDeleteNote = async (noteId: string) => {
    try {
      await apiService.deleteNote(noteId);
      if (id) {
        await loadPatient(id);
      }
    } catch (err) {
      setError('Failed to delete note');
      console.error(err);
    }
  };

  const handleDeletePatient = async (patientId: string) => {
    try {
      await apiService.deletePatient(patientId);
      navigate('/');
    } catch (err) {
      setError('Failed to delete patient');
      console.error(err);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
          <p className="mt-4 text-muted-foreground">Loading patient...</p>
        </div>
      </div>
    );
  }

  if (error || !patient) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <p className="text-destructive mb-4">{error || 'Patient not found'}</p>
          <button
            onClick={handleBack}
            className="text-primary hover:underline"
          >
            Back to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <PatientDetail
      patient={patient}
      onBack={handleBack}
      onNoteClick={handleNoteClick}
      onDeleteNote={handleDeleteNote}
      onDeletePatient={handleDeletePatient}
    />
  );
};

export default PatientDetailPage;

