const GRID_BASE = 12;
export type Coordinate = { x: number; y: number };
export const getIndexFromCoordinate = ({ x, y }: Coordinate): number => {
  return GRID_BASE * y + x;
};
export const getCoordinateFromIndex = (idx: number): Coordinate => {
  return { x: idx % GRID_BASE, y: Math.floor(idx / GRID_BASE) };
};
export const getIndexBelow = (idx: number): number | null => {
  if ((idx + 1) / GRID_BASE > 11) {
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
  if (!Array.isArray(array) || array.length !== 144) {
    console.error("Input must be a 144-element array");
    return;
  }
  // Print the grid
  for (let row = 0; row < 12; row++) {
    let rowString = "";
    for (let col = 0; col < 12; col++) {
      const index = row * 12 + col;
      rowString += array[index] + " ";
    }
    console.log(rowString.trim());
  }
  console.log("------------");
};
