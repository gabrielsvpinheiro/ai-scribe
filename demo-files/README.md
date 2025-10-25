# Demo Files for AI Scribe

This folder contains sample files to help you test and demonstrate the AI Scribe application.

## 📁 Folder Structure

```
demo-files/
├── notes/          # Sample medical notes for text input testing
├── audio/          # Sample audio files for transcription testing
└── README.md       # This file
```

## 📝 Text Notes (`/notes`)

Sample medical notes that you can copy and paste into the text input field:

### Note Example 1 - Headache Case
- **File**: `note-example-1.txt`
- **Patient**: John Doe (P001)
- **Condition**: Tension-type headache / Migraine
- **Use case**: Testing basic note creation and AI summarization

### Note Example 2 - Diabetes Management
- **File**: `note-example-2.txt`
- **Patient**: Jane Smith (P002)
- **Condition**: Uncontrolled Diabetes Type 2
- **Use case**: Testing home healthcare visit documentation

### Note Example 3 - Post-Operative Follow-up
- **File**: `note-example-3.txt`
- **Patient**: Robert Johnson (P003)
- **Condition**: Post-op knee arthroscopy
- **Use case**: Testing surgical follow-up documentation

## 🎤 Audio Files (`/audio`)

### How to Create Test Audio Files

Since we cannot include actual audio files in the repository, here are instructions to create your own test audio:

#### Option 1: Record Your Own Audio
1. Use your phone's voice recorder or computer microphone
2. Read one of the sample notes from the `/notes` folder
3. Save as MP3, WAV, or M4A format
4. Keep file size under 10MB

#### Option 2: Use Text-to-Speech
You can use online TTS services to convert the sample notes to audio:
- **Google Text-to-Speech**: https://cloud.google.com/text-to-speech
- **Natural Readers**: https://www.naturalreaders.com/online/
- **TTSReader**: https://ttsreader.com/

#### Option 3: Sample Medical Audio Scripts

**Script 1 (30 seconds):**
```
Patient is a 45-year-old male presenting with acute chest pain. Pain started 2 hours ago, 
described as pressure-like, radiating to left arm. Patient appears diaphoretic and anxious. 
Vital signs: blood pressure 150 over 95, heart rate 110, oxygen saturation 96 percent on room air. 
EKG shows ST elevation in leads two, three, and AVF. Aspirin 325 milligrams given. 
Cardiology consulted. Patient being prepared for emergency cardiac catheterization.
```

**Script 2 (30 seconds):**
```
This is a follow-up visit for a 62-year-old female with chronic obstructive pulmonary disease. 
Patient reports increased shortness of breath over the past week. Currently using albuterol inhaler 
four times daily. No fever, no productive cough. Lung auscultation reveals decreased breath sounds 
bilaterally with mild wheezing. Oxygen saturation 92 percent on room air. 
Plan: increase inhaled corticosteroid, add long-acting bronchodilator, 
pulmonary function tests ordered, follow-up in two weeks.
```

**Script 3 (30 seconds):**
```
Home health visit for 80-year-old male with congestive heart failure. Patient reports 
increased leg swelling and weight gain of 5 pounds over 3 days. Currently taking furosemide 
40 milligrams daily. Physical exam shows bilateral lower extremity pitting edema, 
jugular venous distension present. Lung sounds clear. Blood pressure 135 over 80, 
heart rate regular at 76. Increasing furosemide to 40 milligrams twice daily. 
Patient educated on daily weight monitoring and sodium restriction. Follow-up in 48 hours.
```

## 🚀 How to Use These Files

### Testing Text Input:
1. Open the AI Scribe application (http://localhost:3000)
2. Select a patient from the list
3. Open one of the note example files
4. Copy the entire content
5. Paste into the text input field
6. Click "Create Note"
7. Wait for AI to generate SOAP format summary

### Testing Audio Upload:
1. Create or record an audio file using the scripts above
2. Save the audio file to the `/audio` folder
3. In the AI Scribe application, select a patient
4. Switch to "Audio Upload" tab
5. Upload your audio file
6. Click "Create Note"
7. Wait for transcription and AI summary

## 📊 Expected Results

When you submit a note (text or audio), the AI should:
1. ✅ Accept the input
2. ✅ Process with OpenAI API
3. ✅ Generate a SOAP format summary:
   - **S**ubjective: Patient's complaints and symptoms
   - **O**bjective: Physical examination findings and vital signs
   - **A**ssessment: Diagnosis or clinical impression
   - **P**lan: Treatment plan and follow-up

## 🔧 Troubleshooting

### "Failed to create note"
- Check if OpenAI API key is configured in `backend/.env`
- Verify Docker containers are running: `docker-compose ps`
- Check backend logs: `docker-compose logs backend`

### Audio upload fails
- Ensure file is in audio format (MP3, WAV, M4A)
- File size must be under 10MB
- Check file permissions

### AI summary not generating
- Verify OpenAI API key is valid
- Check API quota/credits
- Review backend logs for errors

## 💡 Tips for Demo

1. **Start Simple**: Begin with text input before testing audio
2. **Show Different Cases**: Use all three note examples to show variety
3. **Highlight AI Features**: Point out the SOAP format organization
4. **Compare**: Show original note vs. AI summary side-by-side
5. **Patient Context**: Demonstrate how notes are linked to specific patients

## 📝 Notes

- All sample notes are fictional and for demonstration purposes only
- No real patient data is included
- Audio files should be created fresh for each demo to ensure quality
- Keep audio recordings clear and at a moderate pace for best transcription results
