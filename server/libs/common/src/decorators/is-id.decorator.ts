import { applyDecorators } from '@nestjs/common';
import { IsInt, IsNotEmpty, IsPositive, Min } from 'class-validator';

export function IsId() {
  return applyDecorators(
    IsNotEmpty({ always: true }),
    IsInt({ always: true }),
    IsPositive({ always: true }),
    Min(1, { always: true }),
  );
}
