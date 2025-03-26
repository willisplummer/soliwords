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

// const wordCanBeSpelled2 = (
//   letters: string[],
//   lettersOnTheBoard: string[],
//   word: string,
// ): boolean => {
//   let lettersRemaining = [...letters];
//   let canUseBoard = true;
//   return word.split("").every((char) => {
//     const idx: number = lettersRemaining.findIndex((value) => value === char);
//     if (idx >= 0) {
//       delete lettersRemaining[idx];
//       return true;
//     }
//     const boardIdx: number = lettersOnTheBoard.findIndex((v) => v === char);
//     if (boardIdx >= 0 && canUseBoard) {
//       canUseBoard = false;
//       return true;
//     }
//
//     return false;
//   });
// };
//
const selectPossibleWords = (
  dictionary: string[],
  letters: string[],
): string[] =>
  dictionary.filter(
    (word) => word.length >= 3 && wordCanBeSpelled(letters, word),
  );
// const selectRemainingPossibleWords = (
//   dictionary: string[],
//   letters: string[],
//   //need a way to handle words that use two letters on the board still
//   lettersOnBoard: string[],
// ): string[] =>
//   dictionary.filter(
//     (word) =>
//       word.length >= 3 && wordCanBeSpelled2(letters, lettersOnBoard, word),
//   );

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

const initGameboard = (firstWord: string): string[] =>
  placeFirstWord(makeGrid(), firstWord);

