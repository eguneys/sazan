import ChessJS from 'chess.js';

import * as util from './util';

export default function Chess() {

  const movementVector = (piece) => {
    function diffSquare(from, d) {
      const iFile = util.files.indexOf(util.fileOf(from)),
            iRank = util.ranks.indexOf(util.rankOf(from));

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

    const pawnAttacks = (from, color) => {
      const direction = color === 'w'?1:-1;
      return [[1, direction],
              [-1, direction]];
    };

    const pawnMoves = (from, color) => {
      const direction = color === 'w'?1:-1;
      const rank = util.rankOf(from);
      const atBase = direction===-1?rank==='7':rank==='2';
      var res = [[0, direction]];
      if (atBase) {
        res.push([0, direction * 2]);
      }

      return res;
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

    const attackVector = (from, color) => {
      if (piece.type === 'p') {
        return pawnAttacks(from, color);
      } else {
        return attackVectors[piece.type];
      }
    };

    const color = piece.color;

    const moveVector = (from, color) => {
      if (piece.type === 'p') {
        return pawnMoves(from, color);
      } else {
        return moveVectors[piece.type];
      }
    };

    const captureVector = (from, color) => {
      if (piece.type === 'p') {
        return pawnAttacks(from, color);
      }
      return [];
    };

    const chess = this;
    return {
      attack(from) {
        return attackVector(from, color)
          .map(_ => diffSquare(from, _))
          .filter(_ => !!_);
      },
      move(from) {
        return moveVector(from, color)
          .map(_ => diffSquare(from, _))
          .filter(_ => !!_);
      },
      capture(from) {
        return captureVector(from, color)
          .map(_ => diffSquare(from, _))
          .filter(_ => {
            let captured = chess.get(_);
            return !!_ && captured && captured.color !== piece.color;
          });
      }
    };
  };
  
  var chess = new ChessJS();

  this.clear = () => {
    return chess.clear();
  };

  this.load = (fen) => {
    return chess.load(fen);
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

  this.captures = (from) => {
    const piece = this.get(from);
    return movementVector(piece).capture(from);
  };

  this.movements = (from) => {
    const piece = this.get(from);

    return movementVector(piece).move(from);
  };

  this.attacks = (from) => {
    const piece = this.get(from);

    return movementVector(piece).attack(from);
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

  this.move = (m) => {
    return chess.move(m);
  };
}
