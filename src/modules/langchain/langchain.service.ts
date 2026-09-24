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
    const vector = await this.embeddings.embedQuery(
      'How many vacation days do employees get?',
    );

    return {
      dimensions: vector.length,
      vector,
    };
  }

  async testLlm() {
    const response = await this.llm.invoke(
      'What is RAG? Answer in one sentence.',
    );

    return response.content;
  }
}
