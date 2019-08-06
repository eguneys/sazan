import * as util from '../util';

import { memoize, memoize2 } from '../util2';

function diffSquare(from, d) {
  const iFile = util.fileIndexes[util.fileOf(from)],
        iRank = util.rankIndexes[util.rankOf(from)];

  const iFile2 = iFile + d[0],
        iRank2 = iRank + d[1];

  if (iFile2 < 0 || iFile2 > 7 ||
      iRank2 < 0 || iRank2 > 7)
    return null;

  const file = util.files[iFile2];
  const rank = util.ranks[iRank2];

  return util.square(file, rank);
}

const files = [[1, 0],
               [2, 0],
               [3, 0],
               [4, 0],
               [5, 0],
               [6, 0],
               [7, 0],
               [-1, 0],
               [-2, 0],
               [-3, 0],
               [-4, 0],
               [-5, 0],
               [-6, 0],
               [-7, 0]];

const ranks = [[0, 1],
               [0, 2],
               [0, 3],
               [0, 4],
               [0, 5],
               [0, 6],
               [0, 7],
               [0, -1],
               [0, -2],
               [0, -3],
               [0, -4],
               [0, -5],
               [0, -6],
               [0, -7]];

const diagonals = [
  [1,1],
  [2,2],
  [3,3],
  [4,4],
  [5,5],
  [6,6],
  [7,7],
  [-1,1],
  [-2,2],
  [-3,3],
  [-4,4],
  [-5,5],
  [-6,6],
  [-7,7],
  [1,-1],
  [2,-2],
  [3,-3],
  [4,-4],
  [5,-5],
  [6,-6],
  [7,-7],
  [-1,-1],
  [-2,-2],
  [-3,-3],
  [-4,-4],
  [-5,-5],
  [-6,-6],
  [-7,-7],
];

const knights = [
  [1,2],
  [1,-2],
  [2,1],
  [2,-1],
  [-1,2],
  [-1,-2],
  [-2, 1],
  [-2, -1]
];

const kingDiagonals = [
  [1,1],
  [1,-1],
  [-1, 1],
  [-1, -1]
];

const kingFiles = [
  [0,1],
  [0,-1]
];

const kingRanks = [
  [1,0],
  [-1, 0]
];

const kingUps = [
  [1, 1],
  [-1, 1],
  [0, 1]
];

const kingDowns = [
  [1, -1],
  [-1, -1],
  [0, -1]
];

const kingLefts = [
  [-1, 1],
  [-1, -1],
  [-1, 0]
];

const kingRights = [
  [1, 1],
  [1, -1],
  [1, 0]
];

const kings = [
  ...kingDiagonals,
  ...kingFiles,
  ...kingRanks
];

const pawnAttacksWhite = [
  [1, 1],
  [-1,1]
];

const pawnAttacksBlack = [
  [1,-1],
  [-1,-1]
];

const pawnMovesWhiteBase = [
  [0, 1],
  [0,2]
];

const pawnMovesWhite = [
  [0, 1]
];

const pawnMovesBlackBase = [
  [0,-1],
  [0, -2]
];

const pawnMovesBlack = [
  [0, -1]
];

const pawnAttackVectors = {
  'w': [...pawnAttacksWhite],
  'b': [...pawnAttacksBlack]
};

const pawnMoveVectors = {
  'wb': [...pawnMovesWhiteBase],
  'w': [...pawnMovesWhite],
  'bb': [...pawnMovesBlackBase],
  'b': [...pawnMovesBlack],
};

const attackVectors = {
  'r': [...files, ...ranks],
  'q': [...files, ...ranks, ...diagonals],
  'b': [...diagonals],
  'n': [...knights],
  'k': [...kings]
};

const moveVectors = {
  'r': [...files, ...ranks],
  'q': [...files, ...ranks, ...diagonals],
  'b': [...diagonals],
  'n': [...knights],
  'k': [...kings]
};

const dirVectors = {
  files,
  ranks,
  diagonals,
  knights,
  kings,
  kingDiagonals,
  kingFiles,
  kingRanks,
  kingUps,
  kingDowns,
  kingLefts,
  kingRights
};

const directionVector = (dir) => {
  return dirVectors[dir];
};

const moveVector = (from, type, color) => {
  if (type === 'p') {
    const rank = util.rankOf(from);
    const base = (color==='w'&& rank==='7') || (color==='b' && rank==='2')?'b':'';
    const i = color + base;
    return pawnMoveVectors[i];
  } else {
    return moveVectors[type];
  }
};

const attackVector = (type, color) => {
  if (type === 'p') {
    
    return pawnAttackVectors[color];
  } else {
    return attackVectors[type];
  }
};

const captureVector = (type, color) => {
  if (type === 'p') {
    return pawnAttackVectors[color];
  }
  return [];
};


export const movementVector = (() => {
  const direction = memoize2((from, dir) => {
    return directionVector(dir)
      .map(_ => diffSquare(from, _))
      .filter(_ => !!_);
  });

  const attack = memoize2((from, type, color) => {
    return attackVector(type, color)
      .map(_ => diffSquare(from, _))
      .filter(_ => !!_);
  });

  const move = memoize2((from, type, color) => {
    return moveVector(from, type, color)
      .map(_ => diffSquare(from, _))
      .filter(_ => !!_);
  });

  const capture = memoize2((from, type, color, capturedColor) => {
    return captureVector(type, color)
      .map(_ => diffSquare(from, _))
      .filter(_ => {
        return !!_ && capturedColor && capturedColor !== color;
      });
  });

  return {
    attack,
    move,
    capture,
    direction
  };
})();
