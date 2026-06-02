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

  async generateExplanation(
    code: string,
    language: string,
  ): Promise<{ explanation: string }> {
    const prompt = `
      You are an expert developer and a great teacher. Explain the following ${language} code precisely for a developer library page.
      Provide a high-level summary first, followed by 3-4 bullet points explaining the core logic, edge cases, or performance aspects.
      Keep it professional, direct, and easy to read. Use Markdown formatting.

      Code:
      ${code}
    `;

    const response = await this.ai.models.generateContent({
      model: 'gemini-2.5-flash',
      contents: prompt,
    });

    return {
      explanation: response.text || 'No explanation available.',
    };
  }
}
