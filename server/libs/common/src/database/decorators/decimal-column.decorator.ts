import { Column } from 'typeorm';
import { DecimalTransformer } from '../transformers';

export interface DecimalColumnOptions {
  nullable?: boolean;
  precision?: number;
  scale?: number;
  default?: number;
}

export function DecimalColumn(options?: DecimalColumnOptions) {
  return Column('decimal', {
    nullable: !!options?.nullable,
    precision: options?.precision || 19,
    scale: options?.scale || 8,
    default: options?.nullable ? null : options?.default || 0,
    transformer: new DecimalTransformer(),
  });
}
