import { Transform, TransformFnParams } from 'class-transformer';
import { isDate } from 'class-validator';
import { Nullable } from '../interfaces';

export function SafeCastDate() {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;

    // Default as null
    let output: Nullable<Date> = null;

    // Check if the value is a valid date
    if (isDate(value) === true) {
      output = new Date(value);
    }

    return output;
  });
}
