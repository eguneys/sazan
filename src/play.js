import { weightMove } from './hint';

export default function play(board, filter, depth = 0) {

  let legals = board.legals();

  filter = filter?filter:() => true;

  legals = legals.filter(filter);

  const weights = legals.map(_ => ({ uci: _.uci, p: weightMove(_, depth) }));

  const best = weights.length > 0 && weights.reduce((acc, _) => acc.p>_.p?acc:_);


  // const values = legals.map(_ => ({
  //   move: _,
  //   v: weightMove(_, depth),
  //   toString: () => {
  //     return _.uci;
  //   }
  // }));

  return {
    // values,
    weights,
    best
  };
}
