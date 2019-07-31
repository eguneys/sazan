import { deep_is, is, ok, not, log } from 'testiz/browser';
import { withEngine } from './util';

import * as util from '../util';

export default function run() {

  const initialFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  
  withEngine(engine => {

    const board = util.visualBoard(`
RNBQKBNR
PPPPPPPP
        
        
        
        
pppppppp
rnbqkbnr
`);

    const s1 = util.squares.map(board.get);
    const s2 = util.squares.map(engine.board.get);

    deep_is('read fen', s1, s2);

    deep_is('a1 white rook', board.get('a1'),
            { type: 'r', color: 'w' });
    deep_is('a8 black rook', board.get('a8'),
            { type: 'r', color: 'b' });

  }, initialFen);
  
}
