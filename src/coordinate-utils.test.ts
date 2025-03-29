import { describe, expect, test } from "@jest/globals";
import {
  getIndexFromCoordinate,
  getCoordinateFromIndex,
  getIndexBelow,
  getIndexRight,
} from "./coordinate-utils";

describe("getIndexFromCoordinate", () => {
  test("it gets the corresponding index", () => {
    expect(getIndexFromCoordinate({ x: 0, y: 0 })).toBe(0);
    expect(getIndexFromCoordinate({ x: 12, y: 12 })).toBe(300);
    expect(getIndexFromCoordinate({ x: 23, y: 23 })).toBe(575);
  });
});

describe("getCoordinateFromIndex", () => {
  test("it gets the corresponding coordinate", () => {
    expect(getCoordinateFromIndex(0)).toStrictEqual({ x: 0, y: 0 });
    expect(getCoordinateFromIndex(300)).toStrictEqual({ x: 12, y: 12 });
    expect(getCoordinateFromIndex(575)).toStrictEqual({ x: 23, y: 23 });
  });
});

describe("getIndexRight", () => {
  test("while the next index is within bounds it gets it", () => {
    expect(getIndexRight(3)).toBe(4);
    expect(getIndexRight(15)).toBe(16);
  });
  test("when at the right boundary, it returns null", () => {
    expect(getIndexRight(23)).toBe(null);
    expect(getIndexRight(47)).toBe(null);
    expect(getIndexRight(71)).toBe(null);
    expect(getIndexRight(551)).toBe(null);
    expect(getIndexRight(575)).toBe(null);
  });
});

describe("getIndexDown", () => {
  test("while the next index is within bounds it gets it", () => {
    expect(getIndexBelow(0)).toBe(24);
    expect(getIndexBelow(23)).toBe(47);
    expect(getIndexBelow(551)).toBe(575);
  });
  test("when at the lower boundary of the grid, it returns null", () => {
    expect(getIndexBelow(552)).toBe(null);
    expect(getIndexBelow(560)).toBe(null);
    expect(getIndexBelow(575)).toBe(null);
  });
});
