import { Injectable } from '@nestjs/common';

@Injectable()
export class LlmService {
  async generate(prompt: string): Promise<string> {
    const response = await fetch('http://localhost:11434/api/generate', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'llama3.2:3b',
        prompt,
        stream: false,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama generation failed: ${response.status}`);
    }

    const data = await response.json();

    return data.response;
  }
}
