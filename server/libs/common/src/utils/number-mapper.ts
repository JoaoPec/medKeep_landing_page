const _portugueseOrdinalNumberMap = new Map<number, string>([
  [1, 'primeiro'],
  [2, 'segundo'],
  [3, 'terceiro'],
  [4, 'quarto'],
  [5, 'quinto'],
  [6, 'sexto'],
  [7, 'sétimo'],
  [8, 'oitavo'],
  [9, 'nono'],
  [10, 'décimo'],
]);

const convertPortugueseNumberToWord = (number: number): string => {
  return _portugueseOrdinalNumberMap.get(number);
};

export const numberToWordMapper = (
  number: number,
  language: string,
  uppercase: boolean = false,
  firstUpper: boolean = false,
): string => {
  switch (language) {
    case 'pt-BR':
      let numberString = convertPortugueseNumberToWord(number);
      if (uppercase) {
        numberString = numberString.toUpperCase();
      }
      if (firstUpper) {
        numberString = numberString.charAt(0).toUpperCase() + numberString.slice(1);
      }
      return numberString;
    default:
      throw new Error('Language not supported');
  }
};
