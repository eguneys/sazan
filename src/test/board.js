import { deep_is, is, ok, not, log } from 'testiz/browser';
import { set_is, withEngine } from './util';

import * as util from '../util';
import { Direction } from '../util';

function withVisualBoard(board, f) {
  f(util.visualBoard(board));
}

export default function run() {

  withVisualBoard(`
rnbqkbnr
pppppppp
        
  q  q  
   R    
  r    
PPPPPPPP
RNBQKBNR
`, board => {

  log('attackers');

  is('f2 side', 'w', board.side('f2'));

  deep_is('c3', { 'b1': { blocking: [] },
                  'b2': { blocking: [] },
                  'c5': { blocking: [] },
                  'd2': { blocking: [] }},
          board.attackers('c3'));


  deep_is('d2', { 'b1': { blocking: [] },
                  'c1': { blocking: [] },
                  'd1': { blocking: [] },
                  'd4': { blocking: [] },
                  'd8': { blocking: ['d7', 'd4'] },
                  'e1': { blocking: [] }}, board.attackers('d2'));

  deep_is('f2', { 'e1': { blocking: [] },
                  'f5': { blocking: [] },
                  'c5': { blocking: ['d4'] }},
          board.attackers('f2'));

  deep_is('f2 direction diagonal', { 'c5': { blocking: ['d4'] },
                                     'e1': { blocking: [] }},
          board.attackers('f2', Direction.diagonal));


  deep_is('f2 direction file', { 'f5': { blocking: [] }},
          board.attackers('f2', Direction.file));

});

  withVisualBoard(`
rnbqkBnr
pppp ppp
        
  qP q  
PP rr   
      Rr
PPP  PPP
RNBQ BNK
`, board => {

  log('mobility');

  deep_is('no piece', {}, board.movements('a3'));

  deep_is('pawn',
          { 'a3': { blocking: [] },
            'a4': { blocking: ['a4'] }}, board.movements('a2'));

  deep_is('pawn blocked by them',
          { 'h3': { blocking: ['h3'] },
            'h4': { blocking: ['h3'], danger: true }}, board.movements('h2'));

  deep_is('pawn blocked by us',
          { 'g3': { blocking: ['g3'] },
            'g4': { blocking: ['g3'] },
            'h3': { }}, board.movements('g2'));

  deep_is('rook', {
    'e4': { blocking: ['e4'] },
    'f4': { blocking: ['e4'] },
    'g4': { blocking: ['e4'] },
    'h4': { blocking: ['e4'] },
    'c4': { blocking: [] },
    'b4': { blocking: [] },
    'a4': { blocking: ['b4'] },

    'd5': { blocking: [] },
    'd6': { blocking: ['d5'] },
    'd7': { blocking: ['d5','d7'] },
    'd8': { blocking: ['d5', 'd7', 'd8'] },
    'd3': { blocking: [] },
    'd2': { blocking: [] },
    'd1': { blocking: [] },
  }, board.movements('d4'));
});

  withVisualBoard(`
rnbq Bnr
pppp ppp
   R    
k pR q  
PP r    
      Rr
PPP  PPP
RNBQKBNR
`, board => {

  log('king safety');

  deep_is('king', {
    'f1': { blocking: ['f1'] },
    'f2': { blocking: ['f2'], danger: true },
    'e2': { blocking: [] },
    'd1': { blocking: ['d1'], danger: true },
    'd2': { blocking: [], danger: true }
  }, board.movements('e1'));

});

}
