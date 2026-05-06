import { ToDateAtEndOfDayOrFallback, ToDateAtMidnightOrFallback } from '@app/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional } from 'class-validator';
import { PaginationParamsQuery } from './pagination-params.query';

export class PaginationAndDateFilterQuery extends PaginationParamsQuery {
  @ApiProperty({
    type: Date,
    description: 'Minimum date for paginated results',
    example: '2022-07-24 12:00:22.442746',
  })
  @IsOptional()
  @ToDateAtMidnightOrFallback(new Date(2024, 0, 1))
  startDate: Date = new Date(new Date().setUTCHours(0, 0, 0, 0));

  @ApiProperty({
    type: Date,
    description: 'Max date for paginated results',
    example: '2022-07-25 13:40:22.442746',
  })
  @IsOptional()
  @ToDateAtEndOfDayOrFallback(new Date())
  endDate: Date = new Date(new Date().setUTCHours(23, 59, 59, 999));
}
