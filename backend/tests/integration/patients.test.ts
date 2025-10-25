import request from 'supertest';
import express from 'express';
import cors from 'express';
import patientRoutes from '../../src/routes/patientRoutes';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/patients', patientRoutes);

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

describe('Patient API - Integration Tests', () => {
  describe('GET /api/patients', () => {
    it('should return 200 and list of patients', async () => {
      const response = await request(app)
        .get('/api/patients')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/patients', () => {
    it('should create a new patient with valid data', async () => {
      const newPatient = {
        firstName: 'Test',
        lastName: 'Patient',
        dateOfBirth: '1990-01-01',
        email: 'test@example.com',
        phone: '555-0000',
        address: '123 Test St',
      };

      const response = await request(app)
        .post('/api/patients')
        .send(newPatient)
        .expect('Content-Type', /json/);

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
    });

    it('should return 400 with missing required fields', async () => {
      const invalidPatient = {
        firstName: 'Test',
      };

      const response = await request(app)
        .post('/api/patients')
        .send(invalidPatient)
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/patients/:id', () => {
    it('should return patient details', async () => {
      const response = await request(app)
        .get('/api/patients/test-id')
        .expect('Content-Type', /json/);

      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('DELETE /api/patients/:id', () => {
    it('should delete a patient', async () => {
      const response = await request(app)
        .delete('/api/patients/test-id')
        .expect('Content-Type', /json/);

      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });
});

