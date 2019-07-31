import { is, deep_is, ok, not, log } from 'testiz/browser';

import { moves, is_mate } from './util';

import * as util from '../util';

export default function run() {
  moves('empty', '8/8/8/8/8/4R3/8/8 w - - 0 1', 'e4', []);

  moves('rook', '8/8/8/8/8/4R3/8/8 w - - 0 1', 'e3',
        util.visualMarked(`
    x   
    x   
    x   
    x   
    x   
xxxxrxxx
    x   
    x   
`));

  is_mate('no mate', '8/8/8/8/8/4R3/8/8 w - - 0 1', false);

  is_mate('mate', '2qk4/2ppQ3/8/8/1B6/8/8/8 b - - 0 1');

  is_mate('mate', 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3');
}
