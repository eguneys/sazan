import Board from './board';

export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const file = (file) => ranks.map(_ => file + _);
export const rank = (rank) => files.map(_ => _ + rank);

export const squares = files.flatMap(_ => file(_));


// `
// rnbqkbnr
// pppppppp




// PPPPPPPP
// RNBQKBNR
// `
export function visualBoard(str) {
  const board = new Board();

  str.replace(/^\n+|\n+$/g, '').split('\n').forEach((line, row) => {
    row = 7 - row;
    line.split('').forEach((char, col) => {
      const file = files[col],
            rank = ranks[row];

      if (char !== ' ') {
        const color = (char === char.toUpperCase()) ? 'w':'b';
        board.put({ type: char.toLowerCase(), color }, file + rank);
      }
    });
  });


  return board;  
}


//         `
//     x   
//     x   
//     x   
//     x   
//     x   
// xxxxrxxx
//     x   
//     x   
// `
export function visualMarked(str) {
  const res = [];

  str.replace(/^\n+|\n+$/g, '').split('\n').forEach((line, row) => {
    row = 7 - row;
    line.split('').forEach((char, col) => {
      const file = files[col],
            rank = ranks[row];
      if (char === 'x') {
        res.push(file + rank);
      }
    });
  });

  return res;
}
