import { h } from 'snabbdom';

import position from './position';

export default function view(ctrl) {
  return h('div.main', [
    position(ctrl.position1),
    position(ctrl.position2)
  ]);
}
