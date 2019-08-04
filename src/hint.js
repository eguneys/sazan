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

function filterObj(obj, filter) {
  const res = {};
  for (let key of Object.keys(obj)) {
    if (filter(key, obj[key])) {
      res[key] = obj[key];
    }
  }
  return res;
}

function mapObj(obj, map) {
  const res = {};
  for (let key of Object.keys(obj)) {
    res[key] = map(key, obj[key]);
  }
  return res;
}

function objLength(obj) {
  return Object.keys(obj).length;
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

  const  weightOutpost = memoize((square, outpost) => {
    const after = move.after;
    const us = move.before.turn();

    const defenders = filterObj(outpost, (key, _) =>
      after.get(key).color === us
    );
    const attackers = filterObj(outpost, (key, _) =>
      after.get(key).color === util.opposite(us)
    );

    // logMove('Qf8+', square + JSON.stringify(attackers), move);
    // logMove('Qf7+', square + JSON.stringify(attackers), move);

    let wDefense = Weights(mapObj(defenders, (key, defender) =>
      weightAttack(square, key, defender, null, true)));

    let wOffense = Weights(mapObj(attackers, (key, attacker) =>
      weightAttack(square, key, attacker, null, true)));

    const wDirectOffense = Weights(mapObj(attackers, (key, attack) =>
      attack.blocking?Weight(0):Weight(1)
    ));
    const wDirectDefense = Weights(mapObj(defenders, (key, defend) =>
      defend.blocking?Weight(0):Weight(1)
    ));

    // logMove('Qf8+', JSON.stringify(wDefense) + ' ' + square + ' ' + JSON.stringify(wOffense), move);
    // logMove('Qf7+', square + ' ' + JSON.stringify(wOffense.value()), move);

    let wOutpost = Compose(wDefense, wOffense,
                           (a, b) => (mul(a, 0.5) - mul(b, 0.5)) + 0.5);


    let wHanging = Compose(wDirectDefense, wDirectOffense,
                           (a, b) => (mul(a, 0.1) - mul(b, 0.9)) + 0.9);

    // logMove('Qf8+', wHanging + ' ' + square, move);
    // logMove('Qf7+', wHanging + ' '+ square, move);


    return WeightedSum({
      outpost: [wOutpost, 0.2],
      hanging: [wHanging, 0.8]
    });
  });


  const weightAttack = memoize2((attacked, attacker, attack, trap, noOutpost) => {
    function blockAttackFilter(move) {
      const before = move.before;
      const after = move.after;

      const defense = after.attacks(attacker)[attacked];

      return defense && defense.blocking && defense.blocking.length > 0;
    }

    const after = move.after;
    const them = after.turn();

    const canBlock = after.canBlock(attacker, attacked, them);

    // if (move.uci === 'Qf7+') {
    //   console.log(move.uci, attacker, attacked, attack, trap, noOutpost);

    //   if (!noOutpost) {
    //     console.log('her', weightOutpost(attacker, after.outpost(attacker)).value());
    //   }
    // }

    const weights = WeightedSum({
      danger: [Weight(attack.danger?0:1), 0.1],
      blocking: [Weight(attack.blocking?1/(attack.blocking.length+1):1), 0.1],
      outpost: [noOutpost?Weight(0):weightOutpost(attacker, after.outpost(attacker)), 0.5],
      noblock: [Weight(canBlock?0:1), 0.3]
    });

    // if (depth < max_depth && !attack.blocking) {
    //   const counter = {};// = play(move.after, blockAttackFilter, depth + 1);

    //   if (!counter.best && !attack.blocking && !attack.danger) {
    //     noblock = 1;
    //   }
    // }


    return weights;
  });

  return constructor();

  function constructor() {
    const weights = {
      mate: [weightMate(), 0.4],
      trapKing: [weightTrapKing(), 0.4]
    };


    return WeightedSum(weights);
  }

  function weightTrapKing() {
    const before = move.before,
          after = move.after;

    const king = after.king(after.turn());

    const kingMobility = after.trapSquares(king);

    return controlSquares(kingMobility, king);
  };

  function weightMate() {
    const after = move.after;
    return Weight(after.isMate()?1:0);
  }

  function controlSquares(squares, trap) {
    if (trap) squares = [...squares, trap];

    let res = squares.reduce((acc, _) => ({
      ...acc,
      [_]: controlASquare(_, trap)
    }), {});

    
    res = Weights(res);
    return res;
  }

  function controlASquare(square, trap) {
    const us = move.before.turn();
    const after = move.after;

    // if (move.uci === 'Qa8+') {
    //   debugger;
    // }

    return after.attackersByColor((us, them) => {

      let control = Weights(mapObj(us, (key, a) => weightAttack(square, key, a, trap)));

      let deflect = deflectTheSquare(square);

      return WeightedSum({
        control: [control, 0.55],
        deflect: [deflect, 0.45]
      });
    })(square, us);
  }

  function deflectTheSquare(square) {
    const them = move.after.turn();
    const defenders = move.after.attackersWithColor(square, them);

    return Weights(mapObj(defenders, (key, _) => {
      return WeightedSum({
        attack: [attackSquare(key), 0.35],
        capture: [captureSquare(key), 0.65]
      });
    }));
  }

  function attackSquare(square) {
    const before = move.before,
          after = move.after,
          us = before.turn();

    const attackBefore = before.attackersWithColor(square, us),
          attackAfter = after.attackersWithColor(square, us);

    const wBefore = Weights(mapObj(attackBefore, (key, a) => weightAttack(square, key, a))),
          wAfter = Weights(mapObj(attackAfter, (key, a) => weightAttack(square, key, a)));

    return Compose(wAfter, wBefore, (a, b) => mul(a, 0.5) - mul(b, 0.5) + 0.5);
  }

  function captureSquare(square) {
    const before = move.before.get(square),
          after = move.after.get(square);

    if (before && after && before.type != after.type) {
      return Weight(1);
    }
    return Weight(0);
  }
}
