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

function logMove(msg, move, actual) {
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

function weight(filter, weight) {
  return (_) => {
    return filter(_) * weight;
  };
}

export function weightMove(a) {
  const weights = [
    weight(mate(), 0.75),
    weight(backrankMateIdea(), 0.25)];

  return weights.reduce((acc, _) => acc + _(a), 0);
}

export function backrankMateIdea() {
  return move => {
    const before = move.before;

    const king = before.king(util.opposite(before.turn()));

    const kingMobility = before.mobility(king);

    if (kingMobility.length) {
      return controlSquares(kingMobility)(move);
    } else {
      return 0;
    }
  };
};

export function mate() {
  return move => {
    const after = move.after;
    return after.isMate()?1:0;
  };
}

export function controlSquares(squares) {
  return move => {
    const scale = 1/squares.length;

    return squares.map(_ => controlASquare(_)(move))
      .reduce((acc, _) => acc + _*scale);
  };
}

export function controlASquare(square) {
  return move => {
    const us = move.before.turn();
    const after = move.after;

    if (after.controlSquare(square, us)) {
      return 1;
    } else {
      return deflectTheSquare(square)(move);
    }
  };
}

export function deflectTheSquare(square) {
  return move => {
    const defenders = move.before.attackers(square);

    const scale = 1/objLength(defenders);

    return Object.values(mapObj(defenders, (key, _) => {
      return [weight(attackSquare(key), 0.25),
              weight(captureSquare(key), 0.75)];
    })).flat()
      .map(_ => _(move))
      .reduce((acc, _) => (acc + _ * scale), 0);
  };
}

function weightAttack(attack) {
  if (!attack.blocking) {
    return 1;
  }
  return 1/(attack.blocking.length + 1);
}

export function attackSquare(square) {
  return move => {
    const before = move.before,
          after = move.after;

    const attackBefore = before.attackers(square),
          attackAfter = after.attackers(square);

    const resBefore = Object.values(mapObj(attackBefore, (_, a) => weightAttack(a))),
          resAfter = Object.values(mapObj(attackAfter, (_, a) => weightAttack(a)));

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
