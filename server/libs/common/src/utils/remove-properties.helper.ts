export function removeProperties<T>(obj: T, properties: Array<keyof T>): T {
  let newObj = { ...obj };

  properties.forEach((property) => {
    delete newObj[property];
  });

  return newObj;
}
