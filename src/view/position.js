import { h } from 'snabbdom';

import { bind } from './util';

import ground from '../ground';
import { makeConfig as makeGroundConfig } from '../ground';

function roundTo(x) {
  return Math.round(x * 100) / 100;
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
    hook: bind('click', () => {
      ctrl.toggle(node);
    })
  }, (node.collapsed?'+':'-') + ' ' + key);
}

function value(value) {
  const size = 0.8 + value * (1 + value)  + 'em';
  return h('span', {style: { 'font-size': size }}, roundTo(value));
}

function weight(ctrl, node, depth = 0) {
  let children = [];

  if (!node.collapsed) {
    children = Object.keys(node.children).map(_ => {
      const child = node.children[_];
      if (typeof child !== 'object') {
        return h('div', [
          h('span', _),
          value(child)
        ]);
      } else {
        return h('div', [
          expandNode(ctrl, _, child),
          value(child.w),
          weight(ctrl, child, depth + 1)
        ]);
      }
    });
  }

  const klass = colors[depth];

  return h('div.weight.' + klass, children);
}

function move(ctrl, m) {
  return h('div.move', [
    h('h2', m.uci + ' ' + roundTo(m.root.w)),
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
        ctrl.setGround(ground(vnode.elm, makeGroundConfig(ctrl)));
      }
    }
  });
}

function renderSelectPosition(ctrl) {
  let options = Object.keys(ctrl.data.li)
      .map(_ => h('option',
                  {
                    attrs: {
                      selected: ctrl.position === _
                    }
                  }, _));

  return h('select', {
    hook: bind('input', (e) => { ctrl.setPosition(e.target.value); })
  }, options);
}

function renderTranslation(ctrl) {
  return h('p.translation.white', ctrl.data.translation);
}

function renderControls(ctrl) {
  return h('div.controls', [
    renderSelectPosition(ctrl)
  ]);
}

export default function view(ctrl) {
  return h('div.position', [
    renderGround(ctrl),
    renderControls(ctrl),
    renderTranslation(ctrl),
    moves(ctrl),
  ]);
}
