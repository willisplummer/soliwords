import {
  getIndexFromCoordinate,
  getCoordinateFromIndex,
  getIndexBelow,
  getIndexRight,
} from "./coordinate-utils";

export const checkValidity = (
  dictionary: string[],
  gameboard: string[],
): boolean => {
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
  startingIdx: number,
): boolean => {
  let idx: number | null = startingIdx;
  let word = "";
  while (idx) {
    const letter = gameboard[idx];
    if (letter && letter !== "0") {
      word += letter;
      idx = getIndexBelow(idx);
    } else idx = null;
  }
  return dictionary.findIndex((x) => x === word) >= 0;
};

const horizontalWordValid = (
  dictionary: string[],
  gameboard: string[],
  startingIdx: number,
): boolean => {
  let idx: number | null = startingIdx;
  let word = "";
  while (idx) {
    const letter = gameboard[idx];
    if (letter && letter !== "0") {
      word += letter;
      idx = getIndexRight(idx);
    } else idx = null;
  }
  return dictionary.findIndex((x) => x === word) >= 0;
};

const isStartOfHorizontalWord = (gameboard: string[], idx: number): boolean => {
  const val = gameboard[idx];
  const coord = getCoordinateFromIndex(idx);
  if (val && val.length === 1 && val !== "0") {
    if (
      coord.x === 0 ||
      gameboard[getIndexFromCoordinate({ x: coord.x - 1, y: coord.y })] === "0"
    ) {
      if (
        gameboard[getIndexFromCoordinate({ x: coord.x + 1, y: coord.y })] !==
        "0"
      ) {
        return true;
      }
    }
  }
  return false;
};

export default checkValidity;
