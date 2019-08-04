import { deep_is, is, ok, not, log, runtest, matcher } from 'testiz/browser';

import * as util from '../util';
import Engine from '../engine';

import play from '../play';
import Board from '../board';

export function withEngine(f, fen) {
  const engine = new Engine(fen);
  f(engine);
}

export function moves(msg, fen, square, moves) {
  withEngine(engine => {
    set_is(msg, engine.board.moves(square), moves);
  }, fen);
}

export function is_mate(msg, fen, v = true) {
  withEngine(engine => {
    is(msg, engine.board.isMate(), v);
  }, fen);
}

export function play_is(msg, fen, move) {
  const board = new Board(fen),
        actual = play(board);


  is(msg, actual.best.uci, move);
}

export function best_is(msg, fen, lines) {
  withEngine(engine => {
    deep_is(msg, engine.findBestMove(), lines);
  }, fen);
}

export const set_is = runtest(matcher((a, b) => {
  function eqSet(as, bs) {
    if (as.size !== bs.size) return false;
    for (var a of as) if (!bs.has(a)) return false;
    return true;
  }

  a = new Set(a);
  b = new Set(b);
  return eqSet(a, b);
}, '!='));


// export function strategy_is(msg, fen, strategy, move) {
//   const board = new Board(fen),
//         actual = play(board);

//   move = board.legals().find(_ => _.uci === move);

//   const expected = strategy(move);

//   deep_is(msg, {
//     name: actual.name,
//     move: actual.move
//   }, { name: expected.name,
//        move: expected.move
//      });
// }

// export function tactic_is(msg, fen, tactics) {
//   withEngine(engine => {
//     const actual = engine.tactics();
//     deep_is(msg, actual, tactics);
//   }, fen);  
// }

