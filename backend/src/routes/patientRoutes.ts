import { Router } from 'express';
import { getAllPatients, getPatientById, createPatient } from '../controllers/patientController';

const router = Router();

router.get('/', getAllPatients);
router.post('/', createPatient);
router.get('/:id', getPatientById);

export default router;
