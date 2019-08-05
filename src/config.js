import Board from './board';
import play from './play';

export default function configure(state, config) {
  merge(state, config);

  if (!config.fen || !config.move1) {
    throw new Error("Please provide fen, move1");
  }

  if (config.fen) {
    const board = new Board(config.fen),
          p = play(board);


    let w2,
        w1 = p.weights
        .filter(_ => _.uci === config.move1)[0];

    if (config.move2) {
      w2 = p.weights
        .filter(_ => _.uci === config.move2);
    } else {
      w2 = p.best;
    }

    if (!w1 || !w2) {
      throw new Error("Can't find moves");
    }

    state.weights = { w1, w2 };
  }

}

export function merge(base, extend) {
  for (var key in extend) {
    if (isObject(base[key]) && isObject(extend[key])) {
      merge(base[key], extend[key]);
    } else {
      base[key] = extend[key];
    }
  }
}

function isObject(o) {
  return typeof o === 'object';
}
