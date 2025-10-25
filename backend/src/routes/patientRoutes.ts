import { Router } from 'express';
import { getAllPatients, getPatientById, createPatient, deletePatient } from '../controllers/patientController';

const router = Router();

router.get('/', getAllPatients);
router.post('/', createPatient);
router.get('/:id', getPatientById);
router.delete('/:id', deletePatient);

export default router;
