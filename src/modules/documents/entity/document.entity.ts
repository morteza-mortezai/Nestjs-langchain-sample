// src/documents/entities/document.entity.ts

import {
  Entity,
  PrimaryKey,
  Property,
  OneToMany,
  Collection,
} from '@mikro-orm/core';
import { DocumentChunk } from './document-chunk.entity';

@Entity()
export class Document {
  @PrimaryKey()
  id!: number;

  @Property()
  title!: string;

  @Property({ type: 'text' })
  content!: string;

  @OneToMany(() => DocumentChunk, (chunk) => chunk.document)
  chunks = new Collection<DocumentChunk>(this);
}
