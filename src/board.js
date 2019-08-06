import Chess from './chess';

import * as util from './util';
import { Direction } from './util';

import Move from './move';

import ChessFactory from './chess';

export default function Board(fen) {

  const chess = ChessFactory(fen);

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

  this.put = (piece, square) => {
    return this.cloneOp(_ => _.put(piece, square));
  };

  this.remove = (square) => {
    return this.cloneOp(_ => _.remove(square));
  };

  this.apply = (move) => {
    return this.cloneOp(_ => _.move(move));
  };

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
    return util.squares.filter(square => {
      const piece = this.get(square);

      return piece && piece.color === color &&
        piece.type === type;        
    });
  };

  this.king = (color) => {
    return this.piece(color, 'k');
  };

  this.pieces = (color) => {
    return {
      king: this.king(color),
      queens: this.piece(color, 'q'),
      rooks: this.piece(color, 'r'),
      bishops: this.piece(color, 'b'),
      knights: this.piece(color, 'n'),
      pawns: this.piece(color, 'p')
    };
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

  this.trapSquares = (square) => {
    const movements = this.movements(square);
    const res = [];
    for (var key in movements) {
      if (!movements[key].blocking) {
        res.push(key);
      }
    }
    return res;    
  };

  const kingSafety = (square, movements) => {
    const piece = this.get(square);

    let from = square;

    for (let to in movements) {
      let movement = movements[to];

      // const board2 = this.remove(from),
      //       board = board2.put(piece, to);

      // const kingPos = board.king(piece.color);

      let kingPos = this.king(piece.color);
      if (piece.type === 'k') {
        kingPos = to;
      }


      const attackers = this.attackersWith((square, oAttack) => {
        const attacker = this.get(square);
        return attacker.color !== piece.color &&
          !oAttack.blocking;
      }, kingPos);

      if (Object.entries(attackers).length !== 0) {
        movement.danger = Object.keys(attackers);
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
      [movement]: Movement(this.movementblocks(square, movement),
                         this.interposes(square, movement))
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
      [attack]: Movement(this.rayblocks(square, attack),
                         this.interposes(square, attack))
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

  this.movers = (square, direction = Direction.all) => {
    const movers = chess.movers(square);

    return movers
      .filter(move => 
        (direction === Direction.all ||
         util.classifyDirection([square, move]) === direction)
      )
      .reduce((acc , move) => ({
        ...acc,
        [move]: Movement(this.rayblocks(move, square))
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


  // TODO use weights for interpose value
  this.interposes = (from, to) => {
    const res = {};
    for (let square of util.raycast(from, to)) {
      const bes = [];
      const blockers = this.movers(square);
      for (let key in blockers) {
        if (key === from) continue;
        const blocker = blockers[key];
        if (!blocker.blocking) {
          bes.push(key);
        }
      }
      if (bes.length > 0) {
        res[square] = bes;
      }
    }
    return res;
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

  this.canBlock = (from, to, color) => {

    for (let square of util.raycast(from, to)) {

      const attackers = this.attackersWithColor(square, color);

      if (Object.keys(attackers).length > 0 && !attackers[from]) {
        return true;
      }
    }
    return false;
  };

  this.isMate = () => {
    return chess.inCheckmate();
  };

  this.isCheck = () => {
    return chess.inCheck();
  };

  this.ascii = () => chess.ascii();

  this.clone = () => {
    return new Board(this.fen());
  };

  this.cloneOp = (op) => {
    return new Board(chess.fenAfter(op));
  };
}

function Movement(blocking, interpose) {
  var res = {};
  if (blocking && blocking.length > 0) {
    res.blocking = blocking;
  }
  if (interpose && Object.keys(interpose).length > 0) {
    res.interpose = interpose;
  }
  return res;
}
