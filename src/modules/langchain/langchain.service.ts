import { Injectable, OnModuleInit, Logger } from '@nestjs/common';
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';
import { PGVectorStore } from '@langchain/community/vectorstores/pgvector';
import { ConfigService } from '@nestjs/config';
import { ChatPromptTemplate } from '@langchain/core/prompts';
import {
  RunnableParallel,
  RunnablePassthrough,
  RunnableLambda,
} from '@langchain/core/runnables';
import { StringOutputParser } from '@langchain/core/output_parsers';

@Injectable()
export class LangchainService implements OnModuleInit {
  constructor(private readonly config: ConfigService) {}
  private readonly logger = new Logger(LangchainService.name);
  private vectorStore!: PGVectorStore;

  prompt = ChatPromptTemplate.fromTemplate(`
You are a helpful assistant.

Answer the question using ONLY the provided context.

If the answer cannot be found in the context,
say:
"I don't know based on the provided documents."

Context:
{context}

Question:
{question}

Answer:
`);

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
      const context = documents
        .map((doc, index) => {
          return `[Source ${index + 1}]
${doc.pageContent}`;
        })
        .join('\n\n');

      const messages = await this.prompt.invoke({
        context,
        question,
      });

      this.logger.debug(messages);

      const response = await this.llm.invoke(messages);

      return {
        answer: response.content,
        sources: documents.map((doc) => ({
          content: doc.pageContent,
          metadata: doc.metadata,
        })),
      };
    } catch (err) {
      this.logger.error('Search failed', err);
      throw new Error(
        `Search failed: ${err instanceof Error ? err.message : 'Unknown error'}`,
      );
    }
  }

  private formatDocuments(documents: any[]): string {
    return documents
      .map(
        (doc, index) =>
          `[Source ${index + 1}]
${doc.pageContent}`,
      )
      .join('\n\n');
  }

  ask3(question: string) {
    const retriever = this.vectorStore.asRetriever({
      k: 5,
    });

    const formatDocuments = new RunnableLambda({
      func: async (documents: any[]) =>
        documents
          .map(
            (doc, index) =>
              `[Source ${index + 1}]
${doc.pageContent}`,
          )
          .join('\n\n'),
    });

    const ragChain = RunnableParallel.from({
      context: retriever.pipe(formatDocuments),
      question: new RunnablePassthrough(),
    })
      .pipe(this.prompt)
      .pipe(this.llm)
      .pipe(new StringOutputParser());

    return ragChain.invoke(question);
  }
}
