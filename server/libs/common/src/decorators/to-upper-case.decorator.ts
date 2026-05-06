import { Transform, TransformFnParams } from 'class-transformer';

export function ToUpperCase() {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;

    if (typeof value === 'string') {
      return value.toUpperCase();
    }

    return value;
  });
}
