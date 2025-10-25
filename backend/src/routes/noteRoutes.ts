import { Router } from 'express';
import { createNote, getAllNotes, getNoteById, deleteNote } from '../controllers/noteController';
import multer from 'multer';
import { uploadLimiter } from '../middleware/security';

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024, // 10MB limit
  },
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('audio/')) {
      cb(null, true);
    } else {
      cb(new Error('Only audio files are allowed'));
    }
  }
});

const router = Router();

router.post('/', uploadLimiter, upload.single('audioFile'), createNote);
router.get('/', getAllNotes);
router.get('/:id', getNoteById);
router.delete('/:id', deleteNote);

export default router;
