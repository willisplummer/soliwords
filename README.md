# Crossword Solitaire Solver

A program that will find all valid crossword solitaire solutions given a set of letters.

### Rules of the Game
- Use ALL 12 letters to make words that connect
- Words must have at least 3 letters
- No proper nouns and/or names (we'll be using the 2023 NASPA Word List)

## Getting Started
### Install Deps
`npm install`
### To Run
`npm start`
### To Test
`npm test`

## TO-DO:
### MVP
- [ ] Need to improve the logic for using multiple letters from the grid in a single answer (like using B_D from the board to spell BED by adding the E)
### Enhancements
- [x] I'm getting stack overflows when I let it solve with 3 letter words. Seems like TypeScript doesn't support tail-call optimization ([link](https://stackoverflow.com/questions/71909776/how-can-i-get-typescript-to-perform-tail-recursion-optimization)) so I may need to rewrite with a while loop or add in my own little optimizer function
- [ ] I'd like for it to tell you the definition of each word used in the solution (as a sanity check and also so I don't have to google them constantly)
- [ ] Would be cool to eliminate duplicate solutions (e.g. same answer but just rotated, If you can solve with three words, do we really care how many permutations on how to connect them there are?)
- [ ] make it faster
