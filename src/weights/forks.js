import { makeDoPosition, exists, isPin, isSkewer, isColor, isKnight, isRook } from './util';

import { mapObj } from '../util2';

import { scale, sum, mul, WeightedSum, Weights, Compose, Weight, WeightsLength, WeightsMix, WeightsArray } from './weight';


export default function weightForks(d, forker) {

  const {
    opts,
    move,
    after,
    afterEval,
    beforeEval,
    usEval,
    themEval,
    usPieces,
    themPieces,
    us,
    them } = d;

  const doPos = makeDoPosition(opts.position, move);

  const forked = forker === us ? them : us,
        forkedEval = forker === us ? themEval : usEval;

  


  return Weight(0);
}
