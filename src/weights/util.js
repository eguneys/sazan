export const exists = _ => !!_;

export const isColor = (color) => {
  return p => p.color === color;
};

export const isType = (types) => {
  return color => p => {
    return types.some(_ => _ === p.type && color === p.color);
  };
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
