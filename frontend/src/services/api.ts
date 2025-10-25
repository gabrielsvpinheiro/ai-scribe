import { Patient, Note, CreateNoteRequest } from '../types';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001';

class ApiService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const response = await fetch(url, {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`API Error: ${response.status} ${response.statusText}`);
    }

    return response.json();
  }

  async getPatients(): Promise<Patient[]> {
    return this.request<Patient[]>('/api/patients');
  }

  async getPatientById(id: string): Promise<Patient> {
    return this.request<Patient>(`/api/patients/${id}`);
  }

  async getNotes(): Promise<Note[]> {
    return this.request<Note[]>('/api/notes');
  }

  async getNoteById(id: string): Promise<Note> {
    return this.request<Note>(`/api/notes/${id}`);
  }

  async createNote(data: CreateNoteRequest): Promise<Note> {
    const formData = new FormData();
    formData.append('patientId', data.patientId);
    
    if (data.content) {
      formData.append('content', data.content);
    }
    
    if (data.audioFile) {
      formData.append('audioFile', data.audioFile);
    }

    return this.request<Note>('/api/notes', {
      method: 'POST',
      headers: {},
      body: formData,
    });
  }

  async deleteNote(id: string): Promise<void> {
    await this.request<void>(`/api/notes/${id}`, {
      method: 'DELETE',
    });
  }

  async createPatient(data: {
    firstName: string;
    lastName: string;
    dateOfBirth: string;
    email?: string;
    phone?: string;
    address?: string;
  }): Promise<Patient> {
    return this.request<Patient>('/api/patients', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  }
}

export default new ApiService();
