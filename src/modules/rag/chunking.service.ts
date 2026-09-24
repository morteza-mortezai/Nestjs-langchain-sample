import { Injectable } from '@nestjs/common';

@Injectable()
export class ChunkingService {
  chunk(text: string, chunkSize = 200, overlap = 40): string[] {
    const words = text.trim().split(/\s+/);

    const chunks: string[] = [];

    for (let start = 0; start < words.length; start += chunkSize - overlap) {
      const chunk = words.slice(start, start + chunkSize).join(' ');

      if (chunk) {
        chunks.push(chunk);
      }
    }

    return chunks;
  }
}
