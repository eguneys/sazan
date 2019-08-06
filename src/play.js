import { WeightMove } from './hint';

import { weightCompare } from './weight';

export default function play(board, depth = 0, opts = {}) {

  let legals = board.legals();

  legals = legals;

  const weights = legals.map(_ => {
    const weights = new WeightMove(_, depth, opts).get();

    return { uci: _.uci, 
             w: weights,
             p: weights.value()
           };
  });

  const sorted = weights.sort((a, b) => a.p > b.p);

  const best = weights.length > 0 && weights.reduce((acc, _) => acc.p>_.p?acc:_);

  const secondBest = sorted[1];

  if (depth === 0)
    weights
    .filter(_ => _.uci === best.uci || _.uci === 'Qf7+')
    .forEach(_ => console.log(_.uci, _.w.value(), _.w.json()));



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
    best,
    secondBest
  };
}
