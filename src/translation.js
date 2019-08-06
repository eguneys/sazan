import * as util from './util';

import { mapObj } from './util2';

const colors = { w: 'white', b: 'black' };
const types = { k: 'king', q: 'queen', 'r': 'rook', 'b': 'bishop', 'n': 'knight', 'p': 'pawn' };

export default function translate(root, board) {
  function pin(white, king, attacked, queen, attacker) {
    return `${white}'s ${king} on ${attacked} is pinned by ${queen} on ${attacker}`;
  }

  const translation = {
    tactics: {
      onUs: {
        
      }
    }
  };

  // expected
  // white has a backrank mate
  // white's knight on g7 is pinned to the king on d5 by the queen on d4.

  // { king: pins: pinned: [attacker, attacked] }
  function translatePin(pinned, pin) {
    pinned = board.get(pinned);

    const color = colors[pinned.color],
          type = types[pinned.type],
          attacked = pin[0],
          attackedType = board.get(pin[0]).type,
          attacker = pin[1];

    return pin(color, type, attacked, attackedType, attacker);
  };

  function translateRoot() {
    return {};
  }

  return JSON.stringify(translateRoot());
}
