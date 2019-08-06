import { memoize, memoize2 } from './util2';

import { scale, sum, mul, WeightedSum, Weights, WeightsWithSized, Compose, Weight } from './weight';

import weightMate from './weights/mate';

export function logMove(move, msg, actual) {
  if (move === actual.uci) {
    console.log(move + ' ' + msg);
  }
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


  const init = () => {
    this.after = after;
    this.before = before;
    this.afterEval = afterEval;
    this.beforeEval = beforeEval;
    this.usKing = usKing;
    this.themKing = themKing;
    this.us = us;
    this.them = them;
  };

  const withColor = (board, color) => {
    return _ => board.get(_).color === color;
  };

  const weightAttackReduce = (square, depth, isBefore = false) => 
        (acc, _) =>
        ({ ...acc, [_]: weightAttack(square, _, depth, isBefore) });

  const weightSquareAttacks = memoize2((square, color, depth = 0, isBefore = false) => {
    const board = isBefore?before:after;
    const boardEval = isBefore?beforeEval:afterEval;

    const sq = boardEval.square(square);

    return sq.attackers
      .filter(withColor(board, color))
      .reduce(weightAttackReduce(square, depth, isBefore), {});
  });

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
      outpost: [wOutpost, 1]
    });
  };


  const weightAttack = memoize2((attacked, attacker, depth, isBefore) => {

    const board = isBefore?before:after;
    const boardEval = isBefore?beforeEval:afterEval;

    const attack = boardEval.square(attacker).attacks[attacked];

    const interposers = attack.interpose?Object.values(attack.interpose).reduce((acc, _) => acc + _.filter(withColor(board, them)).length, 0):0;
    const interpose = interposers?(interposers/8):0;

    // logMove('Qf7+', attacked + ' ' + attacker + ' ' + JSON.stringify(interposers), move);
    // logMove('Qf7+', attacked + ' ' + attacker + ' ' + JSON.stringify(interpose), move);

    const weights = WeightedSum({
      danger: [Weight(attack.danger?0:1), 0.0],
      blocking: [Weight(attack.blocking?1/(attack.blocking.length+1):1), 0.3],
      outpost: [weightOutpost(attacker, depth), 0.4],
      interpose: [Weight(1-interpose), 0.3]
    });

    return weights;
  });

  function weightTrapKing() {
    return Weight(0);
  };

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

    let control = WeightsWithSized(weightSquareAttacks(square, us), 10, 0.7);

    let deflect = deflectDefenders(square);

    return WeightedSum({
      control: [control, 0.55],
      deflect: [deflect, 0.45]
    });
  }

  function deflectDefenders(square) {
    const sq = afterEval.square(square);

    let defenders = sq.attackers
        .filter(withColor(after, them))
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

  this.get = () => {
    return WeightedSum({
      mate: [weightMate(this), 0.4],
      trapKing: [weightTrapKing(), 0.4]
    });
  };

  init();
}
