import { Request } from 'express';

export interface CreateNoteRequest {
  patientId: string;
  content?: string;
  audioFile?: Express.Multer.File;
}

export interface NoteResponse {
  id: string;
  content: string;
  transcription?: string;
  summary?: string;
  audioUrl?: string;
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
  email?: string;
  phone?: string;
  address?: string;
  createdAt: Date;
}

export interface OpenAIResponse {
  transcription?: string;
  summary?: string;
}
