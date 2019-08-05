import ChessJS from 'chess.js';

import * as util from './util';

import { memoize, memoize2 } from './util2';

export function Chess(fen) {

  function diffSquare(from, d) {
    const iFile = util.fileIndexes[util.fileOf(from)],
          iRank = util.rankIndexes[util.rankOf(from)];

    const iFile2 = iFile + d[0],
          iRank2 = iRank + d[1];

    if (iFile2 < 0 || iFile2 > 7 ||
        iRank2 < 0 || iRank2 > 7)
      return null;

    const file = util.files[iFile2];
    const rank = util.ranks[iRank2];

    return util.square(file, rank);
  }

  const files = [[1, 0],
                 [2, 0],
                 [3, 0],
                 [4, 0],
                 [5, 0],
                 [6, 0],
                 [7, 0],
                 [-1, 0],
                 [-2, 0],
                 [-3, 0],
                 [-4, 0],
                 [-5, 0],
                 [-6, 0],
                 [-7, 0]];

  const ranks = [[0, 1],
                 [0, 2],
                 [0, 3],
                 [0, 4],
                 [0, 5],
                 [0, 6],
                 [0, 7],
                 [0, -1],
                 [0, -2],
                 [0, -3],
                 [0, -4],
                 [0, -5],
                 [0, -6],
                 [0, -7]];

  const diagonals = [
    [1,1],
    [2,2],
    [3,3],
    [4,4],
    [5,5],
    [6,6],
    [7,7],
    [-1,1],
    [-2,2],
    [-3,3],
    [-4,4],
    [-5,5],
    [-6,6],
    [-7,7],
    [1,-1],
    [2,-2],
    [3,-3],
    [4,-4],
    [5,-5],
    [6,-6],
    [7,-7],
    [-1,-1],
    [-2,-2],
    [-3,-3],
    [-4,-4],
    [-5,-5],
    [-6,-6],
    [-7,-7],
  ];

  const knights = [
    [1,2],
    [1,-2],
    [2,1],
    [2,-1],
    [-1,2],
    [-1,-2],
    [-2, 1],
    [-2, -1]
  ];

  const kings = [
    [1,0],
    [1,1],
    [1,-1],
    [0,1],
    [0,-1],
    [-1, 0],
    [-1, 1],
    [-1, -1]
  ];

  const pawnAttacksWhite = [
    [[1, 1],
     [-1,1]]
  ];

  const pawnAttacksBlack = [
    [[1,-1],
     [-1,-1]]
  ];

  const pawnMovesWhiteBase = [
    [[0, 1],
     [0,2]]
  ];

  const pawnMovesWhite = [
    [[0, 1]]
  ];

  const pawnMovesBlackBase = [
    [[0,-1],
     [0, -2]]
  ];

  const pawnMovesBlack = [
    [[0, -1]]
  ];

  const pawnAttackVectors = {
    'w': [...pawnAttacksWhite],
    'b': [...pawnAttacksBlack]
  };

  const pawnMoveVectors = {
    'wb': [...pawnMovesWhiteBase],
    'w': [...pawnMovesWhite],
    'bb': [...pawnMovesBlackBase],
    'b': [...pawnMovesBlack],
  };

  const attackVectors = {
    'r': [...files, ...ranks],
    'q': [...files, ...ranks, ...diagonals],
    'b': [...diagonals],
    'n': [...knights],
    'k': [...kings]
  };

  const moveVectors = {
    'r': [...files, ...ranks],
    'q': [...files, ...ranks, ...diagonals],
    'b': [...diagonals],
    'n': [...knights],
    'k': [...kings]
  };

  const moveVector = (from, type, color) => {
    if (type === 'p') {
      const rank = util.rankOf(from);
      const base = (color==='w'&& rank==='7') || (color==='b' && rank==='2')?'b':'';
      const i = color + base;
      return pawnMoveVectors[i];
    } else {
      return moveVectors[type];
    }
  };

  const attackVector = (type, color) => {
    if (type === 'p') {
      
      return pawnAttackVectors[color];
    } else {
      return attackVectors[type];
    }
  };

  const captureVector = (type, color) => {
    if (type === 'p') {
      return pawnAttackVectors[color];
    }
    return [];
  };




  const movementVector = (() => {
    const attack = memoize2((from, type, color) => {
      return attackVector(type, color)
        .map(_ => diffSquare(from, _))
        .filter(_ => !!_);
    });

    const move = memoize2((from, type, color) => {
      return moveVector(from, type, color)
        .map(_ => diffSquare(from, _))
        .filter(_ => !!_);
    });

    const capture = memoize2((from, type, color, capturedColor) => {
      return captureVector(type, color)
        .map(_ => diffSquare(from, _))
        .filter(_ => {
          return !!_ && capturedColor && capturedColor !== color;
        });
    });

    return {
      attack,
      move,
      capture
    };
  })();
  
  var chess = new ChessJS(fen);

  this.load = (fen) => {
    return chess.load(fen);
  };

  this.clear = () => {
    return chess.clear();
  };

  this.fen = () => {
    return chess.fen();
  };

  this.get = (square) => {
    return chess.get(square);
  };

  this.put = (piece, square) => {
    return chess.put(piece, square);
  };

  this.remove = (piece) => {
    return chess.remove(piece);
  };

  this.moves = (opts) => {
    return chess.moves(opts);
  };

  this.pieces = () => {
    return util.squares.filter(square =>
      !!this.get(square)
    );
  };

  // TODO fix this
  this.captures = (from) => {
    const piece = chess.get(from),
          type = piece.type,
          color = piece.color;

    return movementVector.capture(from, type, color);
  };

  this.movements = (from) => {
    const piece = chess.get(from),
          type = piece.type,
          color = piece.color;


    return movementVector.move(from, type, color);
  };

  this.attacks = (from) => {
    const piece = chess.get(from),
          type = piece.type,
          color = piece.color;

    return movementVector.attack(from, type, color);
  };

  this.attacking = (from, to) => {
    return this.attacks(from).indexOf(to) !== -1;
  };

  this.attackers = (square) => {
    return this.pieces().filter(_ => this.attacking(_, square));
  };

  this.inCheckmate = () => {
    return chess.in_checkmate();
  };

  this.inCheck = () => {
    return chess.in_check();
  };

  this.ascii = () => {
    return chess.ascii();
  };

  this.fenAfter = op => {
    const tmp = new ChessJS(this.fen());
    op(tmp);
    return tmp.fen();
  };
}

const ChessFactory = memoize((fen) => {
  let chess = new Chess();
  
  if (!fen) {
    chess.clear();
  } else {
    const valid = chess.load(fen);
    if (!valid) {
      throw new Error("bad fen string " + fen);
    }
  }
  return chess;
});

export default ChessFactory;
