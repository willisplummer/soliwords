# Crossword Solitaire Solver

A program that will find all valid crossword solitaire solutions given a set of letters.

### Getting Started
### Install Deps
`npm install`
### To Run
`npm start`
### To Test
`npm test`

### Rules
- Use ALL 12 letters to make words that connect
- Words must have at least ~~3~~ 4 letters
- No proper nouns and/or names (we'll be using the 2023 NASPA Word List)

### TODO:
- [x] I think sometimes answers are going off the grid (fix might just be to use a larger grid)
- [ ] Fix all the broken tests after resizing board from 12x12 to 24x24
- [ ] I'd like for it to tell you the definition of each word used in the solution (as a sanity check and also so I don't have to google them constantly)
- [ ] I'm getting anomalous non-words
  - multiple words overwriting each other
  - also getting invalid results where words are placed right next to each other so that their horizontal combinations are non-words.
  - Interestingly, when I write tests for these cases, the program correctly identifies them as invalid.
  -  Suggests that the logic for excluding invalid solutions is going astray somewhere in the solve function.
- [ ] I'm getting stack overflows when I let it solve with 3 letter words. Seems like TypeScript doesn't support tail-call optimization ([link](https://stackoverflow.com/questions/71909776/how-can-i-get-typescript-to-perform-tail-recursion-optimization)) so I may need to rewrite with a while loop or add in my own little optimizer function
-  [ ] Need to improve the logic for using multiple letters from the grid in a single answer (like using B_D from the board to spell BED by adding the E)
- [ ] Would be cool to eliminate duplicate solutions (e.g. same answer but just rotated)
