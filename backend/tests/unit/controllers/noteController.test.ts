import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { createNote, getAllNotes, getNoteById, deleteNote } from '../../../src/controllers/noteController';
import openaiService from '../../../src/services/openai';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    note: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    patient: {
      findUnique: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

jest.mock('../../../src/services/openai', () => ({
  __esModule: true,
  default: {
    processNote: jest.fn(),
  },
}));

jest.mock('fs');
jest.mock('path');
jest.mock('uuid', () => ({
  v4: jest.fn(() => '12345678-1234-1234-1234-123456789012'),
}));

const prisma = new PrismaClient();

describe('Note Controller - Unit Tests', () => {
  let mockRequest: Partial<Request>;
  let mockResponse: Partial<Response>;
  let responseObject: any;

  beforeEach(() => {
    mockRequest = {};
    responseObject = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn().mockReturnThis(),
    };
    mockResponse = responseObject;
    jest.clearAllMocks();
  });

  describe('getAllNotes', () => {
    it('should return all notes with patient information', async () => {
      const mockNotes = [
        {
          id: '1',
          content: 'Test note content',
          transcription: null,
          summary: 'Test summary',
          audioUrl: null,
          createdAt: new Date(),
          patient: {
            id: 'patient1',
            firstName: 'John',
            lastName: 'Doe',
            patientId: 'PAT-12345678',
            dateOfBirth: new Date('1990-01-01'),
          },
        },
      ];

      (prisma.note.findMany as jest.Mock).mockResolvedValue(mockNotes);

      await getAllNotes(mockRequest as Request, mockResponse as Response);

      expect(prisma.note.findMany).toHaveBeenCalledWith({
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              patientId: true,
              dateOfBirth: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockNotes);
    });

    it('should handle errors', async () => {
      (prisma.note.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getAllNotes(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch notes' });
    });
  });

  describe('getNoteById', () => {
    it('should return note with full details', async () => {
      const mockNote = {
        id: '1',
        content: 'Test note',
        transcription: 'Test transcription',
        summary: 'Test summary',
        audioUrl: '/uploads/audio.mp3',
        createdAt: new Date(),
        patient: {
          id: 'patient1',
          firstName: 'John',
          lastName: 'Doe',
          patientId: 'PAT-12345678',
          dateOfBirth: new Date('1990-01-01'),
          email: 'john@example.com',
          phone: '555-1234',
          address: '123 Main St',
        },
      };

      mockRequest.params = { id: '1' };
      (prisma.note.findUnique as jest.Mock).mockResolvedValue(mockNote);

      await getNoteById(mockRequest as Request, mockResponse as Response);

      expect(prisma.note.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          patient: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              patientId: true,
              dateOfBirth: true,
              email: true,
              phone: true,
              address: true,
            },
          },
        },
      });
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        id: '1',
        content: 'Test note',
      }));
    });

    it('should return 404 if note not found', async () => {
      mockRequest.params = { id: '999' };
      (prisma.note.findUnique as jest.Mock).mockResolvedValue(null);

      await getNoteById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Note not found' });
    });
  });

  describe('createNote', () => {
    it('should create a text note with AI summary', async () => {
      const mockPatient = {
        id: 'patient1',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockCreatedNote = {
        id: 'note1',
        content: 'Patient has headache',
        transcription: null,
        summary: 'SOAP: Subjective: Headache...',
        audioUrl: null,
        patientId: 'patient1',
        createdAt: new Date(),
        patient: mockPatient,
      };

      mockRequest.body = {
        patientId: 'patient1',
        content: 'Patient has headache',
      };
      mockRequest.file = undefined;

      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);
      (openaiService.processNote as jest.Mock).mockResolvedValue({
        summary: 'SOAP: Subjective: Headache...',
      });
      (prisma.note.create as jest.Mock).mockResolvedValue(mockCreatedNote);

      await createNote(mockRequest as Request, mockResponse as Response);

      expect(prisma.patient.findUnique).toHaveBeenCalledWith({
        where: { id: 'patient1' },
      });
      expect(openaiService.processNote).toHaveBeenCalled();
      expect(prisma.note.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should create a note with audio file', async () => {
      const mockPatient = {
        id: 'patient1',
        firstName: 'John',
        lastName: 'Doe',
      };

      const mockFile = {
        buffer: Buffer.from('audio data'),
        originalname: 'test.mp3',
        mimetype: 'audio/mpeg',
      } as Express.Multer.File;

      mockRequest.body = {
        patientId: 'patient1',
      };
      mockRequest.file = mockFile;

      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);
      (openaiService.processNote as jest.Mock).mockResolvedValue({
        transcription: 'Transcribed text',
        summary: 'SOAP summary',
      });
      (prisma.note.create as jest.Mock).mockResolvedValue({
        id: 'note1',
        content: 'Transcribed text',
        transcription: 'Transcribed text',
        summary: 'SOAP summary',
        audioUrl: '/uploads/test.mp3',
        patientId: 'patient1',
        createdAt: new Date(),
        patient: mockPatient,
      });

      await createNote(mockRequest as Request, mockResponse as Response);

      expect(openaiService.processNote).toHaveBeenCalledWith(
        '',
        expect.any(Buffer),
        expect.any(String)
      );
      expect(mockResponse.status).toHaveBeenCalledWith(201);
    });

    it('should return 400 if patientId is missing', async () => {
      mockRequest.body = {
        content: 'Test note',
      };

      await createNote(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Patient ID is required',
      });
    });

    it('should return 400 if both content and audio are missing', async () => {
      mockRequest.body = {
        patientId: 'patient1',
      };
      mockRequest.file = undefined;

      await createNote(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'Either content or audio file is required',
      });
    });

    it('should return 404 if patient not found', async () => {
      mockRequest.body = {
        patientId: 'invalid-id',
        content: 'Test note',
      };

      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

      await createNote(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Patient not found' });
    });
  });

  describe('deleteNote', () => {
    it('should delete note without audio file', async () => {
      const mockNote = {
        id: 'note1',
        content: 'Test note',
        audioUrl: null,
      };

      mockRequest.params = { id: 'note1' };
      (prisma.note.findUnique as jest.Mock).mockResolvedValue(mockNote);
      (prisma.note.delete as jest.Mock).mockResolvedValue(mockNote);

      await deleteNote(mockRequest as Request, mockResponse as Response);

      expect(prisma.note.delete).toHaveBeenCalledWith({ where: { id: 'note1' } });
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Note deleted successfully',
      });
    });

    it('should delete note with audio file', async () => {
      const mockNote = {
        id: 'note1',
        content: 'Test note',
        audioUrl: '/uploads/audio.mp3',
      };

      mockRequest.params = { id: 'note1' };
      (prisma.note.findUnique as jest.Mock).mockResolvedValue(mockNote);
      (prisma.note.delete as jest.Mock).mockResolvedValue(mockNote);

      await deleteNote(mockRequest as Request, mockResponse as Response);

      expect(prisma.note.delete).toHaveBeenCalledWith({ where: { id: 'note1' } });
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Note deleted successfully',
      });
    });

    it('should return 404 if note not found', async () => {
      mockRequest.params = { id: '999' };
      (prisma.note.findUnique as jest.Mock).mockResolvedValue(null);

      await deleteNote(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Note not found' });
    });

    it('should handle errors during deletion', async () => {
      mockRequest.params = { id: 'note1' };
      (prisma.note.findUnique as jest.Mock).mockRejectedValue(new Error('Database error'));

      await deleteNote(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to delete note' });
    });
  });
});

