import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { NoteResponse } from '../types';
import openaiService from '../services/openai';
import { v4 as uuidv4 } from 'uuid';
import path from 'path';
import fs from 'fs';

const prisma = new PrismaClient();

export const createNote = async (req: Request, res: Response) => {
  try {
    const { patientId, content } = req.body;
    const audioFile = req.file;

    if (!patientId) {
      return res.status(400).json({ error: 'Patient ID is required' });
    }

    if (!content && !audioFile) {
      return res.status(400).json({ error: 'Either content or audio file is required' });
    }

    const patient = await prisma.patient.findUnique({
      where: { id: patientId }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    let audioUrl: string | undefined;
    let transcription: string | undefined;
    let summary: string | undefined;

    if (audioFile) {
      const filename = `${uuidv4()}-${audioFile.originalname}`;
      const filepath = path.join(process.env.UPLOAD_DIR || './uploads', filename);
      
      fs.writeFileSync(filepath, audioFile.buffer);
      audioUrl = `/uploads/${filename}`;

      const openaiResult = await openaiService.processNote(
        content || '',
        audioFile.buffer,
        audioFile.originalname
      );

      transcription = openaiResult.transcription;
      summary = openaiResult.summary;
    } else if (content) {
      const openaiResult = await openaiService.processNote(content);
      summary = openaiResult.summary;
    }

    const note = await prisma.note.create({
      data: {
        patientId,
        content: content || '',
        transcription,
        summary,
        audioUrl
      },
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            patientId: true,
            dateOfBirth: true
          }
        }
      }
    });

    const response: NoteResponse = {
      id: note.id,
      content: note.content,
      transcription: note.transcription,
      summary: note.summary,
      audioUrl: note.audioUrl,
      createdAt: note.createdAt,
      patient: note.patient
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating note:', error);
    res.status(500).json({ error: 'Failed to create note' });
  }
};

export const getAllNotes = async (req: Request, res: Response) => {
  try {
    const notes = await prisma.note.findMany({
      include: {
        patient: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            patientId: true,
            dateOfBirth: true
          }
        }
      },
      orderBy: { createdAt: 'desc' }
    });

    const response: NoteResponse[] = notes.map(note => ({
      id: note.id,
      content: note.content,
      transcription: note.transcription,
      summary: note.summary,
      audioUrl: note.audioUrl,
      createdAt: note.createdAt,
      patient: note.patient
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching notes:', error);
    res.status(500).json({ error: 'Failed to fetch notes' });
  }
};

export const getNoteById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const note = await prisma.note.findUnique({
      where: { id },
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
            address: true
          }
        }
      }
    });

    if (!note) {
      return res.status(404).json({ error: 'Note not found' });
    }

    const response: NoteResponse = {
      id: note.id,
      content: note.content,
      transcription: note.transcription,
      summary: note.summary,
      audioUrl: note.audioUrl,
      createdAt: note.createdAt,
      patient: note.patient
    };

    res.json(response);
  } catch (error) {
    console.error('Error fetching note:', error);
    res.status(500).json({ error: 'Failed to fetch note' });
  }
};
