import { h } from 'snabbdom';

import { bind } from './utilview';

import ground from './ground';

function roundTo(x) {
  return Math.round(x * 10000) / 10000;
}

function fenInput(ctrl) {
  return h('div', [
    h('button', 'Load Fen'),
    h('input', {})
  ]);
}

const colors = [
  'white',
  'sky',
  'selestial',
  'palmsprings',
  'devilblue',
  'hotstone',
  'crocodile',
  'greyporcelain',
  'alamada',
  'mandarin',
  'spiced',
  'desert',
  'childean',
  'pumpkin',
  'florescant',
  'eyeofnewt',
  'luckypoint',
  'jacksons',
  'liberty',
  'purple'
];

function expandNode(ctrl, key, node) {
  return h('span', {
    hook: bind('click', () => ctrl.toggle(node))
  }, (node.collapsed?'+':'-') + ' ' + key);
}

function weight(ctrl, node, depth = 0) {
  let children = [];

  if (!node.collapsed) {
    Object.keys(node.children).forEach(_ => {
      const child = node.children[_];
      if (typeof child !== 'object') {
        children.push(h('div', [
          h('span', _),
          h('span', roundTo(child))
        ]));
      } else {
        children.push(h('div', [
          expandNode(ctrl, _, child),
          h('span', roundTo(child.w)),
          weight(ctrl, child, depth + 1)
        ]));
      }
    });
  }

  const klass = colors[depth];

  return h('div.weight.' + klass, children);
}

function move(ctrl, m) {
  return h('div.move', [
    h('h2', m.uci),
    weight(ctrl, m.root)
  ]);
}

function moves(ctrl) {
  return h('div.moves', [
    move(ctrl, ctrl.data.move1),
    move(ctrl, ctrl.data.move2)
  ]);
}

function renderGround(ctrl) {
  return h('div.ground', {
    hook: {
      insert(vnode) {
        ground(vnode.elm, ctrl.groundConfig);
      }
    }
  });
}

export default function view(ctrl) {
  return h('div.main', [
    renderGround(ctrl),
    moves(ctrl)
  ]);
}
