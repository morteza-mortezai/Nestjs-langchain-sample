import { Injectable } from '@nestjs/common';

@Injectable()
export class EmbeddingsService {
  async createEmbedding(text: string): Promise<number[]> {
    const response = await fetch('http://localhost:11434/api/embeddings', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        model: 'nomic-embed-text',
        prompt: text,
      }),
    });

    if (!response.ok) {
      throw new Error(`Ollama embedding failed: ${response.status}`);
    }

    const data = await response.json();

    return data.embedding;
  }
}
