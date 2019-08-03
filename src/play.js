import { all as allStrategies, NoStrategy } from './strategy';

const max_depth = 1;

export default function play(board, depth = 0) {

  return favorableStrategy(board, depth);
}

function favorableStrategy(board, depth) {
  const legals = board.legals();

  const res = legals.flatMap(move => 
    makeStrategy(move, depth)
  ).reduce((acc, str) => {
    // console.log(str.name, str.counterMove, acc.evaluation(), str.evaluation());
    return (acc.evaluation() > str.evaluation())?acc:str;
  } , NoStrategy(depth));
  // console.log(res);
  return res;
}

function makeStrategy(move, depth) {
  if (!move) {
    return NoStrategy(depth);
  }
  return allStrategies
    .map(_ => _(move, depth))
    .filter(_ => !!_);
}
