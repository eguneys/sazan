import { deep_is, is, ok, not, log } from 'testiz/browser';
import { set_is, withEngine } from './util';

import * as util from '../util';
import { Vision } from '../util';

export default function run() {

  const board = util.visualBoard(`
RNBQKBNR
PPPPPPPP
        
  Q  Q  
   r    
        
pppppppp
rnbqkbnr
`);

  is('f2 side', 'b', board.side('f2'));

  deep_is('d2', { 'b1': { blocking: [] },
                  'c1': { blocking: [] },
                  'd1': { blocking: [] },
                  'd4': { blocking: [] },
                  'd8': { blocking: ['d7', 'd4'] },
                  'e1': { blocking: [] }}, board.attackers('d2', {}));

  deep_is('f2', { 'e1': { blocking: [] },
                  'f5': { blocking: [] },
                  'c5': { blocking: ['d4'] }},
          board.attackers('f2'));
  
}
