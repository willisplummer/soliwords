export const wordCanBeSpelled = (letters: string[], word: string): boolean => {
  let lettersRemaining = [...letters];
  return word.split("").every((char) => {
    const idx: number = lettersRemaining.findIndex((value) => value === char);
    if (idx >= 0) {
      delete lettersRemaining[idx];
      return true;
    } else {
      return false;
    }
  });
};
