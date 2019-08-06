import ChessJS from 'chess.js';

import * as util from './util';
import { memoize } from './util2';

import { movementVector } from './chess/util';

export function Chess(fen) {
  
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

  this.move = (move) => {
    return chess.move(move);
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
