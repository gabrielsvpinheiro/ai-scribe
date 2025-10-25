import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Upload, Mic, FileText } from 'lucide-react';

interface NoteFormProps {
  selectedPatientId: string | null;
  onSubmit: (data: { patientId: string; content?: string; audioFile?: File }) => void;
  isLoading: boolean;
}

const NoteForm: React.FC<NoteFormProps> = ({
  selectedPatientId,
  onSubmit,
  isLoading,
}) => {
  const [content, setContent] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'text' | 'audio'>('text');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    const data: { patientId: string; content?: string; audioFile?: File } = {
      patientId: selectedPatientId,
    };

    if (inputType === 'text' && content.trim()) {
      data.content = content.trim();
    } else if (inputType === 'audio' && audioFile) {
      data.audioFile = audioFile;
    }

    onSubmit(data);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type.startsWith('audio/')) {
      setAudioFile(file);
    } else {
      alert('Please select an audio file');
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Create New Note</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="flex gap-2">
            <Button
              type="button"
              variant={inputType === 'text' ? 'default' : 'outline'}
              onClick={() => setInputType('text')}
              className="flex items-center gap-2"
            >
              <FileText className="h-4 w-4" />
              Text Input
            </Button>
            <Button
              type="button"
              variant={inputType === 'audio' ? 'default' : 'outline'}
              onClick={() => setInputType('audio')}
              className="flex items-center gap-2"
            >
              <Mic className="h-4 w-4" />
              Audio Upload
            </Button>
          </div>

          {inputType === 'text' && (
            <Textarea
              placeholder="Enter your medical notes here..."
              value={content}
              onChange={(e) => setContent(e.target.value)}
              rows={6}
            />
          )}

          {inputType === 'audio' && (
            <div className="space-y-2">
              <Input
                type="file"
                accept="audio/*"
                onChange={handleFileChange}
                className="cursor-pointer"
              />
              {audioFile && (
                <p className="text-sm text-muted-foreground">
                  Selected: {audioFile.name}
                </p>
              )}
            </div>
          )}

          <Button
            type="submit"
            disabled={!selectedPatientId || isLoading || (!content.trim() && !audioFile)}
            className="w-full"
          >
            {isLoading ? 'Processing...' : 'Create Note'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NoteForm;
