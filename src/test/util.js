import { deep_is, is, ok, not, log, runtest, matcher } from 'testiz/browser';

import * as util from '../util';
import Engine from '../engine';

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

export function tactic_is(msg, fen, tactics) {
  withEngine(engine => {
    set_is(msg, engine.tactic(), tactics);
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
