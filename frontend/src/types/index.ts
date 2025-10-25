export interface Patient {
  id: string;
  firstName: string;
  lastName: string;
  patientId: string;
  dateOfBirth: string;
  email?: string;
  phone?: string;
  address?: string;
  createdAt: string;
}

export interface Note {
  id: string;
  content: string;
  transcription?: string;
  summary?: string;
  audioUrl?: string;
  createdAt: string;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    patientId: string;
    dateOfBirth: string;
  };
}

export interface CreateNoteRequest {
  patientId: string;
  content?: string;
  audioFile?: File;
}
