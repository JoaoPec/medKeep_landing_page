/**
 * Canonicalizes an object by creating a deterministic string representation.
 * This is useful for generating consistent cache keys from objects regardless of property order.
 *
 * @param {T} obj - The object to canonicalize
 * @returns {string} A deterministic string representation of the object
 *
 * @example
 * // Returns: '{"age":30,"name":"John"}'
 * canonicalize({ name: "John", age: 30 });
 *
 * @example
 * // Returns: '[1,2,3]'
 * canonicalize([1, 2, 3]);
 *
 * @example
 * // Returns: '{"big": "12345678901234567890"}'
 * canonicalize({ big: 12345678901234567890n });
 */
export function canonicalize<T>(obj: T): string {
  // Handle primitive types and null values
  if (obj === null || typeof obj !== 'object') {
    if (typeof obj === 'bigint') {
      return JSON.stringify(obj.toString());
    }
    return JSON.stringify(obj);
  }

  // Handle arrays by recursively canonicalizing each element
  if (Array.isArray(obj)) {
    return '[' + obj.map((item) => canonicalize(item)).join(',') + ']';
  }

  // For objects, sort the keys alphabetically to ensure consistent output
  const sortedKeys: Array<string> = Object.keys(obj).sort();

  // Map each key-value pair to a string, recursively canonicalizing nested objects
  const keyValues: Array<string> = sortedKeys.map((key: string) => {
    const value = (obj as Record<string, any>)[key];
    // If the value is a bigint, convert it to string
    const canonicalValue: string =
      typeof value === 'bigint' ? JSON.stringify(value.toString()) : canonicalize(value);
    return `"${key}":${canonicalValue}`;
  });

  // Return the final canonicalized object
  return '{' + keyValues.join(',') + '}';
}
