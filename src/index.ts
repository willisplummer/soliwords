import fs from "fs";
import {
  getIndexFromCoordinate,
  getCoordinateFromIndex,
  Coordinate,
} from "./coordinate-utils";
import checkValidity from "./checkValidity";
import { wordCanBeSpelled } from "./wordCanBeSpelled";
import solve from "./solve";

const DICE = [
  "NNHHRR",
  "LLFRDW",
  "CCJBTD",
  "LLMMBY",
  "NNIIYO",
  "AEIOUU",
  "HHTTWP",
  "KFVGPP",
  "AAEEOO",
  "CCTTMS",
  "RRLDGG",
  "BZXSKN",
];
const DICTIONARY_PATH = "./NWL2023.txt";
const rollDice = (): string[] => {
  return DICE.reduce((acc: string[], die: string) => {
    acc.push(die.charAt(Math.floor(Math.random() * die.length)));
    return acc;
  }, []);
};

const loadDictionary = (): string[] => {
  try {
    const data = fs.readFileSync(DICTIONARY_PATH);
    const str = data.toString();
    const arr = str.split("\n");
    return arr.map((x) => x.split(" ")[0]).filter((x) => x !== "");
  } catch (error: any) {
    console.error(`Got an error trying to read the file: ${error.message}`);
  }
  return [];
};

const selectPossibleWords = (
  dictionary: string[],
  letters: string[],
): string[] =>
  dictionary.filter(
    (word) => word.length >= 3 && wordCanBeSpelled(letters, word),
  );

// returns a bunch of gameboards

const main = (): void => {
  console.log("rolling the dice...");
  const letters = rollDice();
  // const letters = [..."TARTARBR"];
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
