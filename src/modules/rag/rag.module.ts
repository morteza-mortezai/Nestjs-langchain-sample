import { Module } from '@nestjs/common';
import { RagService } from './rag.service';
import { ChunkingService } from './chunking.service';
import { LlmModule } from '../llm/llm.module';
import { RagController } from './rag.controller';
import { EmbeddingsModule } from '../embeddings/embeddings.module';

@Module({
  imports: [LlmModule, EmbeddingsModule],
  controllers: [RagController],
  providers: [RagService, ChunkingService],
  exports: [RagService, ChunkingService],
})
export class RagModule {}
