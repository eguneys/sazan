import { deep_is, is, ok, not, log } from 'testiz/browser';
import { withEngine, withVisualBoard } from './util';

import * as util from '../util';

export default function run() {

  const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  
  withVisualBoard(`
RNBQKBNR
PPPPPPPP
        
        
        
        
pppppppp
rnbqkbnr
`, board => {

  const s1 = util.squares.map(board.get);

  deep_is('a1 white rook', board.get('a1'),
          { type: 'r', color: 'w' });
  deep_is('a8 black rook', board.get('a8'),
          { type: 'r', color: 'b' });

  }, initialFen);
  
}
