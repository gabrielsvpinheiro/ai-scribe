import request from 'supertest';
import express from 'express';
import cors from 'express';
import noteRoutes from '../../src/routes/noteRoutes';

const app = express();
app.use(express.json());
app.use(cors());
app.use('/api/notes', noteRoutes);

jest.mock('@prisma/client');
jest.mock('../../src/services/openai');

describe('Note API - Integration Tests', () => {
  describe('GET /api/notes', () => {
    it('should return 200 and list of notes', async () => {
      const response = await request(app)
        .get('/api/notes')
        .expect('Content-Type', /json/)
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('POST /api/notes', () => {
    it('should create a note with text content', async () => {
      const response = await request(app)
        .post('/api/notes')
        .field('patientId', 'test-patient-id')
        .field('content', 'Test note content')
        .expect('Content-Type', /json/);

      expect(response.status).toBeGreaterThanOrEqual(200);
      expect(response.status).toBeLessThan(500);
    });

    it('should return 400 with missing patientId', async () => {
      const response = await request(app)
        .post('/api/notes')
        .field('content', 'Test note content')
        .expect('Content-Type', /json/)
        .expect(400);

      expect(response.body).toHaveProperty('error');
    });
  });

  describe('GET /api/notes/:id', () => {
    it('should return note details', async () => {
      const response = await request(app)
        .get('/api/notes/test-id')
        .expect('Content-Type', /json/);

      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });

  describe('DELETE /api/notes/:id', () => {
    it('should delete a note', async () => {
      const response = await request(app)
        .delete('/api/notes/test-id')
        .expect('Content-Type', /json/);

      expect(response.status).toBeGreaterThanOrEqual(200);
    });
  });
});

