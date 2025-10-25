import OpenAI from 'openai';
import fs from 'fs';
import path from 'path';
import { OpenAIResponse } from '../types';

class OpenAIService {
  private client: OpenAI | null = null;

  private getClient(): OpenAI {
    if (!this.client) {
      if (!process.env.OPENAI_API_KEY) {
        throw new Error('OPENAI_API_KEY environment variable is required');
      }
      
      this.client = new OpenAI({
        apiKey: process.env.OPENAI_API_KEY,
      });
    }
    return this.client;
  }

  async transcribeAudio(audioBuffer: Buffer, filename: string): Promise<string> {
    const tempFilePath = path.join('/tmp', `temp-${Date.now()}-${filename}`);
    
    try {
      const client = this.getClient();
      
      fs.writeFileSync(tempFilePath, audioBuffer);
      
      const transcription = await client.audio.transcriptions.create({
        file: fs.createReadStream(tempFilePath),
        model: 'whisper-1',
      });

      fs.unlinkSync(tempFilePath);

      return transcription.text;
    } catch (error) {
      if (fs.existsSync(tempFilePath)) {
        fs.unlinkSync(tempFilePath);
      }
      console.error('OpenAI transcription error:', error);
      throw new Error('Failed to transcribe audio');
    }
  }

  async generateSummary(content: string): Promise<string> {
    try {
      const client = this.getClient();
      const systemPrompt = `You are a medical AI assistant. Summarize the following medical note in SOAP format (Subjective, Objective, Assessment, Plan). 
      Focus on key medical information and maintain professional medical terminology. 
      Do not include any personal opinions or non-medical content.`;

      const response = await client.chat.completions.create({
        model: 'gpt-3.5-turbo',
        messages: [
          {
            role: 'system',
            content: systemPrompt
          },
          {
            role: 'user',
            content: content
          }
        ],
        max_tokens: 500,
        temperature: 0.3,
      });

      return response.choices[0]?.message?.content || '';
    } catch (error) {
      console.error('OpenAI summary error:', error);
      throw new Error('Failed to generate summary');
    }
  }

  async processNote(content: string, audioBuffer?: Buffer, filename?: string): Promise<OpenAIResponse> {
    const result: OpenAIResponse = {};

    if (audioBuffer && filename) {
      result.transcription = await this.transcribeAudio(audioBuffer, filename);
    }

    if (content || result.transcription) {
      const textToSummarize = result.transcription || content;
      result.summary = await this.generateSummary(textToSummarize);
    }

    return result;
  }
}

export default new OpenAIService();
