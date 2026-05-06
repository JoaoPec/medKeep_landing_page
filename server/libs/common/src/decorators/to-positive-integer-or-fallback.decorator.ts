import { Transform, TransformFnParams } from 'class-transformer';
import { Nullable } from '../interfaces';

export function ToPositiveIntegerOrFallback(fallbackValue: Nullable<number> = null) {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;
    let output: Nullable<number> = null;

    if (!!value && typeof value === 'string') {
      const positiveIntRegex: RegExp = /^\d+$/;
      const isPositiveInteger: boolean = positiveIntRegex.test(value);

      if (isPositiveInteger) {
        output = Number(value);
        // Ensure the number is at least 1
        if (output < 1) {
          output = null;
        }
      }
    } else if (typeof value === 'number' && Number.isInteger(value) && value >= 1) {
      output = value;
    }

    return output !== null ? output : fallbackValue;
  });
}
