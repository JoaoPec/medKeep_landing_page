export function stringToEnum<T>(enumObj: T, str: string): T[keyof T] {
  return enumObj[str.toUpperCase() as keyof T];
}
