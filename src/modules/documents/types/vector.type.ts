// src/documents/types/vector.type.ts
import { Type } from '@mikro-orm/core';

export class VectorType extends Type<number[] | null, string | null> {
  convertToDatabaseValue(value: number[] | null | undefined): string | null {
    if (value == null) return null;
    return `[${value.join(',')}]`;
  }

  convertToJSValue(value: string | null | undefined): number[] | null {
    if (value == null) return null;
    // value looks like '[0.1,0.2,...]'
    return value
      .slice(1, -1)
      .split(',')
      .map((v) => parseFloat(v));
  }

  getColumnType(): string {
    return 'vector(768)';
  }
}
