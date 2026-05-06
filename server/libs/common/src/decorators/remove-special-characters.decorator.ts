import { Transform, TransformFnParams } from 'class-transformer';

export function RemoveSpecialCharacters() {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;

    if (typeof value === 'string') {
      return value.replace(/[^a-zA-Z0-9 ]/g, '');
    }

    return value;
  });
}
