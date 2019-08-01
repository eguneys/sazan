import Board from './board';

export const Direction = {
  file: 'file',
  rank: 'rank',
  diagonal: 'diagonal',
  all: 'all'
};

export const colors = ['w', 'b'];
export const opposite = (color) => { return (color === 'w')?'b':'w'; };

export const files = ['a', 'b', 'c', 'd', 'e', 'f', 'g', 'h'];
export const ranks = ['1', '2', '3', '4', '5', '6', '7', '8'];

export const file = (file) => ranks.map(_ => square(file, _));
export const rank = (rank) => files.map(_ => square(_, rank));

export const square = (file, rank) => file + rank;

export const squares = files.flatMap(_ => file(_));

export const fileOf = (square) => {
  return square[0];
};

export const filesOf = (squares) => {
  return new Set(squares.map(fileOf));
};

export const rankOf = (square) => {
  return square[1];
};

export const ranksOf = (squares) => {
  return new Set(squares.map(rankOf));
};

export const sameFile = (from, to) => {
  return fileOf(from) === fileOf(to);
};

export const sameRank = (from, to) => {
  return rankOf(from) === rankOf(to);
};

export const sameDiagonal = (from, to) => {
  const fromRank = ranks.indexOf(rankOf(from)),
        toRank = ranks.indexOf(rankOf(to)),
        fromFile = files.indexOf(fileOf(from)),
        toFile = files.indexOf(fileOf(to));

  return Math.abs(fromRank - toRank) === Math.abs(fromFile - toFile);
};

export const classifyDirection = (squares) => {
  const first = squares[0];
  if (!first) {
    return Direction.all;
  }

  const isSameFile = squares.every(_ => sameFile(first, _));
  const isSameRank = squares.every(_ => sameRank(first, _));
  const isSameDiag = squares.every(_ => sameDiagonal(first, _));

  if (isSameFile) return Direction.file;
  if (isSameRank) return Direction.rank;
  if (isSameDiag) return Direction.diagonal;
  
  return Direction.all;  
};

export const raycast = (from, to) => {
  let res = [];
  if (sameFile(from, to)) {
    const file = fileOf(from);

    from = ranks.indexOf(rankOf(from));
    to = ranks.indexOf(rankOf(to));

    let d = (from < to) ? 1 : -1;

    for (let i = from + d; i !== to; i+=d) {
      res.push(square(file, ranks[i]));
    }
    
  } else if (sameRank(from, to)) {
    const rank = rankOf(from);

    from = files.indexOf(fileOf(from));
    to = files.indexOf(fileOf(to));

    let d = (from < to) ? 1 : -1;

    for (let i = from + d; i !== to; i+=d) {
      res.push(square(files[i], rank));
    }
  } else if (sameDiagonal(from, to)) {
    let fromRank = ranks.indexOf(rankOf(from)),
        toRank = ranks.indexOf(rankOf(to)),
        fromFile = files.indexOf(fileOf(from)),
        toFile = files.indexOf(fileOf(to));

    let dRank = (fromRank < toRank) ? 1 : -1;
    let dFile = (fromFile < toFile) ? 1 : -1;

    for (let i = fromFile + dFile, j = fromRank + dRank; i !== toFile; i+=dFile, j += dRank) {
      res.push(square(files[i], ranks[i]));
    }
  } 
  return res;
};


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

export function roundTo(x) {
  return Math.round(x * 100) / 100;
}
