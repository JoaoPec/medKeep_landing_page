import { Transform, TransformFnParams } from 'class-transformer';
import { isDate } from 'class-validator';
import { Nullable } from '../interfaces';

export function ToDateAtMidnightOrFallback(fallbackValue: Nullable<Date> = new Date(2024, 0, 1)) {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;

    // Default as null
    let output: Nullable<Date> = fallbackValue;

    // Check if the value is a valid date
    if (isDate(value)) {
      output = new Date(value);
      // Set time to 00:00:00 of the same day
    }

    if (!!output) {
      output.setHours(0, 0, 0, 0);
    }

    return output;
  });
}
