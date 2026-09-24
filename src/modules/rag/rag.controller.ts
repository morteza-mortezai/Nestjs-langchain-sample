import { Controller, Post, Body } from '@nestjs/common';
import { RagService } from './rag.service';

@Controller('embeddings')
export class RagController {
  constructor(private readonly ragService: RagService) {}

  @Post('ask')
  ask(@Body('question') question: string) {
    return this.ragService.ask(question);
  }
}
