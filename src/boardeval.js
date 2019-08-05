import * as util from './util';

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

  const cache = {};
  const squareEval = (square) => {
    if (!cache[square]) {
      cache[square] = {
        moves: squareMoves(square),
        attacks: squareAttacks(square),
        attackers: squareAttackers(square)
      };
    }
    return cache[square];
  };

  this.square = (square) => {
    return squareEval(square);
  };

}
