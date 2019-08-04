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

  const squareEval = (square) => {
    return {
      moves: squareMoves(square),
      attacks: squareAttacks(square),
      attackers: squareAttackers(square)
    };
  };

  this.squares = util.squares
    .reduce((acc, _) => ({ ...acc, [_]:squareEval(_) }), {});

  this.square = (square) => {
    return this.squares[square];
  };

}
