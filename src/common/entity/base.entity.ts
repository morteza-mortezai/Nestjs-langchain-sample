import { PrimaryKey, Property } from '@mikro-orm/postgresql';
import { ulid } from 'ulid';

export abstract class BaseEntity {
  @PrimaryKey({ type: 'string', columnType: 'char(26)' })
  id = ulid();

  @Property({ defaultRaw: 'now()', type: 'timestamptz' })
  createdAt: Date = new Date();
}
