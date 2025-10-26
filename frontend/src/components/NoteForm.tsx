import React, { useState } from 'react';
import { Button } from './ui/button';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Input } from './ui/input';
import { Textarea } from './ui/textarea';
import { Mic, FileText } from 'lucide-react';

interface NoteFormProps {
  selectedPatientId: string | null;
  onSubmit: (content: string, audioFile?: File) => void;
}

const NoteForm: React.FC<NoteFormProps> = ({
  selectedPatientId,
  onSubmit,
}) => {
  const [content, setContent] = useState('');
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [inputType, setInputType] = useState<'text' | 'audio'>('text');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedPatientId) return;

    if (inputType === 'text' && !content.trim()) return;
    if (inputType === 'audio' && !audioFile) return;

    setIsSubmitting(true);
    try {
      if (inputType === 'text') {
        await onSubmit(content.trim());
      } else if (audioFile) {
        await onSubmit('', audioFile);
      }
      setContent('');
      setAudioFile(null);
    } finally {
      setIsSubmitting(false);
    }
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
            disabled={!selectedPatientId || isSubmitting || (!content.trim() && !audioFile)}
            className="w-full"
          >
            {isSubmitting ? 'Processing...' : 'Create Note'}
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

export default NoteForm;
