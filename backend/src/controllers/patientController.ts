import { Request, Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { PatientResponse } from '../types';

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
          orderBy: { createdAt: 'desc' }
        }
      }
    });

    if (!patient) {
      return res.status(404).json({ error: 'Patient not found' });
    }

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

    res.json(response);
  } catch (error) {
    console.error('Error fetching patient:', error);
    res.status(500).json({ error: 'Failed to fetch patient' });
  }
};
