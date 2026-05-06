import { ToDateAtEndOfDayOrFallback, ToDateAtMidnightOrFallback } from '@app/common/decorators';
import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, MAX_DATE, MIN_DATE } from 'class-validator';

export class DateFilterQuery {
  @IsOptional()
  @ToDateAtMidnightOrFallback()
  @ApiProperty({
    type: Date,
    description: 'Minimum date for paginated results',
    example: MIN_DATE,
  })
  startDate: Date = new Date(new Date().setUTCHours(0, 0, 0, 0));

  @IsOptional()
  @ToDateAtEndOfDayOrFallback()
  @ApiProperty({
    type: Date,
    description: 'Max date for paginated results',
    example: MAX_DATE,
  })
  endDate: Date = new Date(new Date().setUTCHours(23, 59, 59, 999));
}
