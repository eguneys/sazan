import snab from './snab';

import makeCtrl from './ctrl/main';
import view from './view/main';
import configure from './config';
import defaults from './state'; 

import start from './api';

import makeGround from './ground';

export function app(element, config) {

  let state = defaults();

  configure(state, config || {});

  let { ctrl, redraw } = snab(element, state, makeCtrl, view);

  return start(ctrl, redraw);
  
}
