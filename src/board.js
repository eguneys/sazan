import Chess from './chess';

import * as util from './util';
import { Direction } from './util';

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

  this.remove = (square) => chess.remove(square);

  this.color = (square) => {
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

  this.king = (color) => {
    return this.piece(color, 'k');
  };

  this.moves = (square) => {
    var other = {};
    const res = chess.moves({ square, verbose: true });
    return res.map(_ => _.to);
  };

  this.legals = () => {
    return chess.moves({ verbose: true })
      .map(_ => new Move(_, this));
  };

  const withAttackers = (filter) => {
    return (square, usColor = this.turn()) => {
      const us = this.attackersWithCapture(square, usColor),
            them = this.attackersWithCapture
      (square,
       util.opposite(usColor));

      return filter(us, them);
    };
  };

  this.hanging = withAttackers((us, them) => 
    Object.keys(us).length < Object.keys(them).length
  );

  this.controlSquare = withAttackers((us, them) =>
    Object.keys(us).length > Object.keys(them).length &&
      Object.keys(us).length > 0
  );

  this.weak = withAttackers((us, them) =>
    Object.keys(us).length === Object.keys(them).length
  );

  this.mobility = (square) => {
    const movements = this.movements(square);
    const res = [];
    for (var key in movements) {
      if (!movements[key].danger && !movements[key].blocking) {
        res.push(key);
      }
    }
    return res;
  };


  this.movements = (square) => {
    const piece = this.get(square);
    if (!piece) {
      return {};
    }

    let movements = chess.movements(square);

    movements = movements.reduce((acc, movement) => ({
      ...acc,
      [movement]: Movement(this.movementblocks(square, movement))
    }), {});

    if (piece.type === 'p') {
      let captures = chess.captures(square);

      captures = captures.reduce((acc, capture) => ({
        [capture]: Movement()
      }), {});

      movements = {...movements, ...captures};
    }

    let from = square;

    for (let to in movements) {
      let board = this.clone();
      let movement = movements[to];

      board.remove(from);
      board.put(piece, to);

      const kingPos = board.king(piece.color);

      const attackers = board.attackersWith((square, oAttack) => {
        const attacker = board.get(square);
        return attacker.color !== piece.color &&
          !oAttack.blocking;
      }, kingPos);

      if (Object.entries(attackers).length !== 0) {
        movement.danger = true;
      }
    }

    return movements;
  };

  this.attackersWith = (filter, square, direction) => {
    const attackers = this.attackers(square, direction);
    const res = {};
    for (let key in attackers) {
      let attacker = attackers[key];
      if (filter(key, attacker)) {
        res[key] = attacker;
      }
    }
    return res;
  };

  this.attackersWithColor = (color, square, direction) => {
    return this.attackersWith(key => this.get(key).color === color,
                       square, direction);
  };


  this.attackersWithCapture = (square, color) => {
    return this.attackersWith((key, o) =>
      !o.blocking && (!color || this.get(key).color === color)
      , square);
  };


  this.attackers = (square, direction = Direction.all) => {
    const attackers = chess.attackers(square);

    return attackers
      .filter(attack => 
        (direction === Direction.all ||
         util.classifyDirection([square, attack]) === direction)
      )
      .reduce((acc , attack) => ({
        ...acc,
        [attack]: Movement(this.rayblocks(attack, square))
      }), {});
  };

  this.movementblocks = (from, to) => {
    const fromPiece = this.get(from),
          isPawn = fromPiece.type === 'p';

    const rayBlocks = this.rayblocks(from, to);

    const toPiece = this.get(to),
          isEmpty = !toPiece,
          canTake = !isEmpty &&
          !isPawn &&
      toPiece.color !== fromPiece.color;

    if (!isEmpty && !canTake) {
      rayBlocks.push(to);
    }
    return rayBlocks;    
  };

  this.rayblocks = (from, to) => {
    const res = [];
    for (let square of util.raycast(from, to)) {
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

  this.isCheck = () => {
    return chess.inCheck();
  };

  this.ascii = () => chess.ascii();

  this.clone = () => new Board(this.fen());

  this.apply = (move) => {
    var board = this.clone();
    board.chess().move(move);
    return board;
  };
}

function Movement(blocking) {
  var res = {};
  if (blocking && blocking.length > 0) {
    res.blocking = blocking;
  }
  return res;
}
