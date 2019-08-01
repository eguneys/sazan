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
        
  q  q  
P  r    
      Rr
PPP  PPP
RNBQKBNR
`, board => {

  log('mobility');

  deep_is('pawn', { 'a3': { blocking: [] },
                    'a4': { blocking: ['a4'] }}, board.movements('a2'));

  deep_is('pawn blocked by them',
          { 'h3': { blocking: ['h3'] },
            'h4': { blocking: ['h3'] }}, board.movements('h2'));

  deep_is('pawn blocked by us',
          { 'g3': { blocking: ['g3'] },
            'g4': { blocking: ['g3'] }}, board.movements('g2'));
});

}
