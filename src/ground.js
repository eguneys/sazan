import { Chessground } from 'chessground';

export function makeConfig(ctrl) {
  return {
    fen: ctrl.fen(),
    movable: {
      color: 'white',
      events: {}
    }
  };
}

export default function ground(element, config) {
  return Chessground(element, config);
}
