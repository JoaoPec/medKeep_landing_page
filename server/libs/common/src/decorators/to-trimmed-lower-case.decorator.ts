import { Transform, TransformFnParams } from 'class-transformer';

export function ToTrimmedLowerCase() {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;

    if (typeof value === 'string') {
      return value.trimEnd().trimStart().toLowerCase();
    }

    return value;
  });
}