type Direction = "horizontal" | "vertical";
const placeWord = (
  grid: string[],
  coord: Coordinate,
  word: string,
  split: WordChar,
): string[] => {
  const newBoard = [...grid];
  const playableDir: Direction =
    grid[getIndexFromCoordinate({ ...coord, x: coord.x - 1 })] === "0" &&
    grid[getIndexFromCoordinate({ ...coord, x: coord.x + 1 })] === "0"
      ? "horizontal"
      : "vertical";

  const letterIndex = split.index;
  const beforeLetters = [...word].slice(0, letterIndex);
  // console.log(beforeLetters);
  const afterLetters = [...word].slice(letterIndex + 1, word.length);
  // console.log(afterLetters);
  if (playableDir === "horizontal") {
    beforeLetters.forEach((char, idx) => {
      newBoard[
        getIndexFromCoordinate({
          ...coord,
          x: coord.x - (beforeLetters.length - idx),
        })
      ] = char;
    });
    afterLetters.forEach((char, idx) => {
      newBoard[
        getIndexFromCoordinate({
          ...coord,
          x: coord.x + (idx + 1),
        })
      ] = char;
    });
  }
  if (playableDir === "vertical") {
    beforeLetters.forEach((char, idx) => {
      newBoard[
        getIndexFromCoordinate({
          ...coord,
          y: coord.y - (beforeLetters.length - idx),
        })
      ] = char;
    });
    afterLetters.forEach((char, idx) => {
      newBoard[
        getIndexFromCoordinate({
          ...coord,
          y: coord.y + (idx + 1),
        })
      ] = char;
    });
  }

  return newBoard;
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

// const solve = (
//   possibleWords: string[],
//   letters: string[],
// ): string[] | false => {
//   let validSolution: string[] | false = false;
//   let startingWords = [...possibleWords];
//   while (!validSolution && startingWords.length > 0) {
//     let solution = makeGrid();
//     let remainingLetters = [...letters];
//     const startingWord = startingWords.pop();
//     remainingLetters = useLetters(remainingLetters, startingWord);
//     console.log(
//       "placing word",
//       startingWord,
//       "remaining letters",
//       remainingLetters,
//     );
//     solution = placeFirstWord(solution, startingWord);
//     if (remainingLetters.length === 0) {
//       validSolution = solution;
//     }
//     const lettersToPlayOff = [...startingWord];
//     while (!validSolution && lettersToPlayOff.length > 0) {
//       const letterToPlayOff = lettersToPlayOff.pop();
//       const wordsToTry = selectPossibleWords(
//         possibleWords.filter((word) => word.includes(letterToPlayOff)),
//         remainingLetters.concat([letterToPlayOff]),
//       );
//       while (!validSolution && wordsToTry.length > 0) {
//         const word = wordsToTry.pop();
//         console.log(
//           "placing second word",
//           word,
//           "remaining letters",
//           useLetters(remainingLetters, word),
//         );
//         // NOTE: this doesn't consider when there might be multiple instances of the letter to use on the board or more complex combinations of usable letters on the board
//         const coordinate = getCoordinateFromIndex(
//           solution.findIndex((x) => x === letterToPlayOff),
//         );
//         // Note: if a word has multiple instances of the letter already on the board, determining how they overlap is more complex than this
//         const result = placeWord(solution, coordinate, word);
//         // validSolution = result;
//         if (remainingLetters.length === 0) {
//           validSolution = solution;
//         }
//       }
//     }
//   }
//   return validSolution;
// };

type GameState = {
  board: string[];
  unusedLetters: string[];
  possibleWords: string[];
  isValid: boolean;
};

type WordChar = { letter: string; index: number };

const playWord = (gameState: GameState): GameState[] => {
  if (gameState.unusedLetters.length === 0) {
    return [gameState];
  }
  if (!gameState.isValid) {
    return [];
  }

  const playableLetters: WordChar[] = gameState.board
    .map((val, idx) => ({ letter: val, index: idx }))
    .filter((val) => val.letter !== "0");

  //TODO:after the flatmap, iterate through and check the validity
  const newGameStates: GameState[] = playableLetters
    .flatMap((l) => playAtLetter(l, gameState))
    .map((s) => ({
      ...s,
      isValid: checkValidity(gameState.possibleWords, s.board),
    }));

  // return newGameStates;
  return newGameStates.flatMap(playWord);
};

const playAtLetter = (
  playableLetter: WordChar,
  gameState: GameState,
): GameState[] => {
  const words: string[] = gameState.possibleWords.filter(
    (w) =>
      w.includes(playableLetter.letter) &&
      wordCanBeSpelled(
        [...(gameState.unusedLetters + playableLetter.letter)],
        w,
      ),
  );
  return words.flatMap((wordToPlay) =>
    placeWordAtLetter(wordToPlay, playableLetter, gameState),
  );
};
const placeWordAtLetter = (
  wordToPlay: string,
  playableLetter: WordChar,
  gameState: GameState,
): GameState[] => {
  const splits: WordChar[] = [...wordToPlay]
    .map((letter, index) => ({ letter, index }))
    .filter((l) => l.letter === playableLetter.letter);

  return splits.map((split) => {
    const newBoard = placeWord(
      gameState.board,
      getCoordinateFromIndex(playableLetter.index),
      wordToPlay,
      split,
    );
    const lettersRemaining = useLetters(gameState.unusedLetters, wordToPlay);
    lettersRemaining.push(playableLetter.letter);
    //TODO: I think we need to reduce the remaining playable words so that we dont get in an endless loop
    // const playableWords = selectRemainingPossibleWords(
    //   gameState.possibleWords,
    //   lettersRemaining,
    //   lettersOnBoard,
    // );
    //TODO: when we remove playable letters we should account for versions where we get an extra letter off the board (this needs to be addressed in general when deciding possible new words to spell too)
    return {
      ...gameState,
      // possibleWords: playableWords,
      board: newBoard,
      unusedLetters: lettersRemaining,
    };
  });
};

// returns a bunch of gameboards
const evaluateGameFromStartingWord = (
  startingWord: string,
  letters: string[],
  possibleWords: string[],
): GameState[] => {
  const board = initGameboard(startingWord);
  const unusedLetters = useLetters(letters, startingWord);
  const gameState: GameState = {
    board,
    unusedLetters,
    possibleWords,
    isValid: checkValidity(possibleWords, board),
  };
  return playWord(gameState);
};

const isStartOfVerticalWord = (gameboard: string[], idx: number): boolean => {
  const val = gameboard[idx];
  const coord = getCoordinateFromIndex(idx);
  if (val && val.length === 1 && val !== "0") {
    if (
      coord.y === 0 ||
      gameboard[getIndexFromCoordinate({ x: coord.x, y: coord.y - 1 })] === "0"
    ) {
      if (
        gameboard[getIndexFromCoordinate({ x: coord.x, y: coord.y + 1 })] &&
        gameboard[getIndexFromCoordinate({ x: coord.x, y: coord.y + 1 })] !==
          "0"
      ) {
        return true;
      }
    }
  }
  return false;
};

const verticalWordValid = (
  dictionary: string[],
  gameboard: string[],
  idx: number,
): boolean => {
  let keepReading = true;
  let travel = 0;
  let word = "";
  while (keepReading) {
    const nextLetter = gameboard[idx + travel * GRID_BASE];
    if (nextLetter && nextLetter !== "0") {
      travel++;
      word += nextLetter;
    } else keepReading = false;
  }
  return dictionary.findIndex((x) => x === word) >= 0;
};

const horizontalWordValid = (
  dictionary: string[],
  gameboard: string[],
  idx: number,
): boolean => {
  let keepReading = true;
  let travel = 0;
  let word = "";
  while (keepReading) {
    const nextLetter = gameboard[idx + travel];
    if (nextLetter && nextLetter !== "0") {
      travel++;
      word += nextLetter;
    } else keepReading = false;
  }
  return dictionary.findIndex((x) => x === word) >= 0;
};

const isStartOfHorizontalWord = (gameboard: string[], idx: number): boolean => {
  const val = gameboard[idx];
  const coord = getCoordinateFromIndex(idx);
  if (val && val.length === 1 && val !== "0") {
    if (
      coord.x % GRID_BASE === 0 ||
      gameboard[getIndexFromCoordinate({ x: coord.x - 1, y: coord.y })] === "0"
    ) {
      if (gameboard[getIndexFromCoordinate({ x: coord.x + 1, y: coord.y })]) {
        return true;
      }
    }
  }
  return false;
};

const checkValidity = (dictionary: string[], gameboard: string[]): boolean => {
  return gameboard.every((val, idx) => {
    if (val === "0") {
      return true;
    }
    if (!val || val.length !== 1) {
      return false;
    }
    if (
      isStartOfVerticalWord(gameboard, idx) &&
      !verticalWordValid(dictionary, gameboard, idx)
    ) {
      return false;
    }
    if (
      isStartOfHorizontalWord(gameboard, idx) &&
      !horizontalWordValid(dictionary, gameboard, idx)
    ) {
      return false;
    }
    return true;
  });
};

const solve = (possibleWords: string[], letters: string[]): GameState[] => {
  return possibleWords
    .flatMap((word) =>
      evaluateGameFromStartingWord(word, letters, possibleWords),
    )
    .filter((result) => result.unusedLetters.length === 0);
  // return possibleWords.flatMap((word) =>
  //   evaluateGameFromStartingWord(word, letters, possibleWords),
  // );
};

const main = (): void => {
  console.log("rolling the dice...");
  // const letters = rollDice();
  const letters: string[] = [..."ABANDONWRST"];
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
  console.log(
    "Solution",
    result.map((r) => r.board),
  );

  return;
};

main();

// tests
// passes wtih at least one solution when the 12 letters spell a 12 letter word
// passes when the letters spell ABANDON with WORST running through it
// etc
