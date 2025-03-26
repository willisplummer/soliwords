import { describe, expect, test } from "@jest/globals";
import {
  getIndexFromCoordinate,
  getCoordinateFromIndex,
  getIndexBelow,
  getIndexRight,
} from "./coordinate-utils";

describe("getIndexFromCoordinate", () => {
  test("while the next index is within bounds it gets it", () => {
    expect(getIndexFromCoordinate({ x: 0, y: 0 })).toBe(0);
    expect(getIndexFromCoordinate({ x: 6, y: 6 })).toBe(78);
    expect(getIndexFromCoordinate({ x: 11, y: 11 })).toBe(143);
  });
});

describe("getCoordinateFromIndex", () => {
  test("while the next index is within bounds it gets it", () => {
    expect(getCoordinateFromIndex(0)).toStrictEqual({ x: 0, y: 0 });
    expect(getCoordinateFromIndex(78)).toStrictEqual({ x: 6, y: 6 });
    expect(getCoordinateFromIndex(143)).toStrictEqual({ x: 11, y: 11 });
  });
});

describe("getIndexRight", () => {
  test("while the next index is within bounds it gets it", () => {
    expect(getIndexRight(3)).toBe(4);
    expect(getIndexRight(15)).toBe(16);
  });
  test("when at the right boundary, it returns null", () => {
    expect(getIndexRight(11)).toBe(null);
    expect(getIndexRight(23)).toBe(null);
    expect(getIndexRight(35)).toBe(null);
    expect(getIndexRight(47)).toBe(null);
    expect(getIndexRight(143)).toBe(null);
  });
});

describe("getIndexDown", () => {
  test("while the next index is within bounds it gets it", () => {
    expect(getIndexBelow(0)).toBe(12);
    expect(getIndexBelow(15)).toBe(27);
    expect(getIndexBelow(131)).toBe(143);
  });
  test("when at the lower boundary of the grid, it returns null", () => {
    expect(getIndexBelow(132)).toBe(null);
    expect(getIndexBelow(140)).toBe(null);
    expect(getIndexBelow(143)).toBe(null);
  });
});
