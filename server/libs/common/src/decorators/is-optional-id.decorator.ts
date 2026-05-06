import { applyDecorators } from '@nestjs/common';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export function IsOptionalId() {
  return applyDecorators(IsOptional(), IsInt(), IsPositive(), Min(1));
}
