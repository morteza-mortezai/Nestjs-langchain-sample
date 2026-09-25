import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class LangchainService implements OnModuleInit {
  private readonly logger = new Logger(LangchainService.name);
  constructor(private readonly config: ConfigService) {}
  private vectorStore!: PGVectorStore;

 

  private readonly embeddings = new OllamaEmbeddings({
    model: 'nomic-embed-text',
    baseUrl: 'http://localhost:11434',
 
  });

  async onModuleInit() {
    try {
      this.vectorStore = await PGVectorStore.initialize(this.embeddings, {
        postgresConnectionOptions: {
          type: 'postgres',
          host: 'localhost',
          port: 5433,
          user: 'postgres',
          password: 'postgres',
          database: 'rag',
        },

        tableName: 'document_chunk',

        columns: {
          idColumnName: 'id',
          vectorColumnName: 'embedding',
          contentColumnName: 'content',
        },
      });
      this.logger.log('PGVectorStore initialized successfully');
    } catch (err) {
      this.logger.error('Failed to initialize PGVectorStore', err);
      throw err;
    }
  }

  private readonly llm = new ChatOllama({
    model: 'llama3.2:3b',
    temperature: 0,
    baseUrl: 'http://localhost:11434',
   });

  async testEmbedding() {
    let vector: any;
    try {
      vector = (await this.embeddings.embedQuery(
        'How many vacation days do employees get?',
      )) as any;
    } catch (err) {
      console.error('Embedding failed:', err);
      throw err;
    }

    return {
      dimensions: (vector as any[]).length,
      vector: vector as any[],
    };
  }

  async testLlm() {
    let response: any;
    try {
      response = (await this.llm.invoke(
        'What is RAG? Answer in one sentence.',
      )) as any;
    } catch (err) {
      console.error('LLM invoke failed:', err);
      throw err;
    }

    return (response as any).content;
  }

  async search(question: string) {
    try {
      const retriever = this.vectorStore.asRetriever({
        k: 5,
      });

      const documents = await retriever.invoke(question);

      return documents;
    } catch (err) {
      this.logger.error('Search failed', err);
      throw new Error(
        `Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }
}
