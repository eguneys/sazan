import * as util from './util';

import { memoize } from './util2';

export default function BoardEval(board) {
  this.board = board;

  const squareMoves = (square) => {
    return this.board.movements(square);
  };

  const squareAttacks = (square) => {
    return this.board.attacks(square);
  };

  const squareAttackers = (square) => {
    return this.board.chess().attackers(square);
  };

  const squareHolds = (square) => {
    return this.board.get(square);
  };

  const squareEval = memoize((square) => {
    return {
      square,
      holds: squareHolds(square),
      moves: squareMoves(square),
      attacks: squareAttacks(square),
      attackers: squareAttackers(square)
    };
  });

  this.square = (square) => {
    return squareEval(square);
  };

}
