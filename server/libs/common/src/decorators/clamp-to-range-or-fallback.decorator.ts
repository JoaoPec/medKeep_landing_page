import { Transform, TransformFnParams } from 'class-transformer';

export function ClampToRangeOrFallback(min: number, max: number, fallback: number) {
  return Transform((params: TransformFnParams) => {
    const value: any = params?.value;

    // If value is not provided or is not a number, return the fallback
    if (value === undefined || value === null || isNaN(Number(value))) {
      return fallback;
    }

    // Clamp the value within the specified range
    return Math.max(min, Math.min(Number(value), max));
  });
}
