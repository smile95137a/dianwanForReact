const NUMBERS = '0123456789';
const LOWER_CHARS = 'abcdefghijklmnopqrstuvwxyz';
const UPPER_CHARS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
const OTHER_CHARS = '!@#$%-+?';
const ALL_CHARS = NUMBERS + LOWER_CHARS + UPPER_CHARS + OTHER_CHARS;
const ALL_CHARS_WITHOUT_OTHER = NUMBERS + LOWER_CHARS + UPPER_CHARS;
const LETTERS = LOWER_CHARS + UPPER_CHARS;
const LETTERS_WITH_SYMBOLS = LOWER_CHARS + UPPER_CHARS + OTHER_CHARS;
export const getRandomNumberInRange = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

export const genRandom = (len: number, hasSpec: boolean = false) => {
  let sb = '';

  const prefixList = ['0', '1', '2']
    .sort(() => Math.random() - 0.5)
    .slice(0, len);

  for (let i = 0; i < len; i++) {
    if (prefixList[i]) {
      const prefix = prefixList[i];
      switch (prefix) {
        case '0':
          sb += NUMBERS.charAt(Math.floor(Math.random() * NUMBERS.length));
          break;
        case '1':
          sb += LOWER_CHARS.charAt(
            Math.floor(Math.random() * LOWER_CHARS.length)
          );
          break;
        case '2':
          sb += UPPER_CHARS.charAt(
            Math.floor(Math.random() * UPPER_CHARS.length)
          );
          break;
      }
    } else {
      if (hasSpec) {
        sb += ALL_CHARS.charAt(Math.floor(Math.random() * ALL_CHARS.length));
      } else {
        sb += ALL_CHARS_WITHOUT_OTHER.charAt(
          Math.floor(Math.random() * ALL_CHARS_WITHOUT_OTHER.length)
        );
      }
    }
  }

  const charList = sb.split('').sort(() => Math.random() - 0.5);
  const result = charList.join('');
  return result;
};

export const genRandomNumbers = (len: number) => {
  let sb = '';
  for (let i = 0; i < len; i++) {
    sb += NUMBERS.charAt(Math.floor(Math.random() * NUMBERS.length));
  }
  return sb;
};

export const genRandomLetters = (len: number) => {
  let sb = '';
  for (let i = 0; i < len; i++) {
    sb += LETTERS.charAt(Math.floor(Math.random() * LETTERS.length));
  }
  return sb;
};

export const genRandomLettersWithSymbols = (len: number) => {
  let sb = '';
  for (let i = 0; i < len; i++) {
    sb += LETTERS_WITH_SYMBOLS.charAt(
      Math.floor(Math.random() * LETTERS_WITH_SYMBOLS.length)
    );
  }
  return sb;
};
