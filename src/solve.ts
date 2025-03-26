import checkValidity from "./checkValidity";
import {
  getCoordinateFromIndex,
  getIndexFromCoordinate,
  makeGrid,
  Coordinate,
  INITIAL_COORDINATE,
} from "./coordinate-utils";
import { wordCanBeSpelled } from "./wordCanBeSpelled";

export const solve = (
  possibleWords: string[],
  letters: string[],
): GameState[] => {
  return possibleWords.flatMap((word) =>
    evaluateGameFromStartingWord(word, letters, possibleWords),
  );
};

const evaluateGameFromStartingWord = (
  startingWord: string,
  letters: string[],
  possibleWords: string[],
): GameState[] => {
  const board = initGameboard(startingWord);
  const unusedLetters = useLetters(letters, startingWord, []);
  const gameState: GameState = {
    board,
    unusedLetters,
    possibleWords,
    isValid: checkValidity(possibleWords, board),
  };
  return playWord(gameState);
};

// Top Left is the origin
export const useLetters = (
  letters: string[],
  word: string,
  lettersFromBoard: string[],
): string[] => {
  let boardLetters = [...lettersFromBoard];
  let updatedLetters = [...letters];
  word.split("").forEach((char) => {
    const boardIdx = boardLetters.findIndex((x) => x === char);
    const idx = updatedLetters.findIndex((x) => x === char);
    if (boardIdx > -1) {
      delete boardLetters[boardIdx];
    } else {
      delete updatedLetters[idx];
    }
  });
  return updatedLetters.filter((char) => !!char);
};

const placeFirstWord = (solution: string[], word: string) => {
  const initialCoord: Coordinate = {
    ...INITIAL_COORDINATE,
    x: INITIAL_COORDINATE.x - Math.floor(word.length / 2),
  };
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
  const afterLetters = [...word].slice(letterIndex + 1, word.length);
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

  const newGameStates: GameState[] = playableLetters
    .flatMap((l) => playAtLetter(l, gameState))
    .map((s) => ({
      ...s,
      isValid: checkValidity(gameState.possibleWords, s.board),
    }));

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
    const lettersRemaining = useLetters(gameState.unusedLetters, wordToPlay, [
      playableLetter.letter,
    ]);
    return {
      ...gameState,
      board: newBoard,
      unusedLetters: lettersRemaining,
    };
  });
};

export default solve;
