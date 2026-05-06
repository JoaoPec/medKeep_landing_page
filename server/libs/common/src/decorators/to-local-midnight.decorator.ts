import { Transform, TransformFnParams } from 'class-transformer';

export function ToLocalMidnight() {
  return Transform((params: TransformFnParams) => {
    // Parse the value into a Date object
    const date: Date = params.value;
    // Convert to UTC and set the time to 00:00:00.000
    const utcDate = new Date(
      Date.UTC(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0),
    );

    return utcDate;
  });
}
