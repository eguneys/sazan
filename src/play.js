import { weightMove } from './hint';

import { weightCompare } from './weight';

export default function play(board, filter, depth = 0) {

  let legals = board.legals();

  filter = filter?filter:() => true;

  legals = legals.filter(filter);

  const weights = legals.map(_ => {
    const weights = weightMove(_, depth);
    return { uci: _.uci, 
             w: weights,
             p: weights.value()
           };
  });

  const best = weights.length > 0 && weights.reduce((acc, _) => acc.p>_.p?acc:_);

  weights
    .filter(_ => _.uci === 'Qf8+' || _.uci === 'Qf7+')
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
    best
  };
}
