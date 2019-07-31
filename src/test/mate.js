import { deep_is, is, ok, not, log } from 'testiz/browser';

import { set_is, withEngine } from './util';

import { ForcedMateTactic } from '../tactics';

function tactic_is(msg, fen, tactics) {
  withEngine(engine => {
    const actual = engine.tactics();
    deep_is(msg, actual, tactics);
  }, fen);  
}

export default function run() {

  log('mate tactics');

  tactic_is('no mate', 'rnb1kbnr/pppp1ppp/8/4p3/5PPq/8/PPPPP2P/RNBQKBNR w KQkq - 1 3', []);

  tactic_is('Qxf7#', '3qk3/3ppp2/8/8/2B5/5Q2/3K4/8 w - - 0 1', [new ForcedMateTactic('Qxf7#')]);
}
