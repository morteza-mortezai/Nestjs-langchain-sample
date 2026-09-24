import { Migration } from '@mikro-orm/migrations';

export class Migration20260924130630 extends Migration {

  override async up(): Promise<void> {
    this.addSql(`CREATE INDEX document_chunk_embedding_hnsw_idx
ON document_chunk
USING hnsw (embedding vector_cosine_ops);`);
  }

  override async down(): Promise<void> {
    this.addSql(`select 1`);
  }

}
