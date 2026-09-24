import { Module } from '@nestjs/common';
import { DocumentsService } from './documents.service';
import { MikroOrmModule } from '@mikro-orm/nestjs';
import { DocumentChunk } from './entity/document-chunk.entity';
import { Document } from './entity/document.entity';
import { EmbeddingsModule } from '../embeddings/embeddings.module';
import { RagModule } from '../rag/rag.module';
import { DocumentsController } from './documents.controller';

@Module({
  controllers: [DocumentsController],
  imports: [
    EmbeddingsModule,
    RagModule,
    MikroOrmModule.forFeature([Document, DocumentChunk]),
  ],
  providers: [DocumentsService],
})
export class DocumentsModule {}
