const defaultLocale =
  typeof navigator !== "undefined" && navigator.language
    ? navigator.language
    : "pt-BR";

export type FormatDateOptions = Intl.DateTimeFormatOptions;

export function formatDate(
  date: Date | string | number,
  locale: string = defaultLocale,
  options: FormatDateOptions = {
    day: "2-digit",
    month: "short",
    year: "numeric",
  },
): string {
  const d = date instanceof Date ? date : new Date(date);
  if (Number.isNaN(d.getTime())) return "";
  return new Intl.DateTimeFormat(locale, options).format(d);
}
