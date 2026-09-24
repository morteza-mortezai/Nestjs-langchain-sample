import { EntityManager } from '@mikro-orm/postgresql';
import { Injectable } from '@nestjs/common';
import { EmbeddingsService } from '../embeddings/embeddings.service';
import { LlmService } from '../llm/llm.service';

@Injectable()
export class RagService {
  constructor(
    private readonly em: EntityManager,
    private readonly embeddingsService: EmbeddingsService,
    private readonly llmService: LlmService,
  ) {}

  async ask(question: string) {
    const questionEmbedding =
      await this.embeddingsService.createEmbedding(question);

    const chunks = await this.em.getConnection().execute(
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

    const context = chunks
      .map((chunk, index) => `[Source ${index + 1}]\n${chunk.content}`)
      .join('\n\n');

    const prompt = `
You are a helpful assistant.

Answer the user's question using ONLY the provided context.

If the answer cannot be found in the context, say:
"I don't know based on the provided documents."

Context:

${context}

Question:
${question}

Answer:
`;

    const answer = await this.llmService.generate(prompt);

    return {
      answer,
      sources: chunks,
    };
  }
}
