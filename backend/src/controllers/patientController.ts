import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PatientResponse } from '../types';
import { v4 as uuidv4 } from 'uuid';

const prisma = new PrismaClient();

export const getAllPatients = async (req: Request, res: Response) => {
  try {
    const patients = await prisma.patient.findMany({
      orderBy: { createdAt: 'desc' }
    });

    const response: PatientResponse[] = patients.map(patient => ({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      patientId: patient.patientId,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      createdAt: patient.createdAt
    }));

    res.json(response);
  } catch (error) {
    console.error('Error fetching patients:', error);
    res.status(500).json({ error: 'Failed to fetch patients' });
  }
};

export const getPatientById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    
    const patient = await prisma.patient.findUnique({
      where: { id },
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
                dateOfBirth: true
              }
            }
          }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

    res.json({
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      patientId: patient.patientId,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      createdAt: patient.createdAt,
      notes: patient.notes
    });
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};

export const createPatient = async (req: Request, res: Response) => {
  try {
    const { firstName, lastName, dateOfBirth, email, phone, address } = req.body;

    if (!firstName || !lastName || !dateOfBirth) {
      return res.status(400).json({ error: 'First name, last name, and date of birth are required' });
    }

    const patientId = `PAT-${uuidv4().slice(0, 8).toUpperCase()}`;

    const dobDate = new Date(dateOfBirth + 'T12:00:00.000Z');

    const patient = await prisma.patient.create({
      data: {
        firstName,
        lastName,
        patientId,
        dateOfBirth: dobDate,
        email: email || null,
        phone: phone || null,
        address: address || null
      }
    });

    const response: PatientResponse = {
      id: patient.id,
      firstName: patient.firstName,
      lastName: patient.lastName,
      patientId: patient.patientId,
      dateOfBirth: patient.dateOfBirth,
      email: patient.email,
      phone: patient.phone,
      address: patient.address,
      createdAt: patient.createdAt
    };

    res.status(201).json(response);
  } catch (error) {
    console.error('Error creating patient:', error);
    res.status(500).json({ error: 'Failed to create patient' });
  }
};
