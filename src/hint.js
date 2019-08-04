import * as util from './util';

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
    console.log(msg);
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

export function weightMove(a) {
  const weights = [
    weight(mate()(a), 0.4),
    weight(trapKing()(a), 0.4)
  ];

  return weights.reduce(sum);
}

export function trapKing() {
  return move => {
    const before = move.before,
          after = move.after;

    const king = after.king(after.turn());

    const kingMobility = after.mobility(king);

    return controlSquares(kingMobility, king)(move);
  };
};

export function mate() {
  return move => {
    const after = move.after;
    return after.isMate()?1:0;
  };
}

export function controlSquares(squares, trap) {
  return move => {
    if (trap) squares = [...squares, trap];

    const scale = 1/squares.length;

    return squares.map(_ => controlASquare(_, trap)(move))
      .reduce(rightScale(scale), 0);
  };
}

export function controlASquare(square, trap) {
  return move => {
    const us = move.before.turn();
    const after = move.after;

    // if (move.uci === 'Qa8+') {
    //   debugger;
    // }

    return after.attackersByColor((us, them) => {

      let control = Object.values(mapObj(us, (key, a) => weightAttack(key, a, trap)(move)));
      control = reduceScale(control);
      let deflect = deflectTheSquare(square)(move);

      return [weight(control, 0.75),
              weight(deflect, 0.25)]
        .reduce(sum);
    })(square, us);
  };
}

export function deflectTheSquare(square) {
  return move => {
    const defenders = move.before.attackers(square);

    const scale = 1/objLength(defenders);

    return Object.values(mapObj(defenders, (key, _) => {
      return [weight(attackSquare(key)(move), 0.25),
              weight(captureSquare(key)(move), 0.75)]
        .reduce(sum, 0);
    })).reduce(rightScale(scale));

  };
}

function weightAttack(attacker, attack, trap, noOutpost) {
  return move => {
    const after = move.after;

    const weights = [
      weight(attack.blocking?1/(attack.blocking.length+1):1, 0.4),
      weight(noOutpost?0:weightOutpost(after.outpost(attacker))(move), 0.4)
    ];
    return weights.reduce(sum);
  };
}

function weightOutpost(outpost) {
  return move => {
    const after = move.after;
    const us = move.before.turn();

    const defenders = filterObj(outpost, (key, attack) =>
      after.get(key).color === us
    );
    const attackers = filterObj(outpost, (key, attack) =>
      after.get(key).color === util.opposite(us)
    );

    let wDefense = Object.values(mapObj(defenders, (key, defender) =>
      weightAttack(key, defender, null, true)(move)));

    let wOffense = Object.values(mapObj(attackers, (key, attacker) =>
      weightAttack(key, attacker, null, true)(move)));

    wDefense = reduceScale(wDefense);    
    wOffense = reduceScale(wOffense);

    let wHanging = (mul(wDefense, 0.5) - mul(wOffense, 0.5)) + 0.5;

    return [
      weight(wHanging, 1)
    ].reduce(sum);
  };
}

export function attackSquare(square) {
  return move => {
    const before = move.before,
          after = move.after;

    const attackBefore = before.attackers(square),
          attackAfter = after.attackers(square);

    const resBefore = Object.values(mapObj(attackBefore, (key, a) => weightAttack(key, a)(move))),
          resAfter = Object.values(mapObj(attackAfter, (key, a) => weightAttack(key, a)(move)));

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
