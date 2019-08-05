import * as util from './util';
import play from './play';

import { memoize, memoize2 } from './util2';

import { scale, sum, mul, WeightedSum, Weights, Compose, Weight } from './weight';

const max_depth = 1;

function logMove(move, msg, actual) {
  if (move === actual.uci) {
    console.log(move + ' ' + msg);
  }
}

function hack() {
  return move => {
    if (move.uci === 'Qf7+' || move.uci === 'Qxf8+') {
      return 1;
    }
    return 0;
  };
}

export function WeightMove(move, depth) {
  const after = move.after,
        before = move.before,
        afterEval = move.afterEval,
        beforeEval = move.beforeEval,
        usKing = after.king(before.turn()),
        themKing = after.king(after.turn()),
        us = move.before.turn(),
        them = move.after.turn();

  const withColor = (board, color) => {
    return _ => board.get(_).color === color;
  };

  const weightAttackReduce = (boardEval, square, depth = 0) => (acc, _) =>
        ({ ...acc, [_]: weightAttack(boardEval, square, _, depth) });

  const weightSquareAttacks = (square, color, depth, isBefore = false) => {
    const board = isBefore?before:after;
    const boardEval = isBefore?beforeEval:afterEval;

    const sq = boardEval.square(square);

    return sq.attackers
      .filter(withColor(board, color))
      .reduce(weightAttackReduce(boardEval, square, depth), {});
  };

  const  weightOutpost = (square, depth) => {
    if (depth >= 1) {
      return Weight(1);
    }

    depth++;

    const sq = afterEval.square(square);

    const attackers = weightSquareAttacks(square, them, depth);
    const defenders = weightSquareAttacks(square, us, depth);

    let wDefense = Weights(defenders);
    let wOffense = Weights(attackers);

    let wOutpost = Compose(wDefense, wOffense,
                           (a, b) => (mul(a, 0.5) - mul(b, 0.5)) + 0.5);


    return WeightedSum({
      outpost: [wOutpost, 0.2]
    });
  };


  const weightAttack = (boardEval, attacked, attacker, depth = 0) => {
    console.log(attacked, attacker);
    const attack = boardEval.square(attacker).attacks[attacked];

    const interpose = attack.interpose?Object.keys(attack.interpose).length/8:0;

    const weights = WeightedSum({
      danger: [Weight(attack.danger?0:1), 0.1],
      blocking: [Weight(attack.blocking?1/(attack.blocking.length+1):1), 0.1],
      outpost: [weightOutpost(attacker, depth), 0.5],
      interpose: [Weight(interpose), 0.3]
    });

    return weights;
  };

  function weightTrapKing() {
    const kingMobility = after.trapSquares(usKing);

    return controlSquares(kingMobility, usKing);
  };

  function weightMate() {
    return Weight(after.isMate()?1:0);
  }

  function controlSquares(squares, trap) {
    if (trap) squares = [...squares, trap];

    let res = squares.reduce((acc, _) => ({
      ...acc,
      [_]: controlASquare(_, trap)
    }), {});

    
    return Weights(res);
  }

  function controlASquare(square, trap) {
    const sq = afterEval.square(square);

    let control = Weights(weightSquareAttacks(square, us));

    let deflect = deflectTheSquare(square);

    return WeightedSum({
      control: [control, 0.55],
      deflect: [deflect, 0.45]
    });
  }

  function deflectTheSquare(square) {

    const sq = afterEval.square(square);

    let defenders = sq.attackers
        .filter(withColor(after, us))
        .map(_ => WeightedSum({
          attack: [attackSquare(_), 0.35],
          capture: [captureSquare(_), 0.65]
        }));

    return Weights(defenders);
  }

  function attackSquare(square) {

    const sqBefore = beforeEval.square(square),
          sqAfter = afterEval.square(square);

    const attackersBefore = 
          weightSquareAttacks(square, us, 0, true),
          attackersAfter = weightSquareAttacks(square, us);

    const wBefore = Weights(attackersBefore),
          wAfter = Weights(attackersAfter);

    return Compose(wAfter, wBefore, (a, b) => mul(a, 0.5) - mul(b, 0.5) + 0.5);
  }

  function captureSquare(square) {
    const pBefore = before.get(square),
          pAfter = after.get(square);

    if (pBefore && pAfter && pBefore.type != pAfter.type) {
      return Weight(1);
    } else {
      return Weight(0);
    }
  }

  return WeightedSum({
    mate: [weightMate(), 0.4],
    trapKing: [weightTrapKing(), 0.4]
  });
}
