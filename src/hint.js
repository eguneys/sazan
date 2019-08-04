import * as util from './util';
import play from './play';

const max_depth = 1;

function scale(scale) {
  return (a, b) => {
    return sum(a, b) * scale;
  };
}

function sum(a, b) {
  return a + b;
}

function mul(a, b) {
  return a * b;
}

function reduceScale(weights) {
  const scale = 1 / weights.length;
  return weights.reduce((acc, _) => acc + _ * scale, 0);
}

function rightScale(scale) {
  return (a, b) => a + b * scale;
}

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

function weight(x, weight) {
  return x * weight;
}

function hack() {
  return move => {
    if (move.uci === 'Qf7+' || move.uci === 'Qxf8+') {
      return 1;
    }
    return 0;
  };
}

export function weightMove(a, depth) {
  const weights = [
    weight(mate()(a), 0.4),
    weight(trapKing()(a, depth), 0.4)
  ];

  return weights.reduce(sum);
}

export function trapKing() {
  return (move, depth) => {
    const before = move.before,
          after = move.after;

    const king = after.king(after.turn());

    const kingMobility = after.mobility(king);

    return controlSquares(kingMobility, king)(move, depth);
  };
};

export function mate() {
  return move => {
    const after = move.after;
    return after.isMate()?1:0;
  };
}

export function controlSquares(squares, trap) {
  return (move, depth) => {
    if (trap) squares = [...squares, trap];

    const scale = 1/squares.length;

    let res = squares.map(_ => controlASquare(_, trap)(move, depth));

    
    // logMove('Qf7+', res.reduce(rightScale(scale), 0), move);
    // logMove('Qf7+', squares, move);
    // logMove('Qf8+', res.reduce(rightScale(scale), 0), move);
    // logMove('Qf8+', squares, move);
    res = res.reduce(rightScale(scale), 0);
    return res;
  };
}

export function controlASquare(square, trap) {
  return (move, depth) => {

    const us = move.before.turn();
    const after = move.after;

    // if (move.uci === 'Qa8+') {
    //   debugger;
    // }

    return after.attackersByColor((us, them) => {

      let control = Object.values(mapObj(us, (key, a) => weightAttack(square, key, a, trap)(move, depth)));

      control = reduceScale(control);
      let deflect = deflectTheSquare(square)(move, depth);


      logMove('Qf8+', square + JSON.stringify(control) + ' ' + deflect, move);
      logMove('Qf7+', square + JSON.stringify(control) + ' ' + deflect , move);


      return [weight(control, 0.45),
              weight(deflect, 0.55)]
        .reduce(sum);
    })(square, us);
  };
}

export function deflectTheSquare(square) {
  return (move, depth) => {
    const defenders = move.before.attackers(square);

    const scale = 1/objLength(defenders);

    return Object.values(mapObj(defenders, (key, _) => {
      return [weight(attackSquare(key)(move, depth), 0.25),
              weight(captureSquare(key)(move, depth), 0.75)]
        .reduce(sum);
    })).reduce(rightScale(scale), 0);

  };
}

function weightAttack(attacked, attacker, attack, trap, noOutpost) {
  function blockAttackFilter(move) {
    const before = move.before;
    const after = move.after;

    const defense = after.attacks(attacker)[attacked];

    return defense && defense.blocking && defense.blocking.length > 0;
  }

  return (move, depth) => {
    const after = move.after;

    const weights = [
      weight(attack.danger?0:1, 0.2),
      weight(attack.blocking?1/(attack.blocking.length+1):1, noOutpost?0.6:0.1),
      weight(noOutpost?0:weightOutpost(attacker, after.outpost(attacker))(move, depth), 0.5)
    ];

    if (false && !noOutpost) {
      logMove('Qf8+', attacked + ' o ' + JSON.stringify(weights) + ' ' , move);
      logMove('Qf7+', attacked + ' o ' + JSON.stringify(weights) + ' ' , move);
    }

    if (depth < max_depth && !attack.blocking) {
      const counter = play(move.after, blockAttackFilter, depth + 1);

      if (!counter.best) {
        weights.push(0.2);
      }
    }


    return weights.reduce(sum);
  };
}

function weightOutpost(square, outpost) {
  return (move, depth) => {
    const after = move.after;
    const us = move.before.turn();

    const defenders = filterObj(outpost, (key, attack) =>
      after.get(key).color === us
    );
    const attackers = filterObj(outpost, (key, attack) =>
      after.get(key).color === util.opposite(us)
    );

    // logMove('Qf8+', square + JSON.stringify(attackers), move);
    // logMove('Qf7+', square + JSON.stringify(attackers), move);

    let wDefense = Object.values(mapObj(defenders, (key, defender) =>
      weightAttack(square, key, defender, null, true)(move, depth)));

    let wOffense = Object.values(mapObj(attackers, (key, attacker) =>
      weightAttack(square, key, attacker, null, true)(move, depth)));

    // logMove('Qf8+', JSON.stringify(wDefense) + ' ' + square + ' ' + JSON.stringify(wOffense), move);
    // logMove('Qf7+', JSON.stringify(wDefense) + ' ' + square + ' ' + JSON.stringify(wOffense), move);


    wDefense = reduceScale(wDefense);    
    wOffense = reduceScale(wOffense);

    let wHanging = (mul(wDefense, 0.5) - mul(wOffense, 0.5)) + 0.5;

    // logMove('Qf8+', wHanging + ' ' + square, move);
    // logMove('Qf7+', wHanging + ' '+ square, move);


    return [
      weight(wHanging, 1)
    ].reduce(sum);
  };
}

export function attackSquare(square) {
  return (move, depth) => {
    const before = move.before,
          after = move.after;

    const attackBefore = before.attackers(square),
          attackAfter = after.attackers(square);

    const resBefore = Object.values(mapObj(attackBefore, (key, a) => weightAttack(square, key, a)(move, depth))),
          resAfter = Object.values(mapObj(attackAfter, (key, a) => weightAttack(square, key, a)(move, depth)));

    const wBefore = resBefore.reduce(sum, 0),
          wAfter = resAfter.reduce(sum, 0);

    return (mul(wAfter, 0.5) - mul(wBefore, 0.5)) + 0.5;
  };
}

export function captureSquare(square) {
  return move => {
    const before = move.before.get(square),
          after = move.after.get(square);

    if (before && after && before.type != after.type) {
      return 1;
    }
    return 0;
  };
}
