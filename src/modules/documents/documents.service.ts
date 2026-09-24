import { InjectRepository } from '@mikro-orm/nestjs';
import { EntityManager, EntityRepository } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { Document } from './entity/document.entity';
import { DocumentChunk } from './entity/document-chunk.entity';
import { ChunkingService } from '../rag/chunking.service';
import { CreateDocumentDto } from './dto/create-document.dto/create-document.dto';

@Injectable()
export class DocumentsService {
  constructor(
    @InjectRepository(Document)
    private readonly documentRepository: EntityRepository<Document>,

    @InjectRepository(DocumentChunk)
    private readonly chunkRepository: EntityRepository<DocumentChunk>,

    private readonly embeddingsService: EmbeddingsService,

    private readonly chunkingService: ChunkingService,

    private readonly em: EntityManager,
  ) {}

  async create({ title, content }: CreateDocumentDto) {
    const document = this.documentRepository.create({
      title,
      content,
    });
    await this.em.persistAndFlush(document);

    const chunks = this.chunkingService.chunk(content, 200, 40);

    console.log('chunks', chunks.length);

    for (let i = 0; i < chunks.length; i++) {
      const content = chunks[i];

      const embedding = await this.embeddingsService.createEmbedding(content);

      const chunk = this.chunkRepository.create({
        document,
        content,
        chunkIndex: i,
        embedding,
      });

      this.em.persist(chunk);
    }

    await this.em.flush();

    return {
      id: document.id,
      title: document.title,
      chunks: chunks.length,
    };
  }

  async search(question: string) {
    const questionEmbedding =
      await this.embeddingsService.createEmbedding(question);

    const results = await this.em.getConnection().execute(
      `
      SELECT
        id,
        document_id,
        content,
        chunk_index,
        1 - (embedding <=> ?::vector) AS similarity
      FROM document_chunk
      WHERE embedding IS NOT NULL
      ORDER BY embedding <=> ?::vector
      LIMIT 5
      `,
      [JSON.stringify(questionEmbedding), JSON.stringify(questionEmbedding)],
    );

    return results;
  }
}
