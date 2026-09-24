import { Controller, Get } from '@nestjs/common';
import { EmbeddingsService } from './embeddings.service';

@Controller('embeddings')
export class EmbeddingsController {
  constructor(private readonly embeddingsService: EmbeddingsService) {}

  @Get('test')
  async test() {
    const embedding = await this.embeddingsService.createEmbedding(
      'Employees receive 20 days of vacation per year.',
    );

    return {
      dimensions: embedding.length,
      embedding,
    };
  }
}
