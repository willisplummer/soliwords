import { describe, expect, test } from "@jest/globals";
import { solve, useLetters } from "./solve";
import { printGrid } from "./coordinate-utils";

describe("solve", () => {
  test("It should place the word (only one word)", () => {
    const result = solve(["TESTING"], [..."TESTING"]);
    // prettier-ignore
    const expected = [
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "T", "E", "S", "T", "I", "N", "G", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"
    ]
    expect(result.length).toBe(1);
    expect(result[0].board).toStrictEqual(expected);
  });

  test("It should return all possible valid game boards (only one word)", () => {
    const result = solve(["RIFE", "FIRE"], [..."RIFE"]);
    // prettier-ignore
    const expected1 = [
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "R", "I", "F", "E", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"
    ]
    // prettier-ignore
    const expected2 = [
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "F", "I", "R", "E", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0",
      "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0", "0"
    ]
    expect(result.length).toBe(2);
    expect(result[0].board).toStrictEqual(expected1);
    expect(result[1].board).toStrictEqual(expected2);
  });

  test("It should return all possible valid game boards (two words)", () => {
    const result = solve(["RIFLE", "FIRE"], [..."RIFLEIRE"]);
    expect(result.length).toBe(2);
  });

  // TODO: this was a result I got from running the program but here I can't reproduce it
  test("It should not place letters on top of each other", () => {
    const result = solve(["LYCH", "MARVY", "BOTHY"], [..."HLCMYOHVATRB"]);
    expect(result.length).toBe(0);
  });
});

describe("useLetters", () => {
  test("it should work for the first word", () => {
    const result = useLetters([..."BAT"], "BAT", []);
    expect(result).toStrictEqual([]);
  });
  test("it should work for the first word", () => {
    const result = useLetters([..."BATTON"], "BAT", []);
    expect(result).toStrictEqual([..."TON"]);
  });
  test("it should work when playing off a letter", () => {
    const result = useLetters([..."BATTON"], "BAT", ["B"]);
    expect(result).toStrictEqual([..."BTON"]);
  });
  test("it should work when playing off a letter", () => {
    const result = useLetters([..."IFLE"], "RIFLE", ["R"]);
    expect(result).toStrictEqual([]);
  });
});
