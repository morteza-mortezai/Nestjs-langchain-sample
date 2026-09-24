import { Entity, PrimaryKey, Property, ManyToOne } from '@mikro-orm/core';
import { VectorType } from '../types/vector.type';

import { Document } from './document.entity';

@Entity()
export class DocumentChunk {
  @PrimaryKey()
  id!: number;

  @ManyToOne(() => Document)
  document!: Document;

  @Property({ type: 'text' })
  content!: string;

  @Property()
  chunkIndex!: number;

  @Property({
    type: VectorType,
    length: 768,
    nullable: true,
  })
  embedding?: number[];
}
