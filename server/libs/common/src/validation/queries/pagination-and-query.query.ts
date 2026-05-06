import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString } from 'class-validator';
import { PaginationParamsQuery } from './pagination-params.query';

export class PaginationAndQuery extends PaginationParamsQuery {
  @ApiPropertyOptional()
  @Type(() => String)
  @IsOptional()
  @IsString({
    message: 'validation.INVALID_STRING',
  })
  query?: string;
}
