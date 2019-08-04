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

function rightScale(values) {
  const scale = 1/values.length;
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

function hack() {
  return move => {
    if (move.uci === 'Qf7+' || move.uci === 'Qxf8+') {
      return 1;
    }
    return 0;
  };
}

function WeightedSum(weights) {
  function value() {
    return Object.values(weights)
      .map(_ => _[0].value() * _[1])
      .reduce(sum, 0);
  }
  
  function add(v) {
    Object.keys(v).forEach(k =>
      weights[k] = v[k]
    );
  }

  return {
    weights,
    value,
    add,
    json() {
      const res = {};
      Object.keys(weights)
        .forEach(key =>
          res[key] = { p: weights[key][0].json() }
        );
      res['w'] = value();
      return res;
    }
  };
}


function Weights(weights, activation) {
  function value() {
    const res = Object.values(weights)
      .map(_ => {
        return _.value();
      })
      .reduce(activation(Object.values(weights)), 0);
    return res;
  }

  return {
    weights,
    value,
    json() {
      const res = {};
      Object.keys(weights).forEach(w => 
        res[w] = weights[w].json()
      );
      res['w'] = value();
      return res;
    }
  };
}

function Compose(a, b, f) {
  function value() {
    return f(a.value(), b.value());
  }
  return {
    a,
    b,
    value,
    json() {
      return {
        v: value(),
        a: a.json(), b: b.json()
      };
    }
  };
}

function Weight(weight) {
  return {
    weight,
    value() {
      if (weight != 0 && !weight) {
        debugger;
      }
      return weight;
    },
    json() {
      return weight;
    }
  };
}

export function weightMove(a, depth) {
  const weights = {
    mate: [weightMate()(a), 0.4],
    trapKing: [weightTrapKing()(a, depth), 0.4]
  };


  return WeightedSum(weights);
}

export function weightTrapKing() {
  return (move, depth) => {
    const before = move.before,
          after = move.after;

    const king = after.king(after.turn());

    const kingMobility = after.mobility(king);

    return controlSquares(kingMobility, king)(move, depth);
  };
};

export function weightMate() {
  return move => {
    const after = move.after;
    return Weight(after.isMate()?1:0);
  };
}

export function controlSquares(squares, trap) {
  return (move, depth) => {
    if (trap) squares = [...squares, trap];

    let res = squares.reduce((acc, _) => ({
      ...acc,
      [_]: controlASquare(_, trap)(move, depth)
    }), {});

    
    res = Weights(res, rightScale);
    // res = res.reduce(rightScale(scale), 0);
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

      let control = Weights(mapObj(us, (key, a) => weightAttack(square, key, a, trap)(move, depth)), rightScale);

      let deflect = deflectTheSquare(square)(move, depth);

      return WeightedSum({
        control: [control, 0.45],
        deflect: [deflect, 0.55]
      });
    })(square, us);
  };
}

export function deflectTheSquare(square) {
  return (move, depth) => {
    const defenders = move.before.attackers(square);

    return Weights(mapObj(defenders, (key, _) => {
      return WeightedSum({
        attack: [attackSquare(key)(move, depth), 0.25],
        capture: [captureSquare(key)(move, depth), 0.75]
      });
    }), rightScale);

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

    // logMove('Qf7+', attacked + ' ' + attacker + ' ' + attack.danger, move);

    const weights = WeightedSum({
      danger: [Weight(attack.danger?0:1), 0.2],
      blocking: [Weight(attack.blocking?1/(attack.blocking.length+1):1), noOutpost?0.5:0.1],
      outpost: [noOutpost?Weight(0):weightOutpost(attacker, after.outpost(attacker))(move, depth), 0.3]
    });

    if (depth < max_depth && !attack.blocking) {
      const counter = play(move.after, blockAttackFilter, depth + 1);

      if (!counter.best) {
        weights.add({ counter: [Weight(1), 0.4] });
      }
    }


    return weights;
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

    let wDefense = Weights(mapObj(defenders, (key, defender) =>
      weightAttack(square, key, defender, null, true)(move, depth)), rightScale);

    let wOffense = Weights(mapObj(attackers, (key, attacker) =>
      weightAttack(square, key, attacker, null, true)(move, depth)), rightScale);

    // logMove('Qf8+', JSON.stringify(wDefense) + ' ' + square + ' ' + JSON.stringify(wOffense), move);
    // logMove('Qf7+', square + ' ' + JSON.stringify(wOffense.value()), move);

    let wHanging = Compose(wDefense, wOffense, 
                           (a, b) => (mul(a, 0.5) - mul(b, 0.5)) + 0.5);

    // logMove('Qf8+', wHanging + ' ' + square, move);
    // logMove('Qf7+', wHanging + ' '+ square, move);


    return WeightedSum({
      hanging: [wHanging, 1]
    });
  };
}

export function attackSquare(square) {
  return (move, depth) => {
    const before = move.before,
          after = move.after;

    const attackBefore = before.attackers(square),
          attackAfter = after.attackers(square);

    const wBefore = Weights(mapObj(attackBefore, (key, a) => weightAttack(square, key, a)(move, depth)), rightScale),
          wAfter = Weights(mapObj(attackAfter, (key, a) => weightAttack(square, key, a)(move, depth)), rightScale);

    return Compose(wAfter, wBefore, (a, b) => mul(a, 0.5) - mul(b, 0.5) + 0.5);
  };
}

export function captureSquare(square) {
  return move => {
    const before = move.before.get(square),
          after = move.after.get(square);

    if (before && after && before.type != after.type) {
      return Weight(1);
    }
    return Weight(0);
  };
}
