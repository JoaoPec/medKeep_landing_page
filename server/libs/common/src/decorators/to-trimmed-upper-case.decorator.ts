import { Transform, TransformFnParams } from 'class-transformer';

export function ToTrimmedUpperCase() {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;

    if (typeof value === 'string') {
      return value.trimEnd().trimStart().toUpperCase();
    }

    return value;
  });
}
