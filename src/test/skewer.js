import { deep_is, is, ok, not, log } from 'testiz/browser';

import { set_is, withEngine } from './util';

export default function run() {

  tactic_is('skewer', '8/1r3k2/2q1ppp1/8/5PB1/4P3/4QK2/5R2 w - - 0 1', [Tactics.Skewer({ 'Bf3': {} })]);

}
