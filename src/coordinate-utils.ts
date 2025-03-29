const GRID_BASE = 24;
const GRID_BASE_SQUARED = GRID_BASE * GRID_BASE;
export const INITIAL_COORDINATE = {
  x: Math.floor(GRID_BASE / 2),
  y: Math.floor(GRID_BASE / 2),
};
export type Coordinate = { x: number; y: number };
export const makeGrid = (): string[] => new Array(GRID_BASE_SQUARED).fill("0");
export const getIndexFromCoordinate = ({ x, y }: Coordinate): number => {
  return GRID_BASE * y + x;
};
export const getCoordinateFromIndex = (idx: number): Coordinate => {
  return { x: idx % GRID_BASE, y: Math.floor(idx / GRID_BASE) };
};
export const getIndexBelow = (idx: number): number | null => {
  if ((idx + 1) / GRID_BASE > GRID_BASE - 1) {
    return null;
  }
  return idx + GRID_BASE;
};
export const getIndexRight = (idx: number): number | null => {
  if ((idx + 1) % GRID_BASE === 0) {
    return null;
  }
  return idx + 1;
};

export const printGrid = (array: string[]): void => {
  // Validate input
  if (!Array.isArray(array) || array.length !== GRID_BASE_SQUARED) {
    console.error(`Input must be a ${GRID_BASE_SQUARED}-element array`);
    return;
  }
  // Print the grid
  for (let row = 0; row < GRID_BASE; row++) {
    let rowString = "";
    for (let col = 0; col < GRID_BASE; col++) {
      const index = row * GRID_BASE + col;
      rowString += array[index] + " ";
    }
    console.log(rowString.trim());
  }
  console.log("------------");
};
