import { weightMove } from './hint';

export default function play(board) {

  let legals = board.legals();

  const weights = legals.map(_ => ({ uci: _.uci, p: weightMove(_) }));

  const best = weights.reduce((acc, _) => acc.p>_.p?acc:_).uci;


  const values = legals.map(_ => ({
    move: _,
    v: weightMove(_),
    toString: () => {
      return _.uci;
    }
  }));

  return {
    values,
    weights,
    best
  };
}
