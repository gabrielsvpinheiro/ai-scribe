# AI Scribe Notes Management Tool

A lightweight AI-powered clinical notes management system that allows healthcare professionals to create, manage, and view clinical notes with AI transcription and summarization capabilities.

## Features

- **Patient Management**: Pre-seeded with sample patients
- **Note Creation**: Support for both text input and audio upload
- **AI Processing**: 
  - Audio transcription using OpenAI Whisper
  - AI-powered note summarization in SOAP format
- **Secure**: Protection against prompt injection attacks
- **Modern UI**: Built with React, TypeScript, and shadcn/ui
- **Docker Support**: Complete containerized development environment

## Tech Stack

### Backend
- Node.js with Express.js
- TypeScript
- PostgreSQL with Prisma ORM
- OpenAI API integration
- Security middleware (rate limiting, input sanitization)

### Frontend
- React 18 with TypeScript
- Tailwind CSS with shadcn/ui components
- Modern responsive design

### Infrastructure
- Docker & Docker Compose
- PostgreSQL database
- File upload handling

## Prerequisites

- Node.js 18+
- Docker and Docker Compose
- OpenAI API key

## Quick Start

### 1. Clone and Setup

```bash
git clone https://github.com/gabrielsvpinheiro/ai-scribe
cd ai-scribe
```

### 2. Environment Configuration

Copy the environment files and configure your settings:

```bash
# Backend environment
cp backend/env.example backend/.env

# Frontend environment  
cp frontend/env.example frontend/.env
```

Edit `backend/.env` and add your OpenAI API key:

```env
DATABASE_URL="postgresql://postgres:postgres@localhost:5432/ai_scribe"
OPENAI_API_KEY="your_openai_api_key_here"
NODE_ENV="development"
PORT=3001
UPLOAD_DIR="./uploads"
```

### 3. Start with Docker

```bash
# Start all services
docker-compose up -d

# Initialize database and seed data
docker-compose exec backend npm run db:push
docker-compose exec backend npm run db:seed
```

### 4. Access the Application

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:3001
- **Database**: localhost:5432

## Development Setup

### Backend Development

```bash
cd backend
npm install
npm run db:push
npm run db:seed
npm run dev
```

### Frontend Development

```bash
cd frontend
npm install
npm start
```

## API Endpoints

### Patients
- `GET /api/patients` - Get all patients
- `GET /api/patients/:id` - Get patient by ID with associated notes
- `POST /api/patients` - Create new patient
  - Body: `{ firstName, lastName, dateOfBirth, email?, phone?, address? }`
- `DELETE /api/patients/:id` - Delete patient and all associated notes

### Notes
- `GET /api/notes` - Get all notes with patient information
- `GET /api/notes/:id` - Get note by ID with full details
- `POST /api/notes` - Create new note (supports multipart/form-data)
  - Form fields: `patientId`, `content?`, `audioFile?`
  - Audio transcription and AI summarization automatic
- `DELETE /api/notes/:id` - Delete note and associated audio file

### Health Check
- `GET /health` - API health status

## Testing

### Backend Tests

The backend includes comprehensive unit and integration tests using Jest and Supertest.

```bash
cd backend

# Run all tests with coverage
npm test

# Run only unit tests
npm run test:unit

# Run only integration tests
npm run test:integration

# Watch mode
npm run test:watch
```

**Test Coverage:**
- Unit tests for all controllers (patient, note)
- Integration tests for all API endpoints
- Mock implementations for Prisma and OpenAI services

### Frontend E2E Tests

The frontend uses Playwright for end-to-end testing.

```bash
cd frontend

# Install Playwright browsers (first time only)
npx playwright install

# Run E2E tests
npm run test:e2e

# Run with UI mode
npm run test:e2e:ui

# Run in headed mode (see browser)
npm run test:e2e:headed
```

**Test Coverage:**
- Patient management (create, view, delete)
- Note management (create, view, delete)
- Form validation
- Navigation flows
- Modal interactions

## Security Features

- **Rate Limiting**: API endpoints are rate-limited
- **Input Sanitization**: All user inputs are sanitized
- **Prompt Injection Protection**: Detects and blocks malicious prompts
- **File Upload Security**: Audio files only, size limits enforced

## Project Structure

```
ai-scribe/
├── backend/
│   ├── src/
│   │   ├── controllers/     # API controllers
│   │   ├── middleware/     # Security middleware
│   │   ├── routes/         # API routes
│   │   ├── services/       # OpenAI integration
│   │   └── types/          # TypeScript types
│   ├── tests/
│   │   ├── unit/           # Unit tests
│   │   └── integration/    # Integration tests
│   ├── prisma/            # Database schema and seeds
│   └── uploads/           # Audio file storage
├── frontend/
│   ├── src/
│   │   ├── components/     # React components
│   │   ├── services/       # API service
│   │   └── types/          # TypeScript types
│   ├── e2e/               # Playwright E2E tests
│   └── playwright.config.ts
├── demo-files/            # Example notes and audio
└── docker-compose.yml     # Development environment
```

## Usage

### Patient Management
1. **View Patients**: See all patients in the selector
2. **Add Patient**: Click "Add Patient" button to create a new patient
3. **View Patient Details**: Click the eye icon (👁️) to see patient information and all their notes
4. **Delete Patient**: In patient details, click "Delete Patient" to remove patient and all associated notes

### Note Management
1. **Select a Patient**: Choose from the patient list
2. **Create a Note**: 
   - Enter text directly, or
   - Upload an audio file for transcription
   - AI will automatically generate a SOAP format summary
3. **View Notes**: Browse all notes with patient information on the dashboard
4. **Note Details**: Click any note to view full transcription, AI summary, and audio player
5. **Delete Note**: In patient details or note view, click the trash icon to remove a note

## AI Processing

- **Audio Transcription**: Uses OpenAI Whisper for accurate speech-to-text
- **Note Summarization**: Generates SOAP format summaries using GPT-3.5-turbo
- **Security**: All AI prompts are protected against injection attacks

## Database Schema

### Patients
- Personal information (name, DOB, contact details)
- Unique patient ID
- Timestamps

### Notes
- Content (original text or transcription)
- AI-generated summary
- Audio file references
- Patient association
- Timestamps

## License

This project is for educational and demonstration purposes.