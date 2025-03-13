import fs from "fs";

const NUMBER_OF_DICE = 12;
const CHARACTERS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
const DICTIONARY_PATH = "./NWL2023.txt";
const rollDice = (): string[] => {
  let results = [];
  for (let i = 0; i < NUMBER_OF_DICE; i++) {
    results.push(
      CHARACTERS.charAt(Math.floor(Math.random() * CHARACTERS.length)),
    );
  }
  return results;
};

const loadDictionary = (): string[] => {
  try {
    const data = fs.readFileSync(DICTIONARY_PATH);
    const str = data.toString();
    const arr = str.split("\n");
    return arr.map((x) => x.split(" ")[0]).filter((x) => x !== "");
  } catch (error) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
};

const wordCanBeSpelled = (letters: string[], word: string): boolean => {
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

const selectPossibleWords = (
  dictionary: string[],
  letters: string[],
): string[] => dictionary.filter((word) => wordCanBeSpelled(letters, word));

// Top Left is the origin
const GRID_BASE = 12;
type Coordinate = { x: number; y: number };
const getIndexFromCoordinate = ({ x, y }: Coordinate): number => {
  return GRID_BASE * y + x;
};
const getCoordinateFromIndex = (idx: number): Coordinate => {
  return { x: idx % GRID_BASE, y: Math.floor(idx / GRID_BASE) };
};
const makeGrid = (): string[] => new Array(144).fill("0");
const useLetters = (letters: string[], word: string): string[] => {
  let updatedLetters = [...letters];
  word.split("").forEach((char) => {
    const idx = updatedLetters.findIndex((x) => x === char);
    delete updatedLetters[idx];
  });
  return updatedLetters.filter((char) => !!char);
};

const placeFirstWord = (solution: string[], word: string) => {
  const initialCoord: Coordinate = { x: 6 - Math.floor(word.length / 2), y: 6 };
  word.split("").forEach((char, idx) => {
    solution[
      getIndexFromCoordinate({ ...initialCoord, x: initialCoord.x + idx })
    ] = char;
  });
  return solution;
};

type Direction = "horizontal" | "vertical";
const placeWord = (grid: string[], coord: Coordinate, word: string) => {
  const charAtCoord = grid[getIndexFromCoordinate(coord)];
  const playableDir: Direction =
    grid[getIndexFromCoordinate({ ...coord, x: coord.x - 1 })] === "0" &&
    grid[getIndexFromCoordinate({ ...coord, x: coord.x + 1 })] === "0"
      ? "horizontal"
      : "vertical";

  const letterIndex = [...word].findIndex((x) => x === charAtCoord);
  const beforeLetters = [...word].slice(0, letterIndex);
  console.log(beforeLetters);
  const afterLetters = [...word].slice(letterIndex + 1, word.length);
  console.log(afterLetters);
  if (playableDir === "horizontal") {
    beforeLetters.forEach((char, idx) => {
      grid[
        getIndexFromCoordinate({
          ...coord,
          x: coord.x - (beforeLetters.length - idx),
        })
      ] = char;
    });
    afterLetters.forEach((char, idx) => {
      grid[
        getIndexFromCoordinate({
          ...coord,
          x: coord.x + (idx + 1),
        })
      ] = char;
    });
  }
  if (playableDir === "vertical") {
    beforeLetters.forEach((char, idx) => {
      grid[
        getIndexFromCoordinate({
          ...coord,
          y: coord.y - (beforeLetters.length - idx),
        })
      ] = char;
    });
    afterLetters.forEach((char, idx) => {
      grid[
        getIndexFromCoordinate({
          ...coord,
          y: coord.y + (idx + 1),
        })
      ] = char;
    });
  }

  return grid;
};

// const turn = (grid: string[], letters: string[], validWords: string[]) => {
//   let remainingLetters = [...letters];
//   const word = startingWords.pop();
//   remainingLetters = useLetters(remainingLetters, startingWord);
//   console.log(
//     "placing word",
//     startingWord,
//     "remaining letters",
//     remainingLetters,
//   );
//   solution = placeWord(solution, startingWord);
// };

const solve = (
  possibleWords: string[],
  letters: string[],
): string[] | false => {
  let validSolution: string[] | false = false;
  let startingWords = [...possibleWords];
  while (!validSolution && startingWords.length > 0) {
    let solution = makeGrid();
    let remainingLetters = [...letters];
    const startingWord = startingWords.pop();
    remainingLetters = useLetters(remainingLetters, startingWord);
    console.log(
      "placing word",
      startingWord,
      "remaining letters",
      remainingLetters,
    );
    solution = placeFirstWord(solution, startingWord);
    if (remainingLetters.length === 0) {
      validSolution = solution;
    }
    const lettersToPlayOff = [...startingWord];
    while (!validSolution && lettersToPlayOff.length > 0) {
      const letterToPlayOff = lettersToPlayOff.pop();
      const wordsToTry = selectPossibleWords(
        possibleWords.filter((word) => word.includes(letterToPlayOff)),
        remainingLetters.concat([letterToPlayOff]),
      );
      while (!validSolution && wordsToTry.length > 0) {
        const word = wordsToTry.pop();
        console.log(
          "placing second word",
          word,
          "remaining letters",
          useLetters(remainingLetters, word),
        );
        // NOTE: this doesn't consider when there might be multiple instances of the letter to use on the board or more complex combinations of usable letters on the board
        const coordinate = getCoordinateFromIndex(
          solution.findIndex((x) => x === letterToPlayOff),
        );
        // Note: if a word has multiple instances of the letter already on the board, determining how they overlap is more complex than this
        const result = placeWord(solution, coordinate, word);
        // validSolution = result;
        if (remainingLetters.length === 0) {
          validSolution = solution;
        }
      }
    }
  }
  return validSolution;
};

const main = (): void => {
  console.log("rolling the dice...");
  const letters = rollDice();
  console.log("Letters are", letters);

  console.log("loading the dictionary");
  const dictionary = loadDictionary();
  console.log("There are", dictionary.length, "words in the dictionary");

  console.log("selecting possible words");
  const possibleWords = selectPossibleWords(dictionary, letters);
  console.log(
    "There are",
    possibleWords.length,
    "possible words that can be formed with these letters",
  );
  console.log("Possible Words", possibleWords);

  console.log("Attempting Solution");
  const result = solve(possibleWords, letters);
  console.log("Solution", result);

  return;
};

main();
