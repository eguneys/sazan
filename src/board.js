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


  const kingSafety = (square, movements) => {
    const piece = this.get(square);

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

    kingSafety(square, movements);

    return movements;
  };

  this.attacks = (square) => {
    const piece = this.get(square);
    if (!piece) {
      return {};
    }

    let attacks = chess.attacks(square);

    attacks = attacks.reduce((acc, attack) => ({
      ...acc,
      [attack]: Movement(this.movementblocks(square, attack))
    }), {});

    kingSafety(square, attacks);
    return attacks;
  };

  this.outpost = (square) => {
    return util.squares
      .map(_ => {
        const movements = this.attacks(_);
        if (movements[square]) {
          return { [_]: movements[square] };
        }
        return null;
      })
      .filter(_ => !!_)
      .reduce((acc, _) => ({ ...acc, ..._ }), 0);
  };

  this.attacksWith = (filter, square) => {
    const attacks = this.attacks(square);
    const res = {};
    for (let key in attacks) {
      let attack = attacks[key];
      if (filter(key, attack)) {
        res[key] = attack;
      }
    }
    return res;
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

  this.attackersWithColor = (square, color, direction) => {
    return this.attackersWith(key => this.get(key).color === color,
                       square, direction);
  };

  this.attacksWithColor = (square, color, direction) => {
    return this.attacksWith(key => this.get(key).color === color,
                       square, direction);
  };

  this.attackersByColor = (map) => {
    return (square, usColor = this.turn()) => {
      const us = this.attackersWithColor(square, usColor),
            them = this.attackersWithColor
      (square,
       util.opposite(usColor));

      return map(us, them);
    };
  };

  this.attacksByColor = (map) => {
    return (square, usColor = this.turn()) => {
      const us = this.attacksWithColor(square, usColor),
            them = this.attacksWithColor
      (square,
       util.opposite(usColor));

      return map(us, them);
    };
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
