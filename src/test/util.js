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

export const has_keys = runtest(matcher((a, b) => {
  for (let key in a) {
    if (!objEqual(a[key], b[key])) return false;
  }
  return true;
}, '++'));

function objEqual(a, b) {
  if (typeof a === 'object') {
    if (typeof b !== 'object') {
      return false;
    }
    for (let k in a) {
      if (!objEqual(a[k], b[k]))
        return false;
    }
    for (let k in b) {
      if (!objEqual(a[k], b[k]))
        return false;
    }
    return true;
  } else return a === b;
};


export function withVisualBoard(board, f) {
  f(visualBoard(board));
}

// `
// rnbqkbnr
// pppppppp




// PPPPPPPP
// RNBQKBNR
// `
function visualBoard(str) {
  let board = new Board();

  str.replace(/^\n+|\n+$/g, '').split('\n').forEach((line, row) => {
    row = 7 - row;
    line.split('').forEach((char, col) => {
      const file = util.files[col],
            rank = util.ranks[row];

      if (char !== ' ') {
        const color = (char === char.toUpperCase()) ? 'w':'b';
        board = board.put({ type: char.toLowerCase(), color }, file + rank);
      }
    });
  });


  return board;  
}


//         `
//     x   
//     x   
//     x   
//     x   
//     x   
// xxxxrxxx
//     x   
//     x   
// `
function visualMarked(str) {
  const res = [];

  str.replace(/^\n+|\n+$/g, '').split('\n').forEach((line, row) => {
    row = 7 - row;
    line.split('').forEach((char, col) => {
      const file = util.files[col],
            rank = util.ranks[row];
      if (char === 'x') {
        res.push(file + rank);
      }
    });
  });

  return res;
}
