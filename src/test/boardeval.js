import { deep_is, is, ok, not, log } from 'testiz/browser';
import { has_keys, set_is, withEngine } from './util';

import * as util from '../util';
import { Direction } from '../util';

import BoardEval from '../boardeval';

function withVisualBoard(board, f) {
  f(util.visualBoard(board));
}

function withBoardEval(board, f) {
  withVisualBoard(board, board => {
    f(new BoardEval(board));
  });
}

export default function run() {
/*
abcdefgh
*/
  withBoardEval(`
R   n   
       k
   b
  r
    q
  
 
K     b
`, board => {
  
  has_keys('evaluate square a1', {
    moves: { b1: { danger: true }, b2: { }, a2: {} },
    attacks: { b1: { danger: true }, b2: { }, a2: {} },
    attackers: ['a8'],
  }, board.square('a1'));

  has_keys('evaluate square a8', {
    h8: { blocking: ['e8'], interpose: { b8: ['d6'], c8: ['c5'], e8: ['e4'], f8: ['d6'], g8: ['h7'] } }
  }, board.square('a8')['attacks']);


});

}
