import Chess from './chess';

import * as util from './util';
import { Vision } from './util';

import Move from './move';

export default function Board(fen) {

  const chess = new Chess();

  if (!fen) {
    chess.clear();
  } else {
    const valid = chess.load(fen);
    if (!valid) {
      throw new Error("bad fen string " + fen);
    }
  }

  this.chess = () => chess;
  this.fen = () => chess.fen();

  this.turn = () => {
    let fen = this.fen().split(' ');
    return fen[1];
  };

  this.opponent = () => {
    return this.turn() === 'w'? 'b': 'w';
  };

  this.get = (square) => chess.get(square);

  this.put = (piece, square) => chess.put(piece, square);

  this.side = (square) => {
    return this.get(square).color;
  };

  this.changeTurn = () => {
    var fen2 = fen.split(' ');

    fen2[1] = fen2[1]==='w'?'b':'w';
    fen2 = fen2.reduce((acc, _) => acc+' '+_);
    return new Board(fen2);
  };

  this.piece = (color, type) => {
    return util.squares.find(square => {
      const piece = this.get(square);

      return piece && piece.color === color &&
        piece.type === type;        
    });
  };

  this.king = (us = true) => {
    let color = us ? this.turn() : this.opponent();
    return this.piece(color, 'k');
  };

  this.moves = (square) => {
    var other = {};
    const res = chess.moves({ square, verbose: true });
    return res.map(_ => _.to);
  };

  this.legals = (filter) => {
    return chess.moves()
      .map(_ => new Move(_, this))
      .filter(_ => filter ? filter(_.after):true);
  };

  /*
    @opts:
    {
    direction: kingMobilityDirection
    }
   */
  this.attackers = (square, direction) => {
    const attackers = chess.attackers(square);

    return attackers.reduce((acc , attack) => ({
      ...acc,
      [attack]: {
        blocking: this.blocks(attack, square)
      }
    }), {});
  };

  this.blocks = (attack, defense) => {
    const res = [];
    for (let square of util.raycast(attack, defense)) {
      let piece = this.get(square);
      if (piece) {
        res.push(square);
      }
    }
    return res;
  };

  this.isMate = () => {
    return chess.inCheckmate();
  };

  this.ascii = () => chess.ascii();

  this.clone = () => new Board(this.fen());

  this.apply = (move) => {
    var board = this.clone();
    board.chess().move(move);
    return board;
  };
}
