import { GoogleGenAI } from '@google/genai';
import { Injectable, InternalServerErrorException } from '@nestjs/common';

@Injectable()
export class AiService {
  private ai: GoogleGenAI;

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY;

    if (!apiKey) {
      throw new InternalServerErrorException(
        'GEMINI_API_KEY is missing in your .env file',
      );
    }

    this.ai = new GoogleGenAI({ apiKey: apiKey });
  }

  async generateSmartFill(code: string, language: string) {
    const prompt = `
      You are an expert code organizer. Analyze the following ${language} code and generate metadata for a snippet vault.
      
      Code:
      ${code}

      Return a JSON object that strictly matches this structure:
      {
        "title": "A short, professional, catchy title for this code snippet",
        "description": "A brief 1-2 sentence description explaining exactly what this code does",
        "tags": ["tag1", "tag2", "tag3"]
      }
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    const responseText =
      response.text || '{"title": "Untitled", "description": "", "tags": []}';

    return JSON.parse(responseText);
  }
}
