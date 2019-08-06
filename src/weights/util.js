export const values = {
  'k': 99,
  'q': 9,
  'r': 5,
  'b': 3.3,
  'n': 3,
  'p': 1
};

export const exists = _ => !!_;

export const isColor = (color) => {
  return p => p.color === color;
};

export const isType = (types) => {
  return color => p => {
    return types.some(_ => _ === p.type && color === p.color);
  };
};

export const isPin = (attacker, attacked, blocker) => {
  const vAttacker = values[attacker],
        vAttacked = values[attacked],
        vBlocker = values[blocker];

  return (vAttacker <= vAttacked && vBlocker <= vAttacked);
};

export const isSkewer = (attacker, attacked, blocker) => {
  const vAttacker = values[attacker],
        vAttacked = values[attacked],
        vBlocker = values[blocker];

  return (vBlocker >= vAttacked);  
};

export const isKnight = isType(['n']);
export const isRook = isType(['r']);
export const isQueen = isType(['q']);
export const isKing = isType(['k']);



export function makeDoPosition(position, move) {
  return (pos, m, f) => {
    if (pos === position && move.uci === m) {
      f();
    }
  };
}
