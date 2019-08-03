import { betterMove } from './hint';

export default function play(board) {

  let legals = board.legals();

  const best = legals.reduce((acc, move) => {
    return betterMove(acc, move);
  });

  return best.uci;
}
