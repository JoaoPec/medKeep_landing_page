import { Transform, TransformFnParams } from 'class-transformer';
import { Nullable } from '../interfaces';

export function ToUnsignedIntegerOrFallback(fallbackValue: Nullable<number> = null) {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;
    let output: Nullable<number> = null;

    if (!!value && typeof value === 'string') {
      const unsignedIntRegex: RegExp = /^\d+$/;
      const isUnsignedInteger: boolean = unsignedIntRegex.test(value);

      if (isUnsignedInteger === true) {
        output = Number(value);
      }
    } else if (typeof value === 'number' && Number.isInteger(value) && value >= 0) {
      output = value;
    }

    return !!output ? output : fallbackValue;
  });
}
