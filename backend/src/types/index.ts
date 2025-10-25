import { Request } from 'express';

export interface CreateNoteRequest {
  patientId: string;
  content?: string;
  audioFile?: Express.Multer.File;
}

export interface NoteResponse {
  id: string;
  content: string;
  transcription?: string | null;
  summary?: string | null;
  audioUrl?: string | null;
  createdAt: Date;
  patient: {
    id: string;
    firstName: string;
    lastName: string;
    patientId: string;
    dateOfBirth: Date;
  };
}

export interface PatientResponse {
  id: string;
  firstName: string;
  lastName: string;
  patientId: string;
  dateOfBirth: Date;
  email?: string | null;
  phone?: string | null;
  address?: string | null;
  createdAt: Date;
}

export interface OpenAIResponse {
  transcription?: string;
  summary?: string;
}
