import { Transform, TransformFnParams } from 'class-transformer';

export function ToLowerCase() {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;

    if (typeof value === 'string') {
      return value.toLowerCase();
    }

    return value;
  });
}
