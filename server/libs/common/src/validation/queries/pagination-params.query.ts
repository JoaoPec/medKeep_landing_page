import { ClampToRangeOrFallback } from '@app/common/decorators';
import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsOptional, IsPositive, Min } from 'class-validator';

export class PaginationParamsQuery {
  @ApiPropertyOptional({
    minimum: 1,
    default: 1,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: 'validation.INVALID_INT',
  })
  @IsPositive({
    message: 'validation.NOT_POSITIVE',
  })
  @Min(1, {
    message: 'validation.MIN',
  })
  page: number = 1;

  @ApiPropertyOptional({
    minimum: 1,
    maximum: 50,
    default: 10,
  })
  @Type(() => Number)
  @IsOptional()
  @IsInt({
    message: 'validation.INVALID_INT',
  })
  @IsPositive({
    message: 'validation.NOT_POSITIVE',
  })
  @Min(1, {
    message: 'validation.MIN',
  })
  @ClampToRangeOrFallback(1, 50, 10)
  limit: number = 10;

  get skip(): number {
    return (this.page - 1) * this.limit;
  }
}
