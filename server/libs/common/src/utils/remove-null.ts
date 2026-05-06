export function removeNull(fn) {
  return function (...args) {
    const result = fn(...args);
    if (typeof result === 'object' && result !== null) {
      Object.keys(result).forEach((key) => {
        if (result[key] === null) {
          delete result[key];
        }
      });
    }
    return result;
  };
}
