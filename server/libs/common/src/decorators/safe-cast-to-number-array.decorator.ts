import { Transform, TransformFnParams } from 'class-transformer';

export function SafeCastToNumberArray() {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;
    const intRegex: RegExp = /^-?\d+$/;

    if (typeof value === 'string' && value.trim() !== '') {
      return value
        .split(',')
        .map((num: string) => {
          const isInteger: boolean = intRegex.test(num.trim());

          if (isInteger === true) {
            return Number(num.trimEnd().trimStart());
          }

          return null;
        })
        .filter((num) => !isNaN(num));
    }

    return [];
  });
}
