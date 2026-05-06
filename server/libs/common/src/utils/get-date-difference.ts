export function getDateDifference(date1: Date, date2: Date) {
  // Calculate the time difference in milliseconds
  const timeDifference: number = Math.abs(+date2 - +date1);

  // Calculate days, hours, and weeks
  const daysDifference: number = Math.floor(timeDifference / (1000 * 60 * 60 * 24));
  const hoursDifference: number = Math.floor(timeDifference / (1000 * 60 * 60));
  const weeksDifference: number = Math.floor(timeDifference / (1000 * 60 * 60 * 24 * 7));

  return {
    days: daysDifference,
    hours: hoursDifference,
    weeks: weeksDifference,
  };
}
