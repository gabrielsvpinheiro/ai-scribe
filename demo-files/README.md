# Demo Files

Sample files for testing the AI Scribe application.

## 📁 Structure

```
demo-files/
├── notes/          # Sample medical notes (text)
└── audio/          # Place audio files here
```

## 📝 Text Notes

Three sample medical notes for testing:

1. **note-example-1.txt** - Headache case
2. **note-example-2.txt** - Diabetes home visit
3. **note-example-3.txt** - Post-operative knee follow-up

### How to Use

1. Open any `.txt` file
2. Copy the content
3. Paste into AI Scribe text input
4. Select a patient and click "Create Note"
5. AI will generate a SOAP format summary

## 🎤 Audio Files

### Creating Test Audio

Record yourself reading one of the sample notes:

**Quick Script (30 seconds):**
```
Patient is a 45-year-old male with chest pain that started 2 hours ago. 
Pain is pressure-like, radiating to left arm. Patient appears anxious. 
Blood pressure 150 over 95, heart rate 110. 
Gave aspirin 325 milligrams. Cardiology consulted.
```

### How to Use

1. Record audio (MP3, WAV, or M4A)
2. Keep under 10MB
3. Upload in AI Scribe
4. Select patient and click "Create Note"
5. AI will transcribe and summarize

## 💡 Tips

- Start with text input before testing audio
- Use different patients for different notes
- Check that OpenAI API key is configured in `backend/.env`
- All notes are fictional for demo purposes only