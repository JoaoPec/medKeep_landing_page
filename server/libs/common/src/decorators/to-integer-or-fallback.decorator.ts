import { Transform, TransformFnParams } from 'class-transformer';
import { Nullable } from '../interfaces';

export function ToIntegerOrFallback(fallbackValue: Nullable<number> = null) {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;
    let output: Nullable<number> = null;

    if (!!value && typeof value === 'string') {
      // const unsignedIntRegex: RegExp = /^\d+$/;
      // const isUnsignedInteger: boolean = unsignedIntRegex.test(value);
      const intRegex: RegExp = /^-?\d+$/;
      const isInteger: boolean = intRegex.test(value);

      if (isInteger === true) {
        output = Number(value);
      }
    } else if (typeof value === 'number' && Number.isInteger(value)) {
      output = value;
    }

    return !!output ? output : fallbackValue;
  });
}
