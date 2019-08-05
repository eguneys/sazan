import { init } from 'snabbdom';
import klass from 'snabbdom/modules/class';
import attributes from 'snabbdom/modules/attributes';

const patch = init([klass, attributes]);

export default function snab(element, state, makeCtrl, view) {

  let vnode, ctrl;

  function redraw() {
    vnode = patch(vnode, view(ctrl));
  }

  ctrl = new makeCtrl(state, redraw);

  const blueprint = view(ctrl);
  vnode = patch(element, blueprint);

  state.redraw = redraw;

  return { ctrl, redraw };
}

