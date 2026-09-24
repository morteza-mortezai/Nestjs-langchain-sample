import { Injectable } from '@nestjs/common';
import { ChatOllama, OllamaEmbeddings } from '@langchain/ollama';

@Injectable()
export class LangchainService {
  private readonly embeddings = new OllamaEmbeddings({
    model: 'nomic-embed-text',
    baseUrl: 'http://localhost:11434',
  });

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
}
