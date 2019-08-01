import ChessJS from 'chess.js';

import * as util from './util';

export default function Chess() {

  const attackVector = (piece) => {
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

    const pawns = [];

    const vectors = {
      'r': [...files, ...ranks],
      'q': [...files, ...ranks, ...diagonals],
      'b': [...diagonals],
      'n': [...knights],
      'k': [...kings],
      'p': [...pawns]
    };

    const vector = vectors[piece.type];

    return (from) => {
      return vector
        .map(_ => diffSquare(from, _))
        .filter(_ => !!_);
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

  this.moves = (opts) => {
    return chess.moves(opts);
  };

  this.pieces = () => {
    return util.squares.filter(square =>
      !!this.get(square)
    );
  };

  this.attacks = (from) => {
    const piece = this.get(from);

    return attackVector(piece)(from);
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

  this.ascii = () => {
    return chess.ascii();
  };

  this.move = (m) => {
    return chess.move(m);
  };
}
