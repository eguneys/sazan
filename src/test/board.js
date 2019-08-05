import { deep_is, is, ok, not, log } from 'testiz/browser';
import { set_is, withEngine, withVisualBoard } from './util';

import * as util from '../util';
import { Direction } from '../util';

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

  is('white king place', 'e1', board.king('w'));
  is('black king place', 'e8', board.king('b'));
  
  deep_is('e2 outpost', board.outpost('d4'), {
    'c5': {},
    'd1': { blocking: ['d2'] },
    'd8': { blocking: ['d7'] }
  });

  is('can block attack', false, board.canBlock('d4', 'd6', 'w'));
  is('can block attack', true, board.canBlock('d4', 'd6', 'b'));
  is('can block attack', false, board.canBlock('d4', 'd5', 'b'));
});  

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

  is('f2 side', 'w', board.color('f2'));

  deep_is('c3', { 'b1': {},
                  'b2': {},
                  'c5': {},
                  'd2': {}},
          board.attackers('c3'));


  deep_is('d2', { 'b1': {},
                  'c1': {},
                  'd1': {},
                  'd4': {},
                  'd8': { blocking: ['d7', 'd4'] },
                  'e1': {}}, board.attackers('d2'));

  deep_is('f2', { 'e1': {},
                  'f5': {},
                  'c5': { blocking: ['d4'] }},
          board.attackers('f2'));

  deep_is('f2 direction diagonal', { 'c5': { blocking: ['d4'] },
                                     'e1': {}},
          board.attackers('f2', Direction.diagonal));


  deep_is('f2 direction file', { 'f5': {}},
          board.attackers('f2', Direction.file));

});

  withVisualBoard(`
R   n   
       k



 P 
 
K     b
`, board => {

  deep_is('pawn attacks', ['a8', 'b3'], board.chess().attackers('a4'));

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
          { 'a3': {},
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
    'c4': {},
    'b4': {},
    'a4': { blocking: ['b4'] },

    'd5': {},
    'd6': { blocking: ['d5'] },
    'd7': { blocking: ['d5','d7'] },
    'd8': { blocking: ['d5', 'd7', 'd8'] },
    'd3': {},
    'd2': {},
    'd1': {},
  }, board.movements('d4'));
});

  withVisualBoard(`
rnbq Bnr
pppp ppp
   R    
k  pR q 
P Pr    
 P    Rr
PPP  PPP
RNBQKBNR
`, board => {

  log('king safety');

  deep_is('king', {
    'f1': { blocking: ['f1'] },
    'f2': { blocking: ['f2'] },
    'e2': {},
    'd1': { blocking: ['d1'], danger: true },
    'd2': { danger: true }
  }, board.movements('e1'));

  deep_is('pinned pawn', {
    'd4': { blocking: ['d4'], danger: true },
    'c4': { danger: true }
  }, board.movements('d5'));


  deep_is('can put in check', {
    'b4': {}
  }, board.movements('b3'));

});

}
