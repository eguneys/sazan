import { h } from 'snabbdom';

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

function weight(ctrl, node, depth = 0) {
  let children = [];

  Object.keys(node.children).forEach(_ => {
    const child = node.children[_];
    if (typeof child !== 'object') {
      children.push(h('div', [
        h('span', _),
        h('span', roundTo(child))
      ]));
    } else {
      children.push(h('div', [
        h('span', _),
        h('span', roundTo(child.w)),
        weight(ctrl, child, depth + 1)
      ]));
    }
  });

  const klass = colors[depth];

  return h('div.weight.' + klass, children);
}

function move(ctrl, m) {
  return h('div.move', [
    h('h2', m.uci),
    weight(ctrl, m.w.json())
  ]);
}

function moves(ctrl) {
  const weights = ctrl.data.weights;

  return h('div.moves', [
    move(ctrl, weights.w1),
    move(ctrl, weights.w2)
  ]);
}

export default function view(ctrl) {
  return h('div.main', [
    moves(ctrl)
  ]);
}
