import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import dotenv from 'dotenv';
import path from 'path';
import { apiLimiter } from './middleware/security';
import { promptInjectionProtection, inputSanitization } from './middleware/security';
import patientRoutes from './routes/patientRoutes';
import noteRoutes from './routes/noteRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3001;

app.use(helmet());
app.use(cors({
  origin: process.env.NODE_ENV === 'production' 
    ? ['https://yourdomain.com'] 
    : ['http://localhost:3000'],
  credentials: true
}));

app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

app.use(apiLimiter);
app.use(promptInjectionProtection);
app.use(inputSanitization);

app.use('/uploads', express.static(path.join(__dirname, '../uploads')));

app.use('/api/patients', patientRoutes);
app.use('/api/notes', noteRoutes);

app.get('/health', (req, res) => {
  res.json({ status: 'OK', timestamp: new Date().toISOString() });
});

app.use((err: Error, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Error:', err);
  res.status(500).json({ error: 'Internal server error' });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
