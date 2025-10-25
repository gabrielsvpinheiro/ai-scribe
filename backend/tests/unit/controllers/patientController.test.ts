import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { getAllPatients, getPatientById, createPatient, deletePatient } from '../../../src/controllers/patientController';

jest.mock('@prisma/client', () => {
  const mockPrismaClient = {
    patient: {
      findMany: jest.fn(),
      findUnique: jest.fn(),
      create: jest.fn(),
      delete: jest.fn(),
    },
    note: {
      deleteMany: jest.fn(),
    },
  };
  return { PrismaClient: jest.fn(() => mockPrismaClient) };
});

const prisma = new PrismaClient();

describe('Patient Controller - Unit Tests', () => {
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

  describe('getAllPatients', () => {
    it('should return all patients', async () => {
      const mockPatients = [
        {
          id: '1',
          firstName: 'John',
          lastName: 'Doe',
          patientId: 'PAT-12345678',
          dateOfBirth: new Date('1990-01-01'),
          email: 'john@example.com',
          phone: '555-1234',
          address: '123 Main St',
          createdAt: new Date(),
        },
      ];

      (prisma.patient.findMany as jest.Mock).mockResolvedValue(mockPatients);

      await getAllPatients(mockRequest as Request, mockResponse as Response);

      expect(prisma.patient.findMany).toHaveBeenCalledWith({
        orderBy: { createdAt: 'desc' },
      });
      expect(mockResponse.json).toHaveBeenCalledWith(mockPatients);
    });

    it('should handle errors', async () => {
      (prisma.patient.findMany as jest.Mock).mockRejectedValue(new Error('Database error'));

      await getAllPatients(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(500);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Failed to fetch patients' });
    });
  });

  describe('getPatientById', () => {
    it('should return patient with notes', async () => {
      const mockPatient = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        patientId: 'PAT-12345678',
        dateOfBirth: new Date('1990-01-01'),
        email: 'john@example.com',
        phone: '555-1234',
        address: '123 Main St',
        createdAt: new Date(),
        notes: [],
      };

      mockRequest.params = { id: '1' };
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);

      await getPatientById(mockRequest as Request, mockResponse as Response);

      expect(prisma.patient.findUnique).toHaveBeenCalledWith({
        where: { id: '1' },
        include: {
          notes: {
            orderBy: { createdAt: 'desc' },
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
          },
        },
      });
      expect(mockResponse.json).toHaveBeenCalled();
    });

    it('should return 404 if patient not found', async () => {
      mockRequest.params = { id: '999' };
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

      await getPatientById(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Patient not found' });
    });
  });

  describe('createPatient', () => {
    it('should create a new patient', async () => {
      const mockPatientData = {
        firstName: 'Jane',
        lastName: 'Smith',
        dateOfBirth: '1995-05-15',
        email: 'jane@example.com',
        phone: '555-5678',
        address: '456 Oak Ave',
      };

      const mockCreatedPatient = {
        id: '2',
        firstName: 'Jane',
        lastName: 'Smith',
        patientId: 'PAT-87654321',
        dateOfBirth: new Date('1995-05-15T12:00:00.000Z'),
        email: 'jane@example.com',
        phone: '555-5678',
        address: '456 Oak Ave',
        createdAt: new Date(),
      };

      mockRequest.body = mockPatientData;
      (prisma.patient.create as jest.Mock).mockResolvedValue(mockCreatedPatient);

      await createPatient(mockRequest as Request, mockResponse as Response);

      expect(prisma.patient.create).toHaveBeenCalled();
      expect(mockResponse.status).toHaveBeenCalledWith(201);
      expect(mockResponse.json).toHaveBeenCalledWith(expect.objectContaining({
        firstName: 'Jane',
        lastName: 'Smith',
      }));
    });

    it('should return 400 if required fields are missing', async () => {
      mockRequest.body = { firstName: 'Jane' };

      await createPatient(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(400);
      expect(mockResponse.json).toHaveBeenCalledWith({
        error: 'First name, last name, and date of birth are required',
      });
    });
  });

  describe('deletePatient', () => {
    it('should delete patient and associated notes', async () => {
      const mockPatient = {
        id: '1',
        firstName: 'John',
        lastName: 'Doe',
        notes: [
          { id: 'note1', audioUrl: null },
          { id: 'note2', audioUrl: '/uploads/audio.mp3' },
        ],
      };

      mockRequest.params = { id: '1' };
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(mockPatient);
      (prisma.note.deleteMany as jest.Mock).mockResolvedValue({ count: 2 });
      (prisma.patient.delete as jest.Mock).mockResolvedValue(mockPatient);

      await deletePatient(mockRequest as Request, mockResponse as Response);

      expect(prisma.note.deleteMany).toHaveBeenCalledWith({ where: { patientId: '1' } });
      expect(prisma.patient.delete).toHaveBeenCalledWith({ where: { id: '1' } });
      expect(mockResponse.json).toHaveBeenCalledWith({
        message: 'Patient and associated notes deleted successfully',
      });
    });

    it('should return 404 if patient not found', async () => {
      mockRequest.params = { id: '999' };
      (prisma.patient.findUnique as jest.Mock).mockResolvedValue(null);

      await deletePatient(mockRequest as Request, mockResponse as Response);

      expect(mockResponse.status).toHaveBeenCalledWith(404);
      expect(mockResponse.json).toHaveBeenCalledWith({ error: 'Patient not found' });
    });
  });
});

